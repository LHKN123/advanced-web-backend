import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';
import { Socket } from 'socket.io';

export class NotificationDto {
  @IsNotEmpty()
  classId: string;

  reviewId: string;

  @IsNotEmpty()
  senderId: string;

  @IsNotEmpty()
  senderRole: string; //teacher/student

  @IsNotEmpty()
  receiverIdList: string[];

  @IsNotEmpty()
  @MaxLength(256)
  message: string;

  @IsNotEmpty()
  redirectUrl: string;

  @IsNotEmpty()
  createdAt: string;

  @IsBoolean()
  isRead: boolean;
}

export class SocketDto {
  @IsNotEmpty()
  class_id_list: string[];

  review_id_list: string[];
}

export type SocketWithData = Socket & SocketDto;
