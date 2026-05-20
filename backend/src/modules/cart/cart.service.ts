import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ICartItem, IBook, IAuthor } from '../../common/interfaces';
import { generateId, now } from '../../common/utils/helpers';

@Injectable()
export class CartService {
  constructor(private readonly db: DatabaseService) {}

  /** Get user's cart with book details and totals */
  getCart(userId: string) {
    const cartItems = this.db.findMany<ICartItem>('cart', (c) => c.userId === userId);
    const books = this.db.read<IBook>('books');
    const authors = this.db.read<IAuthor>('authors');

    const items = cartItems.map((item) => {
      const book = books.find((b) => b.id === item.bookId);
      const author = book ? authors.find((a) => a.id === book.authorId) : null;
      return {
        ...item,
        book: book
          ? {
              id: book.id,
              title: book.title,
              price: book.price,
              coverImage: book.coverImage,
              author: author ? { id: author.id, fullName: author.fullName } : null,
            }
          : null,
        subtotal: book ? book.price * item.quantity : 0,
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const shipping = subtotal > 0 ? 4.99 : 0;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    return {
      items,
      summary: {
        itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: Math.round(subtotal * 100) / 100,
        shipping,
        tax,
        total,
      },
    };
  }

  /** Add item to cart */
  addToCart(userId: string, bookId: string, quantity = 1) {
    const book = this.db.findOne<IBook>('books', (b) => b.id === bookId);
    if (!book) throw new NotFoundException('Book not found');

    // Check if already in cart
    const existing = this.db.findOne<ICartItem>(
      'cart',
      (c) => c.userId === userId && c.bookId === bookId,
    );

    if (existing) {
      this.db.updateOne<ICartItem>(
        'cart',
        (c) => c.id === existing.id,
        { quantity: existing.quantity + quantity },
      );
      return { message: 'Cart updated', quantity: existing.quantity + quantity };
    }

    const cartItem: ICartItem = {
      id: generateId('cart'),
      userId,
      bookId,
      quantity,
      createdAt: now(),
    };

    this.db.insertOne('cart', cartItem);
    return { message: 'Added to cart' };
  }

  /** Update cart item quantity */
  updateQuantity(userId: string, bookId: string, quantity: number) {
    if (quantity < 1) throw new BadRequestException('Quantity must be at least 1');

    const item = this.db.findOne<ICartItem>(
      'cart',
      (c) => c.userId === userId && c.bookId === bookId,
    );
    if (!item) throw new NotFoundException('Item not in cart');

    this.db.updateOne<ICartItem>('cart', (c) => c.id === item.id, { quantity });
    return { message: 'Quantity updated' };
  }

  /** Remove item from cart */
  removeFromCart(userId: string, bookId: string) {
    const deleted = this.db.deleteOne<ICartItem>(
      'cart',
      (c) => c.userId === userId && c.bookId === bookId,
    );
    if (!deleted) throw new NotFoundException('Item not in cart');
    return { message: 'Removed from cart' };
  }

  /** Clear entire cart */
  clearCart(userId: string) {
    const count = this.db.deleteMany<ICartItem>('cart', (c) => c.userId === userId);
    return { message: `Cart cleared (${count} items removed)` };
  }

  /** Checkout (simplified — just clear cart) */
  checkout(userId: string) {
    const cart = this.getCart(userId);
    if (cart.items.length === 0) throw new BadRequestException('Cart is empty');

    this.db.deleteMany<ICartItem>('cart', (c) => c.userId === userId);

    return {
      message: 'Order placed successfully!',
      orderId: generateId('ord'),
      total: cart.summary.total,
      itemCount: cart.summary.itemCount,
    };
  }
}
