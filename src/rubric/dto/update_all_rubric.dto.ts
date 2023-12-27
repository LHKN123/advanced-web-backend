import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { RubricEntity } from '../rubric.entity';
import { ApiHideProperty } from '@nestjs/swagger';

export class UpdateAllRubricDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RubricEntity)
  @ApiHideProperty()
  rubrics: RubricEntity[];
}
