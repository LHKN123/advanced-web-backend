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
  classId: string;

  @Column({ nullable: true, default: null })
  reviewId: string;

  @Column()
  senderId: string;

  @Column()
  senderRole: string;

  @Column()
  receiverIdList: string[];

  @Column()
  message: string;

  @Column()
  redirectUrl: string;

  @Column()
  createdAt: string;

  @Column()
  isRead: boolean;
}
