import {
  Column,
  Entity,
  ObjectIdColumn,
  ObjectId as ObjectIDType,
} from 'typeorm';

@Entity()
export class UserEntity {
  @ObjectIdColumn()
  _id: ObjectIDType;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  // @Column()
  // avatarUrl: string;

  @Column({ nullable: true, default: null })
  refresh_token: string;
}
