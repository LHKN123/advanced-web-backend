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

  @Column()
  avatarUrl: string = 'https://cdn-icons-png.flaticon.com/128/1144/1144760.png';

  @Column({ nullable: true, default: null })
  refresh_token: string;

  @Column()
  role: string = 'user';
}
