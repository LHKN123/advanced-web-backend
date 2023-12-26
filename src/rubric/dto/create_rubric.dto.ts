// import { Type } from 'class-transformer';
// import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

// export class CreateRubricDto {
//   @IsNotEmpty()
//   class_id: string;

//   @IsNotEmpty()
//   gradeName: string;

//   @IsNotEmpty()
//   @IsNumber()
//   @Min(1)
//   @Max(100)
//   @Type(() => Number)
//   gradeScale: number;

//   @IsNotEmpty()
//   @IsNumber()
//   @Type(() => Number)
//   order: number;
// }

import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRubricDto {
  @ApiProperty()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty()
  @IsNotEmpty()
  gradeName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  gradeScale: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  order: number;
}
