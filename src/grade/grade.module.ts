import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';

@Module({
  providers: [GradeService],
  controllers: [GradeController]
})
export class GradeModule {}
