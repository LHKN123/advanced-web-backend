import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';

@Entity()
export class UserEntity {
  @ObjectIdColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  refresh_token: string;
}
