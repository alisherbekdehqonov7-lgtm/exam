import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../database/database.service';
import { IUser, IFavorite, IReview } from '../../common/interfaces';
import { now } from '../../common/utils/helpers';
import { UpdateProfileDto, ChangePasswordDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Get user profile with stats
   */
  getProfile(userId: string) {
    const user = this.db.findOne<IUser>('users', (u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    const favoritesCount = this.db.count<IFavorite>('favorites', (f) => f.userId === userId);
    const reviewsCount = this.db.count<IReview>('reviews', (r) => r.userId === userId);

    const { password, ...profile } = user;

    return {
      ...profile,
      stats: {
        booksRead: favoritesCount + reviewsCount, // simplified
        favoritesCount,
        reviewsWritten: reviewsCount,
      },
    };
  }

  /**
   * Update user profile
   */
  updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = this.db.findOne<IUser>('users', (u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    // Check unique username
    if (dto.username && dto.username !== user.username) {
      const existing = this.db.findOne<IUser>('users', (u) => u.username === dto.username);
      if (existing) throw new BadRequestException('Username is already taken');
    }

    // Check unique email
    if (dto.email && dto.email !== user.email) {
      const existing = this.db.findOne<IUser>('users', (u) => u.email === dto.email);
      if (existing) throw new BadRequestException('Email is already registered');
    }

    const updated = this.db.updateOne<IUser>(
      'users',
      (u) => u.id === userId,
      { ...dto, updatedAt: now() },
    );

    if (!updated) throw new NotFoundException('User not found');
    const { password, ...profile } = updated;
    return { message: 'Profile updated successfully', user: profile };
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (!dto.currentPassword || !dto.newPassword || !dto.confirmPassword) {
      throw new BadRequestException('All password fields are required');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    if (dto.newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const user = this.db.findOne<IUser>('users', (u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    this.db.updateOne<IUser>(
      'users',
      (u) => u.id === userId,
      { password: hashedPassword, updatedAt: now() },
    );

    return { message: 'Password changed successfully' };
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers() {
    const users = this.db.read<IUser>('users');
    return users.map(({ password, ...u }) => u);
  }
}
