import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'The Midnight Library', description: 'Kitob nomi' })
  title!: string;

  @ApiProperty({ example: 'a1b2c3d4', description: 'Muallif IDsi' })
  authorId!: string;

  @ApiProperty({ example: 'A novel about the choices that go into a life well lived...', description: 'Kitob tavsifi' })
  description!: string;

  @ApiProperty({ example: ['Fiction', 'Fantasy'], type: [String], description: 'Janrlar ro\'yxati' })
  genres!: string[];

  @ApiProperty({ example: 19.99, description: 'Narxi (USD)' })
  price!: number;

  @ApiProperty({ example: '978-0-525-55947-4', description: 'ISBN kodi' })
  isbn!: string;

  @ApiProperty({ example: 304, description: 'Sahifalar soni' })
  pages!: number;

  @ApiProperty({ example: 'English', description: 'Til' })
  language!: string;

  @ApiProperty({ example: 'Viking', description: 'Nashriyot' })
  publisher!: string;

  @ApiProperty({ example: '2020-08-13', description: 'Nashr sanasi (YYYY-MM-DD)' })
  publicationDate!: string;

  @ApiPropertyOptional({ enum: ['published', 'draft'], example: 'published', description: 'Holati' })
  status?: 'published' | 'draft';
}

export class UpdateBookDto {
  @ApiPropertyOptional({ example: 'The Midnight Library' })
  title?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4' })
  authorId?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  description?: string;

  @ApiPropertyOptional({ example: ['Fiction'], type: [String] })
  genres?: string[];

  @ApiPropertyOptional({ example: 24.99 })
  price?: number;

  @ApiPropertyOptional({ example: '978-0-525-55947-4' })
  isbn?: string;

  @ApiPropertyOptional({ example: 320 })
  pages?: number;

  @ApiPropertyOptional({ example: 'English' })
  language?: string;

  @ApiPropertyOptional({ example: 'Viking' })
  publisher?: string;

  @ApiPropertyOptional({ example: '2020-08-13' })
  publicationDate?: string;

  @ApiPropertyOptional({ enum: ['published', 'draft'], example: 'published' })
  status?: 'published' | 'draft';

  @ApiPropertyOptional({ example: true, description: 'Hero bo\'limida ko\'rsatilsinmi' })
  isFeatured?: boolean;
}

export class BookQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Sahifa raqami', default: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 12, description: 'Bir sahifadagi elementlar', default: 12 })
  limit?: number;

  @ApiPropertyOptional({ example: 'Fiction,Fantasy', description: 'Vergul bilan ajratilgan janrlar' })
  genre?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4', description: 'Muallif IDsi' })
  author?: string;

  @ApiPropertyOptional({ example: 5, description: 'Minimal narx' })
  minPrice?: number;

  @ApiPropertyOptional({ example: 50, description: 'Maksimal narx' })
  maxPrice?: number;

  @ApiPropertyOptional({ example: 4, description: 'Minimal reyting (0-5)' })
  minRating?: number;

  @ApiPropertyOptional({ example: 'English', description: 'Til bo\'yicha filter' })
  language?: string;

  @ApiPropertyOptional({
    enum: ['newest', 'oldest', 'price_asc', 'price_desc', 'rating', 'popularity'],
    example: 'newest',
    description: 'Saralash tartibi',
  })
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' | 'popularity';

  @ApiPropertyOptional({ example: 'midnight', description: 'Sarlavha bo\'yicha qidiruv' })
  search?: string;
}
