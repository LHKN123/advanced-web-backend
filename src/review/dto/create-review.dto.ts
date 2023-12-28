import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  classId: string;

  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  gradeComposition: string;

  @IsNotEmpty()
  currentGrade: string;

  @IsNotEmpty()
  expectationGrade: string;

  @IsNotEmpty()
  explanation: string;

  @IsNotEmpty()
  status: string;
}
