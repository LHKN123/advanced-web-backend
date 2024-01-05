import { Module } from '@nestjs/common';
import { RubricService } from './rubric.service';
import { RubricController } from './rubric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubricEntity } from './rubric.entity';
import { ConfigModule } from '@nestjs/config';
import { ClassEntity } from 'src/classes/entity/classes.entity';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
  imports: [TypeOrmModule.forFeature([RubricEntity, ClassEntity]), ConfigModule, ClassesModule],
  providers: [RubricService],
  controllers: [RubricController],
  exports: [RubricService],
})
export class RubricModule { }
