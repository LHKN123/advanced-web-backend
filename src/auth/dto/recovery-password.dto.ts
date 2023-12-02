import { IsString, IsEmail, IsNotEmpty, Validate, IsNumber } from 'class-validator';

export class RecoveryPasswordDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    otp: number;
}