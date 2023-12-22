import {
  Column,
  Entity,
  ObjectIdColumn,
  ObjectId as ObjectIDType,
} from 'typeorm';

@Entity()
export class GradeEntity {
  @ObjectIdColumn()
  _id: ObjectIDType;

  @Column()
  student_id: string;

  @Column()
  rubric_id: string;

  @Column('decimal', { scale: 2 })
  grade: number;
}
