import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create new review' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async createReview(@Body() reqBody: CreateReviewDto) {
    return this.reviewService.create(reqBody);
  }

  @Put('/update')
  @ApiOperation({ summary: 'Update review status' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async updateReview(@Body() reqBody: UpdateReviewDto) {
    return this.reviewService.update(reqBody);
  }

  @Get('/allReviews')
  @ApiOperation({ summary: 'Get all reviews in class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getAllReview(@Body() reqBody: { classId: string }) {
    return await this.reviewService.getAllReview(reqBody.classId);
  }

  @Get('/studentReviews')
  @ApiOperation({ summary: 'Get student reviews with id in class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getStudentReview(
    @Body() reqBody: { classId: string; studentId: string },
  ) {
    return await this.reviewService.getStudentReview(
      reqBody.studentId,
      reqBody.classId,
    );
  }

  @Post('/createComment')
  @ApiOperation({ summary: 'Create new comment' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async createComment(@Req() req: any, @Body() reqBody: CreateCommentDto) {
    const senderId = req.user.id;
    return this.reviewService.createReviewComment(senderId, reqBody);
  }

  @Put('/updateComment')
  @ApiOperation({ summary: 'Update comment' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async updateComment(@Req() req: any, @Body() reqBody: UpdateCommentDto) {
    const senderId = req.user.id;
    return this.reviewService.updateComment(senderId, reqBody);
  }

  @Get('/getComments')
  @ApiOperation({ summary: 'Get comments of review with id' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getReviewComment(@Body() reqBody: { reviewId: string }) {
    return await this.reviewService.getReviewComment(reqBody.reviewId);
  }
}
