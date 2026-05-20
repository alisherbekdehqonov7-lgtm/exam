import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IReview, IBook, IUser } from '../../common/interfaces';
import { generateId, now } from '../../common/utils/helpers';

@Injectable()
export class ReviewsService {
  constructor(private readonly db: DatabaseService) {}

  /** Get reviews for a book with user info and rating breakdown */
  getBookReviews(bookId: string) {
    const reviews = this.db.findMany<IReview>('reviews', (r) => r.bookId === bookId);
    const users = this.db.read<IUser>('users');

    // Rating breakdown
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (breakdown[r.rating] !== undefined) breakdown[r.rating]++;
    });

    const total = reviews.length;
    const avgRating = total > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
      : 0;

    const enriched = reviews
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((review) => {
        const user = users.find((u) => u.id === review.userId);
        return {
          ...review,
          user: user ? { id: user.id, fullName: user.fullName, avatar: user.avatar } : null,
        };
      });

    return {
      reviews: enriched,
      stats: {
        total,
        avgRating,
        breakdown: Object.entries(breakdown)
          .map(([stars, count]) => ({
            stars: Number(stars),
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          }))
          .sort((a, b) => b.stars - a.stars),
      },
    };
  }

  /** Create a review */
  createReview(userId: string, bookId: string, rating: number, text: string) {
    const book = this.db.findOne<IBook>('books', (b) => b.id === bookId);
    if (!book) throw new NotFoundException('Book not found');

    if (!rating || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if user already reviewed
    const existing = this.db.findOne<IReview>(
      'reviews',
      (r) => r.userId === userId && r.bookId === bookId,
    );
    if (existing) throw new BadRequestException('You have already reviewed this book');

    const review: IReview = {
      id: generateId('rev'),
      userId,
      bookId,
      rating,
      text: text || '',
      createdAt: now(),
    };

    this.db.insertOne('reviews', review);

    // Update book's average rating
    const allReviews = this.db.findMany<IReview>('reviews', (r) => r.bookId === bookId);
    const newAvg = Math.round(
      (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10,
    ) / 10;

    this.db.updateOne<IBook>('books', (b) => b.id === bookId, {
      rating: newAvg,
      totalReviews: allReviews.length,
    });

    return { message: 'Review created successfully', review };
  }

  /** Delete a review */
  deleteReview(userId: string, reviewId: string) {
    const review = this.db.findOne<IReview>('reviews', (r) => r.id === reviewId);
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId) throw new BadRequestException('You can only delete your own reviews');

    this.db.deleteOne<IReview>('reviews', (r) => r.id === reviewId);

    // Recalculate rating
    const allReviews = this.db.findMany<IReview>('reviews', (r) => r.bookId === review.bookId);
    const newAvg = allReviews.length > 0
      ? Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10) / 10
      : 0;

    this.db.updateOne<IBook>('books', (b) => b.id === review.bookId, {
      rating: newAvg,
      totalReviews: allReviews.length,
    });

    return { message: 'Review deleted successfully' };
  }

  /** Get user's reviews */
  getUserReviews(userId: string) {
    const reviews = this.db.findMany<IReview>('reviews', (r) => r.userId === userId);
    const books = this.db.read<IBook>('books');

    return reviews.map((review) => {
      const book = books.find((b) => b.id === review.bookId);
      return { ...review, book: book ? { id: book.id, title: book.title } : null };
    });
  }
}
