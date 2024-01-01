import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty() review_id: string;

  //   @IsNotEmpty() sender_id: string;

  @IsNotEmpty() desc: string;

  @IsOptional()
  parent: string;

  @IsOptional()
  replyOnUser: string;

  @IsNotEmpty() createdAt: string;

  @IsNotEmpty() like: number;
}
