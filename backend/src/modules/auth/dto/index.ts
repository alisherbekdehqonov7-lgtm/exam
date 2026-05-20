import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'jane@bookhaven.com', description: 'Foydalanuvchi email manzili' })
  email!: string;

  @ApiProperty({ example: 'StrongPass123!', description: 'Parol (min 6 belgi)' })
  password!: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Jane Doe', description: "Foydalanuvchining to'liq ismi" })
  fullName!: string;

  @ApiProperty({ example: 'jane@bookhaven.com', description: 'Email manzil' })
  email!: string;

  @ApiProperty({ example: 'StrongPass123!', description: 'Parol (min 6 belgi)' })
  password!: string;

  @ApiProperty({ example: 'StrongPass123!', description: 'Parolni qaytarib kiriting' })
  confirmPassword!: string;
}
