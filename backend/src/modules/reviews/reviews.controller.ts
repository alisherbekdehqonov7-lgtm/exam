import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from '../../common/interfaces';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('book/:bookId')
  @ApiOperation({ summary: 'Tanlangan kitob bo\'yicha barcha sharhlar' })
  @ApiParam({ name: 'bookId', description: 'Kitob IDsi' })
  @ApiResponse({ status: 200, description: 'Sharhlar ro\'yxati.' })
  getBookReviews(@Param('bookId') bookId: string) {
    return this.reviewsService.getBookReviews(bookId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Joriy foydalanuvchining barcha sharhlari' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi sharhlari.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  getMyReviews(@CurrentUser() user: IJwtPayload) {
    return this.reviewsService.getUserReviews(user.sub);
  }

  @Post('book/:bookId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kitobga yangi sharh qoldirish' })
  @ApiParam({ name: 'bookId', description: 'Kitob IDsi' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Sharh yaratildi.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  @ApiResponse({ status: 404, description: 'Kitob topilmadi.' })
  createReview(
    @CurrentUser() user: IJwtPayload,
    @Param('bookId') bookId: string,
    @Body() body: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(user.sub, bookId, body.rating, body.text);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sharhni o\'chirish (faqat egasi)' })
  @ApiParam({ name: 'id', description: 'Sharh IDsi' })
  @ApiResponse({ status: 200, description: 'Sharh o\'chirildi.' })
  @ApiResponse({ status: 403, description: 'Faqat sharh egasi o\'chira oladi.' })
  @ApiResponse({ status: 404, description: 'Sharh topilmadi.' })
  deleteReview(@CurrentUser() user: IJwtPayload, @Param('id') id: string) {
    return this.reviewsService.deleteReview(user.sub, id);
  }
}
