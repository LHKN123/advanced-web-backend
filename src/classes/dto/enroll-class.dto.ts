import { IsEmail, IsNotEmpty, MaxLength, Validate } from 'class-validator';

export class EnrollClassDto {
  @IsNotEmpty()
  code: string;
}
