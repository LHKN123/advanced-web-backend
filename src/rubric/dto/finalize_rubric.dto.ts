import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class FinalizeRubricDto {
    @IsNotEmpty()
    class_id: string;

    @IsNotEmpty()
    rubric_id: string;
}
