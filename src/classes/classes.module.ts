import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { ClassEntity } from './entity/classes.entity';
import { ClassListEntity } from './entity/classes_list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassEntity, ClassListEntity]),
    ConfigModule,
  ],
  providers: [ClassesService],
  controllers: [ClassesController],
  exports: [ClassesService],
})
export class ClassesModule {}
