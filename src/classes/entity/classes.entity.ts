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
}
