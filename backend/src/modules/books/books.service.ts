import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IBook, IAuthor } from '../../common/interfaces';
import { generateId, paginate, now } from '../../common/utils/helpers';
import { CreateBookDto, UpdateBookDto, BookQueryDto } from './dto';

@Injectable()
export class BooksService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Get all books with filters, sorting, and pagination
   */
  getBooks(query: BookQueryDto) {
    let books = this.db.read<IBook>('books');

    // --- FILTERS ---

    // Genre filter (comma-separated)
    if (query.genre) {
      const genres = query.genre.split(',').map((g) => g.trim().toLowerCase());
      books = books.filter((b) =>
        b.genres.some((g) => genres.includes(g.toLowerCase())),
      );
    }

    // Author filter
    if (query.author) {
      books = books.filter((b) => b.authorId === query.author);
    }

    // Price range
    if (query.minPrice !== undefined) {
      books = books.filter((b) => b.price >= Number(query.minPrice));
    }
    if (query.maxPrice !== undefined) {
      books = books.filter((b) => b.price <= Number(query.maxPrice));
    }

    // Rating filter
    if (query.minRating !== undefined) {
      books = books.filter((b) => b.rating >= Number(query.minRating));
    }

    // Language filter
    if (query.language) {
      const lang = query.language;
      books = books.filter(
        (b) => b.language.toLowerCase() === lang.toLowerCase(),
      );
    }

    // Search (title & description)
    if (query.search) {
      const s = query.search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          b.description.toLowerCase().includes(s),
      );
    }

    // Only published books for public
    books = books.filter((b) => b.status === 'published');

    // --- SORTING ---
    switch (query.sort) {
      case 'newest':
        books.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        books.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price_asc':
        books.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        books.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        books.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        books.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      default:
        books.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Enrich with author name
    const authors = this.db.read<IAuthor>('authors');
    const enriched = books.map((book) => {
      const author = authors.find((a) => a.id === book.authorId);
      return { ...book, author: author ? { id: author.id, fullName: author.fullName } : null };
    });

    // --- PAGINATION ---
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;

    return paginate(enriched, page, limit);
  }

  /**
   * Get single book by ID with full details
   */
  getBookById(bookId: string) {
    const book = this.db.findOne<IBook>('books', (b) => b.id === bookId);
    if (!book) throw new NotFoundException('Book not found');

    const author = this.db.findOne<IAuthor>('authors', (a) => a.id === book.authorId);

    // Get related books (same genre, exclude current)
    const allBooks = this.db.read<IBook>('books');
    const related = allBooks
      .filter(
        (b) =>
          b.id !== bookId &&
          b.status === 'published' &&
          b.genres.some((g) => book.genres.includes(g)),
      )
      .slice(0, 4)
      .map((b) => {
        const a = this.db.findOne<IAuthor>('authors', (a) => a.id === b.authorId);
        return { ...b, author: a ? { id: a.id, fullName: a.fullName } : null };
      });

    return {
      ...book,
      author: author || null,
      relatedBooks: related,
    };
  }

  /**
   * Get featured books
   */
  getFeaturedBooks() {
    const books = this.db.findMany<IBook>('books', (b) => b.isFeatured && b.status === 'published');
    const authors = this.db.read<IAuthor>('authors');

    return books.map((book) => {
      const author = authors.find((a) => a.id === book.authorId);
      return { ...book, author: author ? { id: author.id, fullName: author.fullName } : null };
    });
  }

  /**
   * Get new arrivals (latest 10 books)
   */
  getNewArrivals() {
    const books = this.db.read<IBook>('books')
      .filter((b) => b.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const authors = this.db.read<IAuthor>('authors');
    return books.map((book) => {
      const author = authors.find((a) => a.id === book.authorId);
      return { ...book, author: author ? { id: author.id, fullName: author.fullName } : null };
    });
  }

  /**
   * Get all unique genres with count
   */
  getGenres() {
    const books = this.db.read<IBook>('books').filter((b) => b.status === 'published');
    const genreMap = new Map<string, number>();

    books.forEach((b) => {
      b.genres.forEach((g) => {
        genreMap.set(g, (genreMap.get(g) || 0) + 1);
      });
    });

    return Array.from(genreMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Create a new book (admin only)
   */
  createBook(dto: CreateBookDto) {
    if (!dto.title || !dto.authorId) {
      throw new BadRequestException('Title and author are required');
    }

    // Verify author exists
    const author = this.db.findOne<IAuthor>('authors', (a) => a.id === dto.authorId);
    if (!author) throw new BadRequestException('Author not found');

    const book: IBook = {
      id: generateId('book'),
      title: dto.title,
      authorId: dto.authorId,
      description: dto.description || '',
      genres: dto.genres || [],
      price: dto.price || 0,
      isbn: dto.isbn || '',
      pages: dto.pages || 0,
      language: dto.language || 'English',
      publisher: dto.publisher || '',
      publicationDate: dto.publicationDate || '',
      coverImage: null,
      rating: 0,
      totalReviews: 0,
      status: dto.status || 'draft',
      isFeatured: false,
      createdAt: now(),
      updatedAt: now(),
    };

    this.db.insertOne('books', book);

    return { message: 'Book created successfully', book };
  }

  /**
   * Update a book (admin only)
   */
  updateBook(bookId: string, dto: UpdateBookDto) {
    const book = this.db.findOne<IBook>('books', (b) => b.id === bookId);
    if (!book) throw new NotFoundException('Book not found');

    const updated = this.db.updateOne<IBook>(
      'books',
      (b) => b.id === bookId,
      { ...dto, updatedAt: now() },
    );

    return { message: 'Book updated successfully', book: updated };
  }

  /**
   * Delete a book (admin only)
   */
  deleteBook(bookId: string) {
    const deleted = this.db.deleteOne<IBook>('books', (b) => b.id === bookId);
    if (!deleted) throw new NotFoundException('Book not found');

    // Also remove from favorites, cart, and reviews
    this.db.deleteMany('favorites', (f: any) => f.bookId === bookId);
    this.db.deleteMany('cart', (c: any) => c.bookId === bookId);
    this.db.deleteMany('reviews', (r: any) => r.bookId === bookId);

    return { message: 'Book deleted successfully' };
  }
}
