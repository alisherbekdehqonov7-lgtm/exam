import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IBook, IAuthor } from '../../common/interfaces';

@Injectable()
export class SearchService {
  constructor(private readonly db: DatabaseService) {}

  /** Unified search across books and authors */
  search(query: string, type?: 'books' | 'authors' | 'all') {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }

    const q = query.toLowerCase().trim();
    const searchType = type || 'all';

    let books: Array<IBook & { author: { id: string; fullName: string } | null }> = [];
    let authors: IAuthor[] = [];

    if (searchType === 'all' || searchType === 'books') {
      const allBooks = this.db.read<IBook>('books').filter((b) => b.status === 'published');
      const allAuthors = this.db.read<IAuthor>('authors');

      books = allBooks
        .filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q) ||
            b.genres.some((g) => g.toLowerCase().includes(q)) ||
            b.isbn.includes(q),
        )
        .map((book) => {
          const author = allAuthors.find((a) => a.id === book.authorId);
          return {
            ...book,
            author: author ? { id: author.id, fullName: author.fullName } : null,
          };
        });
    }

    if (searchType === 'all' || searchType === 'authors') {
      authors = this.db.read<IAuthor>('authors').filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.biography.toLowerCase().includes(q) ||
          a.nationality.toLowerCase().includes(q) ||
          a.notableWorks.some((w) => w.toLowerCase().includes(q)),
      );
    }

    return {
      query,
      results: {
        books: { data: books, count: books.length },
        authors: { data: authors, count: authors.length },
      },
      totalResults: books.length + authors.length,
    };
  }
}
