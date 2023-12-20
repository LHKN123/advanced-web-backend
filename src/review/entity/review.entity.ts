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
  class_id: string;

  @Column()
  student_id: string;

  @Column()
  grade_composition: string;

  @Column()
  current_grade: string;

  @Column()
  expectation_grade: string;

  @Column()
  explanation: string;

  @Column()
  status: string;
}
