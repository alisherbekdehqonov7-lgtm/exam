import { Controller, Get, Put, Patch, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import { JwtAuthGuard, AdminGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from '../../common/interfaces';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Joriy foydalanuvchi profili va statistikasini olish" })
  @ApiResponse({ status: 200, description: 'Profil va stats qaytarildi.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  getProfile(@CurrentUser() user: IJwtPayload) {
    return this.usersService.getProfile(user.sub);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Joriy foydalanuvchi profilini yangilash' })
  @ApiResponse({ status: 200, description: 'Profil yangilandi.' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatosi.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  updateProfile(@CurrentUser() user: IJwtPayload, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Joriy foydalanuvchi parolini almashtirish' })
  @ApiResponse({ status: 200, description: 'Parol yangilandi.' })
  @ApiResponse({ status: 400, description: "Joriy parol noto'g'ri yoki tasdiq mos kelmadi." })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  changePassword(@CurrentUser() user: IJwtPayload, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.sub, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({
    summary: 'Barcha foydalanuvchilar ro\'yxati (faqat admin)',
  })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar ro\'yxati.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  @ApiResponse({ status: 403, description: 'Faqat admin uchun.' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
