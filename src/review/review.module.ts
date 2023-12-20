import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entity/review.entity';
import { CommentEntity } from './entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, CommentEntity])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
