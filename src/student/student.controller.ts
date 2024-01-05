import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { AuthGuard } from '@nestjs/passport';
import { ImportStudentDto } from './dto/import_student.dto';

@ApiTags('student')
@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Post(':classId/import')
    @ApiOperation({ summary: 'Import student list of the class ' })
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    async createRubric(@Req() req: any, @Body() reqBody: ImportStudentDto, @Param('classId') classId: string) {
        console.log("Studnet list", reqBody);
        return this.studentService.create(classId, reqBody);
    }

    @Get(':classId')
    @ApiOperation({ summary: 'Get student list of the class' })
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    async getAllClasses(@Req() req: any, @Param('classId') classId: string) {
        return this.studentService.get(classId);
    }
}
