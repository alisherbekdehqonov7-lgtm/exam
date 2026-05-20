import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiPropertyOptional({ example: 1, description: 'Qo\'shiladigan miqdor', default: 1 })
  quantity?: number;
}

export class UpdateCartQuantityDto {
  @ApiProperty({ example: 2, description: 'Yangi miqdor (>= 1)' })
  quantity!: number;
}
