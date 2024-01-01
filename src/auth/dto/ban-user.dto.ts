import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BanUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    status: string;
}
