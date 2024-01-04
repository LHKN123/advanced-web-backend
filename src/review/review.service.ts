import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entity/review.entity';
import { CommentEntity } from './entity/comment.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) { }

  async create(reviewDto: CreateReviewDto): Promise<any> {
    const existingReview = await this.reviewRepository.findOne({
      where: {
        classId: reviewDto.classId,
        studentId: reviewDto.studentId,
        gradeComposition: reviewDto.gradeComposition,
      },
    });
    if (!existingReview) {
      const newReview = this.reviewRepository.create({
        classId: reviewDto.classId,
        studentId: reviewDto.studentId,
        gradeComposition: reviewDto.gradeComposition,
        currentGrade: reviewDto.currentGrade,
        expectationGrade: reviewDto.expectationGrade,
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
        classId: reviewDto.classId,
        studentId: reviewDto.studentId,
        gradeComposition: reviewDto.gradeComposition,
      },
    });
    if (!existingReview) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    return this.reviewRepository.save({
      ...existingReview,
      status: reviewDto.status,
      currentGrade: reviewDto.currentGrade,
    });
  }

  async getAllReview(classId: string): Promise<any> {
    const reviewList = await this.reviewRepository.find({
      where: {
        classId: classId,
      },
    });

    return reviewList;
  }

  async getStudentReview(userId: string, classId: string): Promise<any> {
    const reviewList = await this.reviewRepository.find({
      where: {
        classId: classId,
        studentId: userId,
      },
    });

    return reviewList;
  }

  // REVISE LATER
  async getReviewIdListForTeacher(classId: string): Promise<any> {
    const reviewList = await this.reviewRepository.find({
      where: {
        classId: classId,
      },
    });

    let reviewIdList = [];

    reviewList.forEach((element) => {
      reviewIdList.push(element._id);
    });

    return reviewIdList;
  }

  async getReviewIdListForStudent(
    studentId: string,
    classId: string,
  ): Promise<any> {
    const reviewList = await this.reviewRepository.find({
      where: {
        classId: classId,
        studentId: studentId,
      },
    });

    let reviewIdList = [];

    reviewList.forEach((element) => {
      reviewIdList.push(element._id);
    });

    return reviewIdList;
  }
  // REVISE LATER

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

  async updateComment(commentDto: UpdateCommentDto) {
    const objectId = new ObjectId(commentDto.id);

    const existingComment = await this.commentRepository.findOne({
      where: {
        _id: objectId,
      },
    });
    if (!existingComment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return this.commentRepository.save({
      ...existingComment,
      desc: commentDto.desc,
      like: commentDto.like,
    });
  }

  async getReviewComment(senderId: string, reviewId: string): Promise<any> {
    const commentList = await this.commentRepository.find({
      where: {
        review_id: reviewId,
      },
    });

    let updatedCommentList = [];

    commentList.forEach((comment) => {
      updatedCommentList.push({
        ...comment,
        isSender: comment.sender_id === senderId,
      });
    });

    return updatedCommentList;
  }

  async deleteComment(commentId: string): Promise<any> {
    const objectId = new ObjectId(commentId);

    const existingComment = await this.commentRepository.findOne({
      where: {
        _id: objectId,
      },
    });

    if (existingComment) {
      await this.commentRepository.remove(existingComment);
      return HttpStatus.OK;
    } else {
      throw new HttpException("Comment doesn't exist", HttpStatus.CONFLICT);
    }
  }
}
