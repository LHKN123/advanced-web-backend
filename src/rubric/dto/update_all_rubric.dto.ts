import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { RubricEntity } from '../rubric.entity';
import { ApiHideProperty } from '@nestjs/swagger';

export class UpdateAllRubricDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RubricEntity)
  @ApiHideProperty()
  rubrics: RubricEntity[];
}
