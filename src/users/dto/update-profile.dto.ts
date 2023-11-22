import { IsEmail, IsNotEmpty, MaxLength, Validate } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(16)
  username: string;
}
