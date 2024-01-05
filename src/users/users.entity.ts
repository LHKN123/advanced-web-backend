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

  @Column()
  status: string = 'normal';

  @Column()
  student_id: string;
}


export class ImportUser {
  @Column()
  email: string;

  @Column()
  studentId: string;

  static fromPlain(plain: any): ImportUser {
    const user = new ImportUser();
    user.studentId = plain.studentId;
    user.email = plain.email;
    return user;
  }
}
