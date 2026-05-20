import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IAuthor, IBook } from '../../common/interfaces';
import { generateId, paginate, now } from '../../common/utils/helpers';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Get all authors with pagination
   */
  getAuthors(page = 1, limit = 10, search?: string) {
    let authors = this.db.read<IAuthor>('authors');

    if (search) {
      const s = search.toLowerCase();
      authors = authors.filter(
        (a) =>
          a.fullName.toLowerCase().includes(s) ||
          a.nationality.toLowerCase().includes(s),
      );
    }

    // Sort by followers desc
    authors.sort((a, b) => b.followers - a.followers);

    return paginate(authors, page, limit);
  }

  /**
   * Get popular authors (top 10 by followers)
   */
  getPopularAuthors() {
    return this.db.read<IAuthor>('authors')
      .sort((a, b) => b.followers - a.followers)
      .slice(0, 10);
  }

  /**
   * Get single author with their books
   */
  getAuthorById(authorId: string) {
    const author = this.db.findOne<IAuthor>('authors', (a) => a.id === authorId);
    if (!author) throw new NotFoundException('Author not found');

    const books = this.db.findMany<IBook>('books', (b) => b.authorId === authorId && b.status === 'published');
    const avgRating = books.length > 0
      ? Math.round((books.reduce((sum, b) => sum + b.rating, 0) / books.length) * 10) / 10
      : 0;

    return {
      ...author,
      booksCount: books.length,
      avgRating,
      books,
    };
  }

  /**
   * Create a new author (admin only)
   */
  createAuthor(dto: CreateAuthorDto) {
    if (!dto.fullName) throw new BadRequestException('Full name is required');

    const author: IAuthor = {
      id: generateId('auth'),
      fullName: dto.fullName,
      biography: dto.biography || '',
      dateOfBirth: dto.dateOfBirth || '',
      nationality: dto.nationality || '',
      notableWorks: dto.notableWorks || [],
      photo: null,
      website: dto.website || null,
      socialMedia: dto.socialMedia || null,
      followers: 0,
      createdAt: now(),
    };

    this.db.insertOne('authors', author);
    return { message: 'Author created successfully', author };
  }

  /**
   * Update an author (admin only)
   */
  updateAuthor(authorId: string, dto: UpdateAuthorDto) {
    const author = this.db.findOne<IAuthor>('authors', (a) => a.id === authorId);
    if (!author) throw new NotFoundException('Author not found');

    const updated = this.db.updateOne<IAuthor>('authors', (a) => a.id === authorId, dto);
    return { message: 'Author updated successfully', author: updated };
  }

  /**
   * Delete an author (admin only)
   */
  deleteAuthor(authorId: string) {
    const deleted = this.db.deleteOne<IAuthor>('authors', (a) => a.id === authorId);
    if (!deleted) throw new NotFoundException('Author not found');
    return { message: 'Author deleted successfully' };
  }

  /**
   * Follow/unfollow an author
   */
  toggleFollow(authorId: string) {
    const author = this.db.findOne<IAuthor>('authors', (a) => a.id === authorId);
    if (!author) throw new NotFoundException('Author not found');

    // Simple toggle (increment/decrement followers count)
    this.db.updateOne<IAuthor>(
      'authors',
      (a) => a.id === authorId,
      { followers: author.followers + 1 },
    );

    return { message: 'Author followed successfully', followers: author.followers + 1 };
  }
}
