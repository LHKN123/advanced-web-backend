import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Socket } from 'socket.io';

export class NotificationDto {
  @IsNotEmpty()
  classId: string;

  @IsOptional()
  reviewId: string;

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

  @IsOptional()
  review_id_list: string[];
}

export type SocketWithData = Socket & SocketDto;
