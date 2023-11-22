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
  avatarUrl: string =
    'https://pops.vn/series/tham-tu-lung-danh-conan-5e857135574ebb00334427a2';

  @Column({ nullable: true, default: null })
  refresh_token: string;
}
