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
import { AddMemberDto } from './dto/add_member.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/users.entity';
import { Response } from 'express';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(ClassEntity)
    private classRepository: Repository<ClassEntity>,
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ClassListEntity)
    private classListRepository: Repository<ClassListEntity>,
    private readonly mailerService: MailerService,
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
    const allClasses = await this.classRepository.find({
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
    const classList = await this.classListRepository.find({
      where: { class_id: class_id },
    });

    const members = await Promise.all(
      classList.map(async (member) => {
        const user = await this.userRepository.findOne({
          where: { _id: new ObjectId(member.user_id) },
        });

        return { ...member, avatar_url: user?.avatarUrl }; // Use optional chaining to avoid errors if user is null
      }),
    );
    return members;
  }

  async inviteMember(
    classId: string,
    memberDto: AddMemberDto,
    host_id: string,
  ): Promise<any> {
    const existingMember = await this.classListRepository.findOne({
      where: { email: memberDto.email },
    });

    const curClass = await this.classRepository.findOne({
      where: { _id: new ObjectId(classId) },
    });

    //const objectId = new ObjectId(host_id);
    // const host_user = await this.userRepository.findOne({
    //   where: { _id: objectId },
    // });
    if (!existingMember && curClass) {
      this.mailerService.sendMail({
        to: memberDto.email,
        subject:
          memberDto.role === 'Student'
            ? `Invitation to co-teach class "${curClass.name}"`
            : `Invitation to join class:"${curClass.name}`,
        template:
          memberDto.role === 'Student'
            ? './student-invitation-form'
            : './teacher-invitation-form',
        context: {
          receivedEmail: memberDto.email,
          className: curClass.name,
          inviteLink: `http://localhost:4000/classes/${classId}/members/accept-invitation?email=${memberDto.email}&role=${memberDto.role}`,
        },
      });

      return HttpStatus.OK;
    } else {
      throw new HttpException('Member already exists', HttpStatus.CONFLICT);
    }
  }

  async acceptInvitation(
    classId: string,
    memberDto: AddMemberDto,
    res: Response,
  ): Promise<any> {
    //const objectId = new ObjectId(host_id);
    const existedUser = await this.userRepository.findOne({
      where: { email: memberDto.email },
    });

    if (existedUser) {
      const newMember = this.classListRepository.create({
        class_id: classId,
        user_id: existedUser._id.toString(),
        role: memberDto.role,
        student_id: existedUser.student_id,
        email: memberDto.email,
      });

      await this.classListRepository.save(newMember);
      return res.redirect(`http://localhost:3000/enrolled/${classId}/detail`);
    } else {
      return res.redirect(`http://localhost:3000/auth`);
    }
  }
}
