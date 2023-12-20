import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entity/review.entity';
import { CommentEntity } from './entity/comment.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async getAllReview(classId: string): Promise<any> {
    const reviewList = await this.reviewRepository.find({
      where: {
        class_id: classId,
      },
    });

    return reviewList;
  }

  async getStudentReview(userId: string, classId: string): Promise<any> {
    const reviewList = await this.reviewRepository.find({
      where: {
        class_id: classId,
        student_id: userId,
      },
    });

    return reviewList;
  }

  async getReviewComment(reviewId: string): Promise<any> {
    const reviewList = await this.commentRepository.find({
      where: {
        review_id: reviewId,
      },
    });
    return reviewList;
  }
}
