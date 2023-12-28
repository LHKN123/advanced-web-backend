import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';
import { ReviewEntity } from './entity/review.entity';
import { CommentEntity } from './entity/comment.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async create(reviewDto: CreateReviewDto): Promise<any> {
    const existingReview = await this.reviewRepository.findOne({
      where: {
        class_id: reviewDto.classId,
        student_id: reviewDto.studentId,
        grade_composition: reviewDto.gradeComposition,
      },
    });
    if (!existingReview) {
      const newReview = this.reviewRepository.create({
        class_id: reviewDto.classId,
        student_id: reviewDto.studentId,
        grade_composition: reviewDto.gradeComposition,
        current_grade: reviewDto.currentGrade,
        expectation_grade: reviewDto.expectationGrade,
        explanation: reviewDto.explanation,
        status: reviewDto.status,
      });

      return await this.reviewRepository.save(newReview);
    } else {
      throw new HttpException('Review already exists', HttpStatus.CONFLICT);
    }
  }

  async update(reviewDto: UpdateReviewDto) {
    const existingReview = await this.reviewRepository.findOne({
      where: {
        class_id: reviewDto.classId,
        student_id: reviewDto.studentId,
        grade_composition: reviewDto.gradeComposition,
      },
    });
    console.log('UPDATE', existingReview);
    if (!existingReview) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    return this.reviewRepository.save({
      ...existingReview,
      status: reviewDto.status,
    });
  }

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

  async createReviewComment(
    senderId: string,
    commentDto: CreateCommentDto,
  ): Promise<any> {
    const newComment = this.commentRepository.create({
      review_id: commentDto.review_id,
      sender_id: senderId,
      desc: commentDto.desc,
      parent: commentDto.parent,
      replyOnUser: commentDto.replyOnUser,
      createdAt: commentDto.createdAt,
      like: commentDto.like,
    });

    return await this.commentRepository.save(newComment);
  }

  async updateComment(senderId: string, commentDto: UpdateCommentDto) {
    const objectId = new ObjectId(commentDto.id);

    const existingComment = await this.commentRepository.findOne({
      where: {
        _id: objectId,
        // sender_id: senderId,
      },
    });
    console.log('UPDATE', existingComment);
    if (!existingComment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return this.commentRepository.save({
      ...existingComment,
      desc: commentDto.desc,
      like: commentDto.like,
    });
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
