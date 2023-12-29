import {
  Column,
  Entity,
  ObjectIdColumn,
  ObjectId as ObjectIDType,
} from 'typeorm';

@Entity()
export class ReviewEntity {
  @ObjectIdColumn()
  _id: ObjectIDType;

  @Column()
  classId: string;

  @Column()
  studentId: string;

  @Column()
  gradeComposition: string;

  @Column()
  currentGrade: string;

  @Column()
  expectationGrade: string;

  @Column()
  explanation: string;

  @Column()
  status: string;
}
