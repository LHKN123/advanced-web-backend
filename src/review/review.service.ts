import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
import { ReviewEntity } from './review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
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
}
