import { Module } from '@nestjs/common';
import { RubricService } from './rubric.service';
import { RubricController } from './rubric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubricEntity } from './rubric.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([RubricEntity]), ConfigModule],
  providers: [RubricService],
  controllers: [RubricController],
  exports: [RubricService],
})
export class RubricModule {}
