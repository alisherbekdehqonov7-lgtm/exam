import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from '../../common/interfaces';

@ApiTags('Favorites')
@ApiBearerAuth('JWT-auth')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchining barcha sevimli kitoblari' })
  @ApiResponse({ status: 200, description: 'Sevimli kitoblar ro\'yxati.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  getUserFavorites(@CurrentUser() user: IJwtPayload) {
    return this.favoritesService.getUserFavorites(user.sub);
  }

  @Post(':bookId')
  @ApiOperation({
    summary: 'Sevimliga qo\'shish / olib tashlash (toggle)',
  })
  @ApiParam({ name: 'bookId', description: 'Kitob IDsi' })
  @ApiResponse({ status: 200, description: 'Sevimli holati o\'zgardi.' })
  @ApiResponse({ status: 404, description: 'Kitob topilmadi.' })
  toggleFavorite(@CurrentUser() user: IJwtPayload, @Param('bookId') bookId: string) {
    return this.favoritesService.toggleFavorite(user.sub, bookId);
  }

  @Get('check/:bookId')
  @ApiOperation({ summary: 'Kitob sevimlilar ro\'yxatida bormi tekshirish' })
  @ApiParam({ name: 'bookId', description: 'Kitob IDsi' })
  @ApiResponse({ status: 200, description: '{ isFavorited: boolean }' })
  checkFavorite(@CurrentUser() user: IJwtPayload, @Param('bookId') bookId: string) {
    return { isFavorited: this.favoritesService.isFavorited(user.sub, bookId) };
  }

  @Delete(':bookId')
  @ApiOperation({ summary: 'Sevimlilardan olib tashlash' })
  @ApiParam({ name: 'bookId', description: 'Kitob IDsi' })
  @ApiResponse({ status: 200, description: 'Sevimlilardan o\'chirildi.' })
  removeFavorite(@CurrentUser() user: IJwtPayload, @Param('bookId') bookId: string) {
    return this.favoritesService.removeFavorite(user.sub, bookId);
  }
}
