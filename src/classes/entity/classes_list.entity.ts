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

  @Column({ nullable: true, default: null })
  student_id: string;

  @Column()
  email: string;

  @Column()
  fullName: string;

  @Column()
  avatar_url: string;
}
