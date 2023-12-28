import { IsEmail, IsNotEmpty, MaxLength, Validate } from 'class-validator';

export class AddMemberDto {
  @IsNotEmpty()
  email: string;

  //   @IsNotEmpty()
  //   classId: string;

  @IsNotEmpty()
  role: string;
}
