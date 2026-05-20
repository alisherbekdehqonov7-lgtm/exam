import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private dbPath!: string;
  private cache: Map<string, any[]> = new Map();

  onModuleInit() {
    this.dbPath = path.join(process.cwd(), 'src', 'database');
    // Ensure database directory exists
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(this.dbPath, { recursive: true });
    }
  }

  private getFilePath(collection: string): string {
    return path.join(this.dbPath, `${collection}.json`);
  }

  /**
   * Read entire collection from JSON file
   */
  read<T = any>(collection: string): T[] {
    const filePath = this.getFilePath(collection);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf-8');
      return [];
    }

    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      this.cache.set(collection, data);
      return data as T[];
    } catch {
      return [];
    }
  }

  /**
   * Write entire collection to JSON file
   */
  write<T = any>(collection: string, data: T[]): void {
    const filePath = this.getFilePath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    this.cache.set(collection, data);
  }

  /**
   * Find one item by predicate
   */
  findOne<T = any>(collection: string, predicate: (item: T) => boolean): T | undefined {
    const data = this.read<T>(collection);
    return data.find(predicate);
  }

  /**
   * Find many items by predicate
   */
  findMany<T = any>(collection: string, predicate?: (item: T) => boolean): T[] {
    const data = this.read<T>(collection);
    return predicate ? data.filter(predicate) : data;
  }

  /**
   * Insert one item
   */
  insertOne<T = any>(collection: string, item: T): T {
    const data = this.read<T>(collection);
    data.push(item);
    this.write(collection, data);
    return item;
  }

  /**
   * Update one item by predicate
   */
  updateOne<T = any>(
    collection: string,
    predicate: (item: T) => boolean,
    updates: Partial<T>,
  ): T | null {
    const data = this.read<T>(collection);
    const index = data.findIndex(predicate);

    if (index === -1) return null;

    data[index] = { ...data[index], ...updates };
    this.write(collection, data);
    return data[index];
  }

  /**
   * Delete one item by predicate
   */
  deleteOne<T = any>(collection: string, predicate: (item: T) => boolean): boolean {
    const data = this.read<T>(collection);
    const index = data.findIndex(predicate);

    if (index === -1) return false;

    data.splice(index, 1);
    this.write(collection, data);
    return true;
  }

  /**
   * Delete many items by predicate
   */
  deleteMany<T = any>(collection: string, predicate: (item: T) => boolean): number {
    const data = this.read<T>(collection);
    const before = data.length;
    const filtered = data.filter((item) => !predicate(item));
    this.write(collection, filtered);
    return before - filtered.length;
  }

  /**
   * Count items by predicate
   */
  count<T = any>(collection: string, predicate?: (item: T) => boolean): number {
    const data = this.read<T>(collection);
    return predicate ? data.filter(predicate).length : data.length;
  }
}
