import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;

  @IsNotEmpty()
  @MaxLength(16)
  username: string;

  // imageUrl: string;

  @MaxLength(16)
  studentId: string;
}
