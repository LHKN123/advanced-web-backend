import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { PasswordValidator } from '../validator/password.validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnUserDto {
  email: string;
  username: string;
  access_token: string;
  refresh_token: string;
}
