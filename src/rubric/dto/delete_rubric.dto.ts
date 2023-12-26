import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class DeleteRubricDto {
  @IsNotEmpty()
  class_id: string;

  @IsNotEmpty()
  gradeName: string;
}
