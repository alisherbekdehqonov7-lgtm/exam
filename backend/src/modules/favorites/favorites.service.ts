import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IFavorite, IBook, IAuthor } from '../../common/interfaces';
import { generateId, now } from '../../common/utils/helpers';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DatabaseService) {}

  /** Get all favorites for a user */
  getUserFavorites(userId: string) {
    const favorites = this.db.findMany<IFavorite>('favorites', (f) => f.userId === userId);
    const books = this.db.read<IBook>('books');
    const authors = this.db.read<IAuthor>('authors');

    return favorites
      .map((fav) => {
        const book = books.find((b) => b.id === fav.bookId);
        if (!book) return null;
        const author = authors.find((a) => a.id === book.authorId);
        return {
          favoriteId: fav.id,
          addedAt: fav.createdAt,
          book: { ...book, author: author ? { id: author.id, fullName: author.fullName } : null },
        };
      })
      .filter(Boolean);
  }

  /** Add book to favorites (toggle) */
  toggleFavorite(userId: string, bookId: string) {
    // Check book exists
    const book = this.db.findOne<IBook>('books', (b) => b.id === bookId);
    if (!book) throw new NotFoundException('Book not found');

    // Check if already favorited
    const existing = this.db.findOne<IFavorite>(
      'favorites',
      (f) => f.userId === userId && f.bookId === bookId,
    );

    if (existing) {
      // Remove from favorites
      this.db.deleteOne<IFavorite>(
        'favorites',
        (f) => f.userId === userId && f.bookId === bookId,
      );
      return { message: 'Removed from favorites', isFavorited: false };
    }

    // Add to favorites
    const favorite: IFavorite = {
      id: generateId('fav'),
      userId,
      bookId,
      createdAt: now(),
    };

    this.db.insertOne('favorites', favorite);
    return { message: 'Added to favorites', isFavorited: true };
  }

  /** Check if a book is favorited by user */
  isFavorited(userId: string, bookId: string): boolean {
    return !!this.db.findOne<IFavorite>(
      'favorites',
      (f) => f.userId === userId && f.bookId === bookId,
    );
  }

  /** Remove from favorites */
  removeFavorite(userId: string, bookId: string) {
    const deleted = this.db.deleteOne<IFavorite>(
      'favorites',
      (f) => f.userId === userId && f.bookId === bookId,
    );
    if (!deleted) throw new NotFoundException('Favorite not found');
    return { message: 'Removed from favorites' };
  }
}
