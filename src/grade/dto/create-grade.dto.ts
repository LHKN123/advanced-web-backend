import { IsDecimal, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateGradeDto {
  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  rubricId: string;

  @IsNotEmpty()
  grade: number;
}
