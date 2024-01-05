import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';

@ApiTags('grade')
@Controller('grade')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Get('/allGrades/:rubricId')
  @ApiOperation({ summary: 'Get all grades by rubric id' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getAll(@Param('rubricId') rubricId: string) {
    return await this.gradeService.getAllGrade(rubricId);
  }

  @Get('/grade/:rubricId/:studentId')
  @ApiOperation({ summary: 'Get grade of a student by rubric id' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async get(
    @Param('rubricId') rubricId: string,
    @Param('studentId') studentId: string,
  ) {
    return await this.gradeService.getGrade(studentId, rubricId);
  }

  @Get('/studentGrades/:studentId')
  @ApiOperation({ summary: 'Get grades by student id' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getStudent(@Param('studentId') studentId: string) {
    return await this.gradeService.getStudentGrade(studentId);
  }

  @Get('/finalizedGrade/:classId/:studentId')
  @ApiOperation({ summary: 'Get finalized grade by student id' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getFinalized(
    @Param('studentId') studentId: string,
    @Param('classId') classId: string,
  ) {
    return await this.gradeService.getFinalizedGrade(classId, studentId);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create new grade' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() reqBody: CreateGradeDto) {
    return this.gradeService.create(reqBody);
  }

  @Put('/update')
  @ApiOperation({ summary: 'Update grade' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async updateComment(@Body() reqBody: CreateGradeDto) {
    return this.gradeService.update(reqBody);
  }

  @Delete('/delete/:rubricId')
  @ApiOperation({ summary: 'Delete grades by rubric id' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async deleteComment(@Param('rubricId') rubricId: string) {
    return await this.gradeService.deleteByRubricId(rubricId);
  }
}
