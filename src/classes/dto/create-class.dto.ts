import { IsEmail, IsNotEmpty, MaxLength, Validate } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  name: string;
}
