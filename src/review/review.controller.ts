import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':classId/allReviews')
  @ApiOperation({ summary: 'Get all reviews in class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getAllReview(@Req() req: any, @Param('classId') classId: string) {
    return await this.reviewService.getAllReview(classId);
  }

  @Get(':classId/studentReviews')
  @ApiOperation({ summary: 'Get student reviews with id in class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getStudentReview(@Req() req: any, @Param('classId') classId: string) {
    const userId = req.user.id;
    return await this.reviewService.getStudentReview(userId, classId);
  }

  @Get(':reviewId/comments')
  @ApiOperation({ summary: 'Get student reviews with id in class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getReviewComment(@Req() req: any, @Param('reviewId') reviewId: string) {
    return await this.reviewService.getReviewComment(reviewId);
  }
}
