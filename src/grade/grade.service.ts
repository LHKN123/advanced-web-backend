import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { GradeEntity } from './grade.entity';
import { RubricService } from 'src/rubric/rubric.service';
import { RubricEntity } from 'src/rubric/rubric.entity';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    private gradeRepository: Repository<GradeEntity>,
    private rubricService: RubricService,
  ) {}
  // get grades by rubric id
  async getAllGrade(rubricId: string): Promise<any> {
    const gradeList = await this.gradeRepository.find({
      where: {
        rubricId: rubricId,
      },
    });

    return gradeList;
  }

  // get grade of a student by rubric id
  async getGrade(studentId: string, rubricId: string): Promise<any> {
    const gradeList = await this.gradeRepository.findOne({
      where: {
        rubricId: rubricId,
        studentId: studentId,
      },
    });

    return gradeList;
  }

  // get grades by student id
  async getStudentGrade(studentId: string): Promise<any> {
    const gradeList = await this.gradeRepository.find({
      where: {
        studentId: studentId,
      },
    });

    return gradeList;
  }

  // get grades by student id
  async getFinalizedGrade(classId: string, studentId: string): Promise<any> {
    let finalizedGrade: number;
    finalizedGrade = 0;

    const gradeList = await this.gradeRepository.find({
      where: {
        studentId: studentId,
      },
    });

    for (const grade of gradeList) {
      if (grade.grade && grade.grade !== 0) {
        let rubric: RubricEntity;
        rubric = await this.rubricService.getById(grade.rubricId);

        if (rubric.class_id == classId) {
          finalizedGrade += (grade.grade * rubric.gradeScale) / 100;
        }
      }
    }

    return finalizedGrade;
  }

  // create grade
  async create(gradeDto: CreateGradeDto): Promise<any> {
    const existingGrade = await this.gradeRepository.findOne({
      where: {
        studentId: gradeDto.studentId,
        rubricId: gradeDto.rubricId,
      },
    });
    if (!existingGrade) {
      const newGrade = this.gradeRepository.create({
        studentId: gradeDto.studentId,
        rubricId: gradeDto.rubricId,
        grade: gradeDto.grade,
      });

      return await this.gradeRepository.save(newGrade);
    } else {
      return this.update(gradeDto);
    }
  }
  // update grade
  async update(gradeDto: CreateGradeDto) {
    const existingGrade = await this.gradeRepository.findOne({
      where: {
        studentId: gradeDto.studentId,
        rubricId: gradeDto.rubricId,
      },
    });
    if (!existingGrade) {
      throw new HttpException('Grade not found', HttpStatus.NOT_FOUND);
    }
    return await this.gradeRepository.save({
      ...existingGrade,
      grade: gradeDto.grade,
    });
  }
  // delete grade
  async deleteByRubricId(rubricId: string): Promise<any> {
    const existingGrade = await this.gradeRepository.find({
      where: {
        rubricId: rubricId,
      },
    });

    if (existingGrade) {
      await this.gradeRepository.remove(existingGrade);
    }
    return HttpStatus.OK;
  }
}
