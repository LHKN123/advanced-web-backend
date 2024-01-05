import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RubricEntity } from './rubric.entity';
import { Repository } from 'typeorm';
import { ClassEntity } from 'src/classes/entity/classes.entity';
import { ConfigService } from '@nestjs/config';
import { CreateRubricDto } from './dto/create_rubric.dto';
import { DeleteRubricDto } from './dto/delete_rubric.dto';
import { ObjectId } from 'mongodb';
import { UpdateRubricDto } from './dto/update_rubric.dto';
import { UpdateAllRubricDto } from './dto/update_all_rubric.dto';
import { FinalizeRubricDto } from './dto/finalize_rubric.dto';

@Injectable()
export class RubricService {
  constructor(
    @InjectRepository(RubricEntity)
    private readonly rubricRepository: Repository<RubricEntity>,
    @InjectRepository(ClassEntity)
    private readonly classesRepository: Repository<ClassEntity>,
  ) { }

  async create(rubricDto: CreateRubricDto): Promise<any> {
    const existedClass = await this.classesRepository.findOne({
      where: { _id: new ObjectId(rubricDto.class_id) },
    });

    if (!existedClass) {
      throw new HttpException("Class doesn't exist", HttpStatus.CONFLICT);
    }
    const existingRubric = await this.rubricRepository.findOne({
      where: { class_id: rubricDto.class_id, gradeName: rubricDto.gradeName },
    });

    if (!existingRubric) {
      const newRubric = this.rubricRepository.create({
        class_id: rubricDto.class_id,
        gradeName: rubricDto.gradeName,
        gradeScale: rubricDto.gradeScale,
        order: rubricDto.order,
      });

      return await this.rubricRepository.save(newRubric);
    } else {
      throw new HttpException('Rubric already exists', HttpStatus.CONFLICT);
    }
  }

  async get(class_id: string): Promise<any> {
    const allRubrics = await this.rubricRepository.find({
      where: { class_id: class_id },
    });
    console.log('All Rubrics found', allRubrics, class_id);
    return allRubrics;
  }

  async delete(rubric_id: string): Promise<any> {
    const objectId = new ObjectId(rubric_id);
    const rubric = await this.rubricRepository.findOne({
      where: { _id: objectId },
    });

    if (rubric) {
      await this.rubricRepository.remove(rubric);
      return this.get(rubric.class_id);
    } else {
      throw new HttpException("Rubric doesn't exist", HttpStatus.CONFLICT);
    }
  }

  async update(rubricDto: UpdateAllRubricDto) {
    rubricDto.rubrics.map(async (item) => {
      console.log('ITEM: ', item);
      const objectId = new ObjectId(item._id);
      const rubric = await this.rubricRepository.findOne({
        where: { _id: objectId },
      });
      console.log('RUBRIC: ', item._id);
      if (rubric) {
        rubric.gradeName = item.gradeName;
        rubric.gradeScale = item.gradeScale;
        rubric.order = item.order;

        await this.rubricRepository.save(rubric);
      } else {
        throw new HttpException("Can't update rubrics", HttpStatus.CONFLICT);
      }
    });
  }

  async finalize(rubric_id: string) {
    const rubric = await this.rubricRepository.findOne({
      where: { _id: new ObjectId(rubric_id) },
    });

    console.log("rub", rubric);

    if (rubric) {
      return await this.rubricRepository.save({ ...rubric, "status": "graded" });
    } else {
      throw new HttpException("Rubric doesn't exist", HttpStatus.CONFLICT);
    }
  }
}
