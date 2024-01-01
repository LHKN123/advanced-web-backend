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
  studentId: string;

  @Column()
  rubricId: string;

  @Column('decimal', { scale: 3 })
  grade: number;
}
