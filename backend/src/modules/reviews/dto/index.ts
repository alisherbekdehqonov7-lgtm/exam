import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5, description: 'Reyting (1-5)' })
  rating!: number;

  @ApiProperty({
    example: 'Loved this book! Highly recommend.',
    description: 'Sharh matni',
  })
  text!: string;
}
