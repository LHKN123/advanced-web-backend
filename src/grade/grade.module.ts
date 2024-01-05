import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeEntity } from './grade.entity';
import { RubricModule } from 'src/rubric/rubric.module';

@Module({
  imports: [TypeOrmModule.forFeature([GradeEntity]), RubricModule],
  providers: [GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
