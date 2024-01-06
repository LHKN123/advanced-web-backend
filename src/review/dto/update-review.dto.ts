import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsNotEmpty()
  classId: string;

  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  gradeComposition: string;

  @IsNotEmpty()
  status: string;

  @IsString()
  currentGrade: string;
}
