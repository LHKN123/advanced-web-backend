import {
  Column,
  Entity,
  ObjectIdColumn,
  ObjectId as ObjectIDType,
} from 'typeorm';

@Entity()
export class CommentEntity {
  @ObjectIdColumn()
  _id: ObjectIDType;

  @Column()
  review_id: string;

  @Column()
  sender_id: string;

  @Column()
  desc: string;

  @Column({ nullable: true, default: null })
  parent: string;

  @Column({ nullable: true, default: null })
  replyOnUser: string;

  @Column()
  createdAt: string;

  @Column()
  like: number;
}
