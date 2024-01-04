import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
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
  constructor(private readonly classService: ClassesService) { }

  @Post('create')
  @ApiOperation({ summary: 'Create new class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async register(@Req() req: any, @Body() reqBody: CreateClassDto) {
    const host_id = req.user.id;
    return this.classService.create(reqBody, host_id);
  }

  @Post(':action/:classId')
  @ApiOperation({ summary: 'Activate or deactivate a specific class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async setActiveStatus(
    @Param('action') action: string,
    @Param('classId') classId: string,
  ) {
    if (action === 'active') {
      return this.classService.active(classId);
    } else if (action === 'inactive') {
      return this.classService.inactive(classId);
    } else {
      // Handle invalid action
      throw new BadRequestException('Invalid action');
    }
  }


  @Get('teaching')
  @ApiOperation({ summary: 'Get all created classes by user' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getTeachingClasses(@Req() req: any) {
    const host_id = req.user.id;
    return this.classService.getAllTeachingClasses(host_id);
  }

  //Admin side 
  @Get('teaching/exist')
  @ApiOperation({ summary: 'Get all existing teaching classes' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getTeachingClassesExist(@Req() req: any) {
    return this.classService.getAllTeachingClassesExist();
  }

  @Get('class-student/:classId')
  @ApiOperation({ summary: 'Get specific class info that the user(student) enrolled' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getClassStudent(@Req() req: any, @Param('classId') classId: string) {
    const user_id = req.user.id;
    return this.classService.getClassStudentInfo(user_id, classId);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all classes (enrolled + teaching) by user' })
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

  @Delete(':classId')
  @ApiOperation({ summary: 'Remove a class from database' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async deleteClassById(@Req() req: any, @Param('classId') classId: string) {
    return await this.classService.deleteClassById(classId);
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
  async deleteMember(
    @Req() req: any,
    @Param('classId') class_id: string,
    @Param('memberId') member_id: string,
  ) {
    return await this.classService.deleteMember(class_id, member_id);
  }

  @Put(':classId/members/:memberId')
  @ApiOperation({ summary: 'Update info of a member from the class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async updateMember(
    @Req() req: any,
    @Body() reqBody: any,
    @Param('classId') class_id: string,
    @Param('memberId') member_id: string,
  ) {
    return await this.classService.updateMember(class_id, member_id, reqBody);
  }

  @Get(':classId/members/:memberId')
  @ApiOperation({ summary: 'Get a member from the class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getMember(
    @Param('classId') class_id: string,
    @Param('memberId') member_id: string,
  ) {
    return await this.classService.getMember(class_id, member_id);
  }

  @Post('get-enrolled')
  @ApiOperation({ summary: 'Get all enrolled classes created by the host' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getAllEnrolledClasses(@Req() req: any) {
    console.log('REquesst', req);
    const user_id = req.user.id;
    console.log('Getting', user_id);
    return this.classService.getAllEnrolledClasses(user_id);
  }

  @Post('enrolled')
  @ApiOperation({ summary: 'Enrolled the class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async enrolledClass(
    @Req() req: any,
    @Query() code: EnrollClassDto
  ) {
    const user_id = req.user.id;
    return this.classService.enrolledClass(code.code, user_id);
  }

  // @Get('getnumber/:classId')
  // @ApiOperation({ summary: 'Enrolled the class' })
  // @ApiBearerAuth('access-token')
  // @UseGuards(AuthGuard('jwt'))
  // async getmember(
  //   @Req() req: any,
  //   @Param('classId') class_id: string
  // ) {
  //   const user_id = req.user.id;
  //   return this.classService.getMemberNumberInClass(class_id);
  // }
}
