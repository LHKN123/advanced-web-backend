import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { PasswordValidator } from '../validator/password.validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Validate(PasswordValidator)
  password: string;
}
