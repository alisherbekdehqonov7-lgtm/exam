import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CartModule } from './modules/cart/cart.module';
import { SearchModule } from './modules/search/search.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    BooksModule,
    AuthorsModule,
    FavoritesModule,
    ReviewsModule,
    CartModule,
    SearchModule,
    NotificationsModule,
  ],
})
export class AppModule {}
