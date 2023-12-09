import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { AuthGuard } from '@nestjs/passport';

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
  @ApiOperation({ summary: 'Get all classes created by the host' })
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
    const user_id = req.user.id;
    return await this.classService.getMembers(classId, user_id);
  }
}
