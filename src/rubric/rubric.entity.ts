import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ObjectIdColumn,
  ObjectId as ObjectIDType,
} from 'typeorm';

@Entity()
export class RubricEntity {
  @ObjectIdColumn()
  @Exclude()
  _id: ObjectIDType;

  @Column()
  class_id: string;

  @Column()
  gradeName: string;

  @Column('int')
  gradeScale: number;

  @Column('int')
  order: number;
}
