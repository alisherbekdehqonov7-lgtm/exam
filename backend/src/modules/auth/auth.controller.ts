import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";
import { JwtAuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { IJwtPayload } from "../../common/interfaces";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "Yangi foydalanuvchini ro'yxatdan o'tkazish",
    description:
      "Email, parol va to'liq ism orqali yangi akkaunt yaratadi va JWT token qaytaradi.",
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "Akkaunt yaratildi va token qaytarildi.",
  })
  @ApiResponse({
    status: 400,
    description: "Validatsiya xatosi yoki parollar mos kelmadi.",
  })
  @ApiResponse({ status: 409, description: "Bunday email allaqachon mavjud." })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @ApiOperation({
    summary: "Email va parol bilan tizimga kirish",
    description:
      "Muvaffaqiyatli loginda JWT token va foydalanuvchi ma'lumotlarini qaytaradi.",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Login muvaffaqiyatli, token qaytarildi.",
  })
  @ApiResponse({ status: 401, description: "Email yoki parol noto'g'ri." })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Joriy foydalanuvchi profilini olish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi profili qaytarildi.",
  })
  @ApiResponse({ status: 401, description: "Token yo'q yoki yaroqsiz." })
  getProfile(@CurrentUser() user: IJwtPayload) {
    return this.authService.getProfile(user.sub);
  }
}
