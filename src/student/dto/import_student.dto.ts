import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../student.entity';

export class ImportStudentDto {
    //   @ApiProperty()
    //   @IsNotEmpty()
    //   class_id: string;

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    students: Student[];


}
