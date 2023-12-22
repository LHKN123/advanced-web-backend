import {
  Column,
  Entity,
  ObjectIdColumn,
  ObjectId as ObjectIDType,
} from 'typeorm';

@Entity()
export class NotificationEntity {
  @ObjectIdColumn()
  _id: ObjectIDType;

  @Column()
  class_id: string;

  @Column({ nullable: true, default: null })
  review_id: string;

  @Column()
  sender_id: string;

  @Column()
  sender_role: string;

  @Column()
  receiver_id_list: string[];

  @Column()
  message: string;

  @Column()
  redirect_url: string;

  @Column()
  created_at: string;

  @Column()
  is_read: boolean;
}
