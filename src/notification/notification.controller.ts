import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { NotificationDto } from 'src/socketio/dto/socket-with-data.dto';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/list/:classId')
  @ApiOperation({ summary: 'Get notification list of a user in class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getList(@Req() req: any, @Param('classId') classId: string) {
    const userId = req.user.id;
    return this.notificationService.getNotificationList(userId, classId);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create new notification' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async createNotification(@Req() req: any, @Body() reqBody: NotificationDto) {
    const userId = req.user.id;
    return this.notificationService.create(userId, reqBody);
  }
}
