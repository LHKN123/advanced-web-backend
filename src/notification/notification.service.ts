import { Injectable } from '@nestjs/common';
import { NotificationEntity } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationDto } from 'src/socketio/dto/socket-with-data.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) { }

  async getNotificationList(userId: string, classId: string): Promise<any> {
    // Promise<NotificationEntity[]>
    const notificationList = [];
    const classNotificationList = await this.notificationRepository.find({
      where: {
        classId: classId,
      },
    });

    for (const notification of classNotificationList) {
      const receiverIdList = notification.receiverIdList;
      for (const receiverId of receiverIdList) {
        if (receiverId === userId) {
          notificationList.push(notification);
        }
      }
    }

    return notificationList;
  }

  async create(userId: string, newData: NotificationDto): Promise<any> {
    const newNotification = await this.notificationRepository.create(newData);
    return await this.notificationRepository.save({
      ...newNotification,
      senderId: userId,
    });
  }
}
