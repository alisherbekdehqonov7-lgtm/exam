import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { JwtAuthGuard, AdminGuard } from '../../common/guards/auth.guard';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  @ApiOperation({ summary: 'Mualliflar ro\'yxati (paginatsiya va qidiruv bilan)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Sahifa raqami' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Bir sahifadagi soni' })
  @ApiQuery({ name: 'search', required: false, example: 'murakami', description: 'Ism bo\'yicha qidiruv' })
  @ApiResponse({ status: 200, description: 'Mualliflar ro\'yxati.' })
  getAuthors(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.authorsService.getAuthors(Number(page) || 1, Number(limit) || 10, search);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Eng mashhur mualliflar' })
  @ApiResponse({ status: 200, description: 'Mashhur mualliflar ro\'yxati.' })
  getPopularAuthors() {
    return this.authorsService.getPopularAuthors();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta muallif ma\'lumotlari' })
  @ApiParam({ name: 'id', description: 'Muallif IDsi' })
  @ApiResponse({ status: 200, description: 'Muallif topildi.' })
  @ApiResponse({ status: 404, description: 'Muallif topilmadi.' })
  getAuthorById(@Param('id') id: string) {
    return this.authorsService.getAuthorById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yangi muallif qo\'shish (faqat admin)' })
  @ApiResponse({ status: 201, description: 'Muallif yaratildi.' })
  @ApiResponse({ status: 403, description: 'Faqat admin uchun.' })
  createAuthor(@Body() dto: CreateAuthorDto) {
    return this.authorsService.createAuthor(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Muallifni tahrirlash (faqat admin)' })
  @ApiParam({ name: 'id', description: 'Muallif IDsi' })
  @ApiResponse({ status: 200, description: 'Muallif yangilandi.' })
  @ApiResponse({ status: 403, description: 'Faqat admin uchun.' })
  @ApiResponse({ status: 404, description: 'Muallif topilmadi.' })
  updateAuthor(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.authorsService.updateAuthor(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Muallifni o\'chirish (faqat admin)' })
  @ApiParam({ name: 'id', description: 'Muallif IDsi' })
  @ApiResponse({ status: 200, description: 'Muallif o\'chirildi.' })
  @ApiResponse({ status: 403, description: 'Faqat admin uchun.' })
  deleteAuthor(@Param('id') id: string) {
    return this.authorsService.deleteAuthor(id);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Muallifni follow / unfollow qilish',
    description: 'Holat almashtiriladi (toggle).',
  })
  @ApiParam({ name: 'id', description: 'Muallif IDsi' })
  @ApiResponse({ status: 200, description: 'Follow holati o\'zgardi.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  toggleFollow(@Param('id') id: string) {
    return this.authorsService.toggleFollow(id);
  }
}
