import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty() review_id: string;

  //   @IsNotEmpty() sender_id: string;

  @IsNotEmpty() desc: string;

  parent: string;

  replyOnUser: string;

  @IsNotEmpty() createdAt: string;

  @IsNotEmpty() like: number;
}
