import { IsNotEmpty } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty() id: string;

  //   @IsNotEmpty() sender_id: string;

  @IsNotEmpty() desc: string;

  @IsNotEmpty() like: number;
}
