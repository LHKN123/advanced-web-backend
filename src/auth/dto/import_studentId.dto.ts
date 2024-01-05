import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ImportUser } from 'src/users/users.entity';



export class ImportStudentIdDto {
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    studentIds: ImportUser[];


}
