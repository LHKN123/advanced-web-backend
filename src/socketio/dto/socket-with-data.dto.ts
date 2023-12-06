import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Socket } from 'socket.io';

export class NotificationDto {
  @IsNotEmpty()
  sender_id: string;

  @IsNotEmpty()
  @IsEmail()
  sender_email: string;

  // sender_role: teacher/student

  //   @IsNotEmpty()
  //   receiver_id_list: string[];

  //   @IsNotEmpty()
  //   @MaxLength(256)
  //   message: string;

  //   redirect_url: string;

  //   create_date: Date;
}

export type SocketWithData = Socket & NotificationDto;
