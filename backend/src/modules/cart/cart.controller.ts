import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartQuantityDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from '../../common/interfaces';

@ApiTags('Cart')
@ApiBearerAuth('JWT-auth')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Joriy foydalanuvchi savatchasini olish' })
  @ApiResponse({ status: 200, description: 'Savatcha ma\'lumotlari (items + total).' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  getCart(@CurrentUser() user: IJwtPayload) {
    return this.cartService.getCart(user.sub);
  }

  @Post(':bookId')
  @ApiOperation({ summary: 'Kitobni savatchaga qo\'shish' })
  @ApiParam({ name: 'bookId', description: 'Kitob IDsi' })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ status: 201, description: 'Kitob savatchaga qo\'shildi.' })
  @ApiResponse({ status: 404, description: 'Kitob topilmadi.' })
  addToCart(
    @CurrentUser() user: IJwtPayload,
    @Param('bookId') bookId: string,
    @Body() body: AddToCartDto,
  ) {
    return this.cartService.addToCart(user.sub, bookId, body?.quantity);
  }

  @Put(':bookId')
  @ApiOperation({ summary: 'Savatchadagi element miqdorini o\'zgartirish' })
  @ApiParam({ name: 'bookId', description: 'Kitob IDsi' })
  @ApiBody({ type: UpdateCartQuantityDto })
  @ApiResponse({ status: 200, description: 'Miqdor yangilandi.' })
  @ApiResponse({ status: 404, description: 'Savatchada bunday element yo\'q.' })
  updateQuantity(
    @CurrentUser() user: IJwtPayload,
    @Param('bookId') bookId: string,
    @Body() body: UpdateCartQuantityDto,
  ) {
    return this.cartService.updateQuantity(user.sub, bookId, body.quantity);
  }

  @Delete(':bookId')
  @ApiOperation({ summary: 'Kitobni savatchadan olib tashlash' })
  @ApiParam({ name: 'bookId', description: 'Kitob IDsi' })
  @ApiResponse({ status: 200, description: 'Element o\'chirildi.' })
  removeFromCart(@CurrentUser() user: IJwtPayload, @Param('bookId') bookId: string) {
    return this.cartService.removeFromCart(user.sub, bookId);
  }

  @Delete()
  @ApiOperation({ summary: 'Savatchani to\'liq tozalash' })
  @ApiResponse({ status: 200, description: 'Savatcha tozalandi.' })
  clearCart(@CurrentUser() user: IJwtPayload) {
    return this.cartService.clearCart(user.sub);
  }

  @Post('checkout')
  @ApiOperation({
    summary: 'Buyurtmani rasmiylashtirish (checkout)',
    description: 'Joriy savatcha asosida buyurtma yaratadi va savatchani tozalaydi.',
  })
  @ApiResponse({ status: 201, description: 'Buyurtma rasmiylashtirildi.' })
  @ApiResponse({ status: 400, description: 'Savatcha bo\'sh.' })
  checkout(@CurrentUser() user: IJwtPayload) {
    return this.cartService.checkout(user.sub);
  }
}
