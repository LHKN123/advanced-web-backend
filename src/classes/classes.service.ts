import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassEntity } from './entity/classes.entity';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { ClassListEntity } from './entity/classes_list.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(ClassEntity)
    private classRepository: Repository<ClassEntity>,
    private configService: ConfigService,
    @InjectRepository(ClassListEntity)
    private classListRepository: Repository<ClassListEntity>,
  ) {}

  async create(classDto: CreateClassDto, host_id: string): Promise<any> {
    const existingClass = await this.classRepository.findOne({
      where: { host_id: host_id, name: classDto.name },
    });
    if (!existingClass) {
      const class_code = uuidv4();
      const invite_url = `default url`;
      const newClass = this.classRepository.create({
        host_id: host_id,
        name: classDto.name,
        description: classDto.description,
        invite_url: invite_url,
        class_code: class_code,
      });
      const savedClass = await this.classRepository.save(newClass);

      savedClass.invite_url = `${this.configService.get<string>(
        'BASE_URL_FRONTEND',
      )}/class/${savedClass._id}?code=${savedClass.class_code}`;

      return await this.classRepository.save(savedClass);
    } else {
      throw new HttpException('Class already exists', HttpStatus.CONFLICT);
    }
  }

  async getAllClasses(host_id: string): Promise<any> {
    const allClasses = await this.classRepository.findOne({
      where: { host_id: host_id },
    });

    return allClasses;
  }

  async getClassById(class_id: string): Promise<any> {
    const _class = await this.classRepository.findOne({
      where: { _id: new ObjectId(class_id) },
    });

    return _class;
  }

  async getMembers(class_id: string, user_id: string): Promise<any> {
    const _class = await this.classListRepository.findOne({
      where: { class_id: class_id, user_id: user_id },
    });

    if (_class) {
      const _class = await this.classListRepository.findOne({
        where: { class_id: class_id },
      });
    }

    return _class;
  }
}
