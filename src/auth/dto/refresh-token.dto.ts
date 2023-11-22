import { IsEmail, IsNotEmpty, MaxLength, Validate } from 'class-validator';
import { PasswordValidator } from '../validator/password.validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @IsNotEmpty()
  refresh_token: string;
}
