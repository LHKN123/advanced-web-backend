import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { NotificationDto } from 'src/socketio/dto/socket-with-data.dto';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get notification list' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getList(@Req() req: any, @Body() reqBody: any) {
    const userId = req.user.id;
    return this.notificationService.getNotificationList(userId, reqBody);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update notification list' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async updateList(@Req() req: any, @Body() reqBody: NotificationDto) {
    const userId = req.user.id;
    return this.notificationService.updateNotificationList(userId, reqBody);
  }
}
