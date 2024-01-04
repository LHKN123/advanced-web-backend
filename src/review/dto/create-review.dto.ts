import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  classId: string;

  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  gradeComposition: string;

  @IsString()
  currentGrade: string;

  @IsNotEmpty()
  expectationGrade: string;

  @IsNotEmpty()
  explanation: string;

  @IsNotEmpty()
  status: string;
}
