import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Jane Doe', description: "To'liq ism" })
  fullName?: string;

  @ApiPropertyOptional({ example: 'janedoe', description: 'Foydalanuvchi nomi (username)' })
  username?: string;

  @ApiPropertyOptional({ example: 'jane@bookhaven.com', description: 'Email manzil' })
  email?: string;

  @ApiPropertyOptional({ example: 'Books are my world.', description: 'Foydalanuvchi haqida' })
  bio?: string;

  @ApiPropertyOptional({ example: '+998 90 123 45 67', description: 'Telefon raqami' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Uzbekistan', description: 'Davlat' })
  country?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPass123!', description: 'Joriy parol' })
  currentPassword!: string;

  @ApiProperty({ example: 'NewPass456!', description: 'Yangi parol (min 6 belgi)' })
  newPassword!: string;

  @ApiProperty({ example: 'NewPass456!', description: 'Yangi parolni tasdiqlash' })
  confirmPassword!: string;
}
