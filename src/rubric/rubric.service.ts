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

@Injectable()
export class RubricService {
  constructor(
    @InjectRepository(RubricEntity)
    private readonly rubricRepository: Repository<RubricEntity>,
  ) {}

  async create(rubricDto: CreateRubricDto): Promise<any> {
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
    const allRubrics = await this.rubricRepository.findOne({
      where: { class_id: class_id },
    });

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
      const objectId = new ObjectId(item._id);
      const rubric = await this.rubricRepository.findOne({
        where: { _id: objectId },
      });

      if (rubric) {
        rubric.gradeName = item.gradeName;
        rubric.gradeScale = item.gradeScale;
        rubric.order = item.order;
        await this.rubricRepository.remove(rubric);
      } else {
        throw new HttpException("Rubric doesn't exist", HttpStatus.CONFLICT);
      }
    });
  }
}
