import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { PasswordValidator } from '../validator/password.validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Validate(PasswordValidator)
  password: string;
}
