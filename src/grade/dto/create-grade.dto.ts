import { IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class CreateGradeDto {
  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  rubricId: string;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  grade: number | null;
}
