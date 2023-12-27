import { IsEmail, IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator';
import { PasswordValidator } from '../validator/password.validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Validate(PasswordValidator)
  password: string;

  @IsNotEmpty()
  @MaxLength(16)
  username: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
