import { Controller, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from '../../common/interfaces';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Joriy foydalanuvchining barcha bildirishnomalari' })
  @ApiResponse({ status: 200, description: 'Bildirishnomalar ro\'yxati.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya talab qilinadi.' })
  getNotifications(@CurrentUser() user: IJwtPayload) {
    return this.notificationsService.getUserNotifications(user.sub);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Barcha bildirishnomalarni o\'qilgan deb belgilash' })
  @ApiResponse({ status: 200, description: 'Barchasi o\'qilgan deb belgilandi.' })
  markAllAsRead(@CurrentUser() user: IJwtPayload) {
    return this.notificationsService.markAllAsRead(user.sub);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Bitta bildirishnomani o\'qilgan deb belgilash' })
  @ApiParam({ name: 'id', description: 'Bildirishnoma IDsi' })
  @ApiResponse({ status: 200, description: 'Bildirishnoma o\'qilgan deb belgilandi.' })
  @ApiResponse({ status: 404, description: 'Bildirishnoma topilmadi.' })
  markAsRead(@CurrentUser() user: IJwtPayload, @Param('id') id: string) {
    return this.notificationsService.markAsRead(user.sub, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Bildirishnomani o\'chirish' })
  @ApiParam({ name: 'id', description: 'Bildirishnoma IDsi' })
  @ApiResponse({ status: 200, description: 'Bildirishnoma o\'chirildi.' })
  @ApiResponse({ status: 404, description: 'Bildirishnoma topilmadi.' })
  deleteNotification(@CurrentUser() user: IJwtPayload, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(user.sub, id);
  }
}
