import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateRubricDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  gradeName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  gradeScale: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  order: number;
}
