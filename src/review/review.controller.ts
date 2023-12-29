import {
  Body,
  Controller,
  Get,
  Param,
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

  @Get('/allReviews/:classId')
  @ApiOperation({ summary: 'Get all reviews in class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getAllReview(@Param('classId') classId: string) {
    return await this.reviewService.getAllReview(classId);
  }

  @Get('/studentReviews/:classId/:studentId')
  @ApiOperation({ summary: 'Get student reviews with id in class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getStudentReview(
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return await this.reviewService.getStudentReview(studentId, classId);
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

  @Get('/getComments/:reviewId')
  @ApiOperation({ summary: 'Get comments of review with id' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getReviewComment(@Param('reviewId') reviewId: string) {
    return await this.reviewService.getReviewComment(reviewId);
  }
}
