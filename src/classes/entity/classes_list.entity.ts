import {
  Column,
  Entity,
  ObjectIdColumn,
  ObjectId as ObjectIDType,
} from 'typeorm';

@Entity()
export class ClassListEntity {
  @ObjectIdColumn()
  _id: ObjectIDType;

  @Column()
  class_id: string;

  @Column()
  user_id: string;

  @Column()
  role: string;

  @Column()
  student_id: string;
}
