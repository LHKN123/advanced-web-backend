import {
  Column,
  Entity,
  ObjectIdColumn,
  ObjectId as ObjectIDType,
} from 'typeorm';

@Entity()
export class ClassEntity {
  @ObjectIdColumn()
  _id: ObjectIDType;

  @Column()
  host_id: string;

  @Column()
  description: string;

  @Column()
  name: string;

  @Column()
  invite_url: string;

  @Column()
  class_code: string;

  @Column()
  status: string = 'Active';

  // @Column()
  // image_url: string =
  //   'https://img.freepik.com/free-vector/gradient-international-day-education-illustration_23-2150011975.jpg?w=1060&t=st=1700731744~exp=1700732344~hmac=24b786f258aaa8285646cf1044c2e8ccc3e829ef7d3bee36e80df89a345c792f';
}
