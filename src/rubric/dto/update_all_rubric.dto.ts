import { Type, classToPlain } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { RubricEntity } from '../rubric.entity';
import { ApiHideProperty } from '@nestjs/swagger';

export class Rubric {
  _id: string;
  class_id: string;
  gradeName: string;
  gradeScale: number;
  order: number;
}
export class UpdateAllRubricDto {
  @IsArray()
  @IsNotEmpty()
  // @Type(() => RubricEntity)
  @ApiHideProperty()
  @ArrayMinSize(1)
  rubrics: RubricEntity[];


}
