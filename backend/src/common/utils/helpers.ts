import { IPaginatedResult } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a prefixed unique ID
 */
export function generateId(prefix: string): string {
  return `${prefix}_${uuidv4().split('-')[0]}`;
}

/**
 * Paginate an array of items
 */
export function paginate<T>(
  items: T[],
  page: number = 1,
  limit: number = 10,
): IPaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (safePage - 1) * limit;
  const data = items.slice(start, start + limit);

  return {
    data,
    meta: {
      total,
      page: safePage,
      limit,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };
}

/**
 * Get current ISO date string
 */
export function now(): string {
  return new Date().toISOString();
}
