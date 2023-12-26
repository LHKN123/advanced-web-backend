import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RubricService } from './rubric.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateRubricDto } from './dto/create_rubric.dto';
import { DeleteRubricDto } from './dto/delete_rubric.dto';
import { UpdateRubricDto } from './dto/update_rubric.dto';
import { UpdateAllRubricDto } from './dto/update_all_rubric.dto';
import { RubricEntity } from './rubric.entity';

@ApiTags('rubric')
@Controller('rubric')
export class RubricController {
  constructor(private readonly rubricService: RubricService) {}
  @Post('create')
  @ApiOperation({ summary: 'Create new rubric' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async createRubric(@Req() req: any, @Body() reqBody: CreateRubricDto) {
    return this.rubricService.create(reqBody);
  }
  // @Post('create')
  // @ApiOperation({ summary: 'Create new rubric' })
  // @ApiBearerAuth('access-token')
  // @UseGuards(AuthGuard('jwt'))
  // async createRubric(
  //   @Req() req: any,
  //   @Body() reqBody: CreateRubricDto,
  // ): Promise<RubricEntity> {
  //   return this.rubricService.create(reqBody);
  // }
  @Get(':classId')
  @ApiOperation({ summary: 'Get all rubrics in a class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getAllClasses(@Req() req: any, @Param('classId') classId: string) {
    return this.rubricService.get(classId);
  }
  @Delete(':rubric_id')
  @ApiOperation({ summary: 'Delete a rubric from a class' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async deleteRubric(@Req() req: any, @Param('rubricId') rubric_id: string) {
    return await this.rubricService.delete(rubric_id);
  }
  @Put('update')
  @ApiOperation({ summary: 'Update rubric' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async update(@Req() req: any, @Body() reqBody: UpdateAllRubricDto) {
    this.rubricService.update(reqBody);
  }
}
