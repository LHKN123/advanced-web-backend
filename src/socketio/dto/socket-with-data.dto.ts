import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';
import { Socket } from 'socket.io';

export class NotificationDto {
  @IsNotEmpty()
  class_id: string;

  review_id: string;

  @IsNotEmpty()
  sender_id: string;

  @IsNotEmpty()
  sender_role: string; //teacher/student

  @IsNotEmpty()
  receiver_id_list: string[];

  @IsNotEmpty()
  @MaxLength(256)
  message: string;

  @IsNotEmpty()
  redirect_url: string;

  @IsNotEmpty()
  created_at: string;

  @IsBoolean()
  is_read: boolean;
}

export type SocketWithData = Socket & NotificationDto;
