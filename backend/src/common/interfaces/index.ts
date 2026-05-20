// ========== USER ==========
export interface IUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  phone: string;
  country: string;
  avatar: string | null;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

// ========== BOOK ==========
export interface IBook {
  id: string;
  title: string;
  authorId: string;
  description: string;
  genres: string[];
  price: number;
  isbn: string;
  pages: number;
  language: string;
  publisher: string;
  publicationDate: string;
  coverImage: string | null;
  rating: number;
  totalReviews: number;
  status: 'published' | 'draft';
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== AUTHOR ==========
export interface IAuthor {
  id: string;
  fullName: string;
  biography: string;
  dateOfBirth: string;
  nationality: string;
  notableWorks: string[];
  photo: string | null;
  website: string | null;
  socialMedia: string | null;
  followers: number;
  createdAt: string;
}

// ========== FAVORITE ==========
export interface IFavorite {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
}

// ========== REVIEW ==========
export interface IReview {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  text: string;
  createdAt: string;
}

// ========== CART ==========
export interface ICartItem {
  id: string;
  userId: string;
  bookId: string;
  quantity: number;
  createdAt: string;
}

// ========== NOTIFICATION ==========
export interface INotification {
  id: string;
  userId: string;
  type: 'new_book' | 'price_drop' | 'author_update' | 'review_like' | 'weekly_digest';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ========== PAGINATION ==========
export interface IPaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ========== JWT PAYLOAD ==========
export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
}
