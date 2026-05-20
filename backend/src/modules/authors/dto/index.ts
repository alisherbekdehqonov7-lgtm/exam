import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Haruki Murakami', description: 'Muallifning to\'liq ismi' })
  fullName!: string;

  @ApiProperty({ example: 'Japanese writer best known for...', description: 'Biografiya' })
  biography!: string;

  @ApiProperty({ example: '1949-01-12', description: 'Tug\'ilgan sana (YYYY-MM-DD)' })
  dateOfBirth!: string;

  @ApiProperty({ example: 'Japanese', description: 'Millati' })
  nationality!: string;

  @ApiPropertyOptional({
    example: ['Norwegian Wood', 'Kafka on the Shore'],
    type: [String],
    description: 'Mashhur asarlar',
  })
  notableWorks?: string[];

  @ApiPropertyOptional({ example: 'https://harukimurakami.com', description: 'Veb-sayt' })
  website?: string;

  @ApiPropertyOptional({ example: '@harukimurakami', description: 'Ijtimoiy tarmoq' })
  socialMedia?: string;
}

export class UpdateAuthorDto {
  @ApiPropertyOptional({ example: 'Haruki Murakami' })
  fullName?: string;

  @ApiPropertyOptional({ example: 'Updated biography' })
  biography?: string;

  @ApiPropertyOptional({ example: '1949-01-12' })
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'Japanese' })
  nationality?: string;

  @ApiPropertyOptional({ example: ['Norwegian Wood'], type: [String] })
  notableWorks?: string[];

  @ApiPropertyOptional({ example: 'https://harukimurakami.com' })
  website?: string;

  @ApiPropertyOptional({ example: '@harukimurakami' })
  socialMedia?: string;
}
