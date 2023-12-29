import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { AuthGuard } from '@nestjs/passport';
import { AddMemberDto } from './dto/add_member.dto';
import { Response } from 'express';
import { EnrollClassDto } from './dto/enroll-class.dto';

@ApiTags('classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classService: ClassesService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create new class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async register(@Req() req: any, @Body() reqBody: CreateClassDto) {
    const host_id = req.user.id;
    return this.classService.create(reqBody, host_id);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all classes created by the host' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getAllClasses(@Req() req: any) {
    const host_id = req.user.id;
    return this.classService.getAllClasses(host_id);
  }

  @Get(':classId')
  @ApiOperation({ summary: 'Get class info created by the host' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getClassById(@Req() req: any, @Param('classId') classId: string) {
    return await this.classService.getClassById(classId);
  }

  @Get(':classId/members')
  @ApiOperation({ summary: 'Get all members in the class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getMembers(@Req() req: any, @Param('classId') classId: string) {
    // const user_id = req.user.id;
    return await this.classService.getMembers(classId);
  }

  @Post(':classId/members/invite-member')
  @ApiOperation({ summary: 'Send invitation mail' })
  @ApiResponse({
    status: 200,
    description: 'Send invitation mail successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async inviteMember(
    @Req() req: any,
    @Body() reqBody: AddMemberDto,
    @Param('classId') classId: string,
  ) {
    const host_id = req.user.id;
    return this.classService.inviteMember(classId, reqBody, host_id);
  }

  @Get(':classId/members/accept-invitation')
  @ApiOperation({ summary: 'Accept invitation mail' })
  async acceptInvitation(
    @Query() params: AddMemberDto,
    @Res() res: Response,
    @Param('classId') classId: string,
  ) {
    console.log('Accept invitation', params);
    this.classService.acceptInvitation(classId, params, res);
  }

  @Delete(':classId/members/:memberId')
  @ApiOperation({ summary: 'Delete a member from the class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async deleteRubric(
    @Req() req: any,
    @Param('classId') class_id: string,
    @Param('memberId') member_id: string,
  ) {
    return await this.classService.deleteMember(class_id, member_id);
  }

  @Get('enrolled')
  @ApiOperation({ summary: 'Get all enrolled classes created by the host' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getAllEnrolledClasses(@Req() req: any) {
    const user_id = req.user.id;
    return this.classService.getAllEnrolledClasses(user_id);
  }

  @Post('enrolled')
  @ApiOperation({ summary: 'Enrolled the class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async enrolledClass(
    @Req() req: any,
    @Query() code: EnrollClassDto,
    @Res() res: Response,
  ) {
    const user_id = req.user.id;
    return this.classService.enrolledClass(code.code, user_id, res);
  }
}
