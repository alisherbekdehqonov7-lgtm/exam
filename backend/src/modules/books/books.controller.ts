import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto, BookQueryDto } from './dto';
import { JwtAuthGuard, AdminGuard } from '../../common/guards/auth.guard';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({
    summary: 'Kitoblar ro\'yxati',
    description: 'Filter, sort va paginatsiya bilan barcha kitoblarni qaytaradi.',
  })
  @ApiResponse({ status: 200, description: 'Kitoblar ro\'yxati va meta ma\'lumot.' })
  getBooks(@Query() query: BookQueryDto) {
    return this.booksService.getBooks(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Hero bo\'limi uchun tanlangan kitoblar' })
  @ApiResponse({ status: 200, description: 'Featured kitoblar ro\'yxati.' })
  getFeaturedBooks() {
    return this.booksService.getFeaturedBooks();
  }

  @Get('new-arrivals')
  @ApiOperation({ summary: 'Eng yangi 10 ta kitob' })
  @ApiResponse({ status: 200, description: 'Yangi kelgan kitoblar.' })
  getNewArrivals() {
    return this.booksService.getNewArrivals();
  }

  @Get('genres')
  @ApiOperation({ summary: 'Janrlar va ularga tegishli kitoblar soni' })
  @ApiResponse({ status: 200, description: 'Janrlar ro\'yxati.' })
  getGenres() {
    return this.booksService.getGenres();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Bitta kitob ma\'lumotlari',
    description: 'Tanlangan kitob va o\'xshash kitoblarni qaytaradi.',
  })
  @ApiParam({ name: 'id', description: 'Kitob IDsi' })
  @ApiResponse({ status: 200, description: 'Kitob ma\'lumotlari.' })
  @ApiResponse({ status: 404, description: 'Kitob topilmadi.' })
  getBookById(@Param('id') id: string) {
    return this.booksService.getBookById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yangi kitob qo\'shish (faqat admin)' })
  @ApiResponse({ status: 201, description: 'Kitob yaratildi.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  @ApiResponse({ status: 403, description: 'Faqat admin uchun.' })
  createBook(@Body() dto: CreateBookDto) {
    return this.booksService.createBook(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kitobni tahrirlash (faqat admin)' })
  @ApiParam({ name: 'id', description: 'Kitob IDsi' })
  @ApiResponse({ status: 200, description: 'Kitob yangilandi.' })
  @ApiResponse({ status: 403, description: 'Faqat admin uchun.' })
  @ApiResponse({ status: 404, description: 'Kitob topilmadi.' })
  updateBook(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.updateBook(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kitobni o\'chirish (faqat admin)' })
  @ApiParam({ name: 'id', description: 'Kitob IDsi' })
  @ApiResponse({ status: 200, description: 'Kitob o\'chirildi.' })
  @ApiResponse({ status: 403, description: 'Faqat admin uchun.' })
  @ApiResponse({ status: 404, description: 'Kitob topilmadi.' })
  deleteBook(@Param('id') id: string) {
    return this.booksService.deleteBook(id);
  }
}
