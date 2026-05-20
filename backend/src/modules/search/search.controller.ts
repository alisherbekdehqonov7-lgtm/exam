import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({
    summary: 'Kitoblar va mualliflar bo\'yicha umumiy qidiruv',
    description: 'type=books | authors | all (default).',
  })
  @ApiQuery({ name: 'q', required: true, example: 'midnight', description: 'Qidiruv so\'rovi' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['books', 'authors', 'all'],
    example: 'all',
    description: 'Qidiruv turi',
  })
  @ApiResponse({ status: 200, description: 'Qidiruv natijalari (books + authors).' })
  search(
    @Query('q') query: string,
    @Query('type') type?: 'books' | 'authors' | 'all',
  ) {
    return this.searchService.search(query, type);
  }
}
