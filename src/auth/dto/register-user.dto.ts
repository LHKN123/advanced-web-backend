import { IsEmail, IsNotEmpty, MaxLength, Validate } from 'class-validator';
import { PasswordValidator } from '../validator/password.validator';

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
}
