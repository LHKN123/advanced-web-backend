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
  ) { }

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
        'BASE_URL_BACKEND',
      )}/classes/enrolled?code=${savedClass.class_code}`;

      const addedClass = await this.classRepository.save(savedClass);
      return {
        ...addedClass,
        "type": "teaching"
      }
    } else {
      throw new HttpException('Class already exists', HttpStatus.CONFLICT);
    }
  }

  async getAllTeachingClasses(host_id: string): Promise<any> {
    const allClasses = await this.classRepository.find({
      where: { host_id: host_id },
    });

    const teachingClassList = await Promise.all(
      allClasses.map(async (_class) => {
        const member_number = await this.getMemberNumberInClass(_class._id.toString())

        const result = {
          ..._class,
          student_number: member_number.students,
          teacher_number: member_number.teachers
        };
        return result;
      }),
    );

    return teachingClassList;
  }

  async getAllTeachingClassesExist(): Promise<any> {
    const allClasses = await this.classRepository.find();
    return allClasses;
  }

  async getClassStudentInfo(user_id: string, class_id: string): Promise<any> {
    const classInfo = await this.classListRepository.findOne({
      where: { user_id: user_id, class_id: class_id },
    });

    return classInfo;
  }

  async getAllClasses(host_id: string): Promise<any> {
    const teachingClasses = await this.getAllTeachingClasses(host_id);
    const teachingClassList = await Promise.all(
      teachingClasses.map(async (_class) => {
        const member_number = await this.getMemberNumberInClass(_class._id.toString())
        return {
          ..._class,
          type: "teaching",
          student_number: member_number.students,
          teacher_number: member_number.teachers
        };
      }),
    );

    const enrolledClasses = await this.getAllEnrolledClasses(host_id);
    const enrolledClassList = await Promise.all(
      enrolledClasses.map(async (_class) => {
        const member_number = await this.getMemberNumberInClass(_class._id.toString());
        return {
          ..._class,
          type: "enrolled",
          student_number: member_number.students,
          teacher_number: member_number.teachers
        };
      }),
    );
    const allClasses = [...teachingClassList, ...enrolledClassList];

    return allClasses;
  }

  async getClassById(class_id: string): Promise<any> {
    const _class = await this.classRepository.findOne({
      where: { _id: new ObjectId(class_id) },
    });

    return _class;
  }

  async deleteClassById(class_id: string): Promise<any> {
    const _class = await this.getClassById(class_id);

    if (!_class) {
      throw new HttpException("Class not found: ", HttpStatus.NOT_FOUND);
    }

    const { host, members } = await this.getMembers(class_id);
    for (const member of members) {
      await this.deleteMember(class_id, member._id);
    }
    await this.deleteMember(class_id, host._id);

    await this.classRepository.remove(_class);
    return HttpStatus.OK;
  }

  async active(class_id: string): Promise<any> {
    const _class = await this.getClassById(class_id);

    if (!_class) {
      throw new HttpException("Class not found: ", HttpStatus.NOT_FOUND);
    }

    await this.classRepository.update(new ObjectId(class_id), {
      ..._class,
      status: "active"
    })
  }

  async inactive(class_id: string): Promise<any> {
    const _class = await this.getClassById(class_id);

    if (!_class) {
      throw new HttpException("Class not found: ", HttpStatus.NOT_FOUND);
    }

    await this.classRepository.update(new ObjectId(class_id), {
      ..._class,
      status: "inactive"
    })
  }

  async getMembers(class_id: string): Promise<any> {
    const classList = await this.classListRepository.find({
      where: { class_id: class_id },
    });

    const curClass = await this.classRepository.findOne({
      where: { _id: new ObjectId(class_id) },
    });

    const host_user = await this.userRepository.findOne({
      where: { _id: new ObjectId(curClass.host_id) },
    });

    return { host_user: host_user, members: classList };
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
            ? `Invitation to join class "${curClass.name}"`
            : `Invitation to co-teach class "${curClass.name}"`,
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
      if (memberDto.role === 'Student' && !existedUser.student_id) {
        return res.redirect(`http://localhost:3000/profile/empty-student-id`);
      }
      const newMember = this.classListRepository.create({
        class_id: classId,
        user_id: existedUser._id.toString(),
        role: memberDto.role,
        student_id: existedUser.student_id,
        email: memberDto.email,
        fullName: memberDto.role === "Student" ? "LTT" : existedUser.username,
        avatar_url: existedUser.avatarUrl
      });

      await this.classListRepository.save(newMember);
      return res.redirect(
        `http://localhost:3000/${memberDto.role == 'Student' ? 'enrolled' : 'teaching'
        }/${classId}/detail`,
      );
    } else {
      return res.redirect(`http://localhost:3000/auth`);
    }
  }

  async deleteMember(class_id: string, member_id: string): Promise<any> {
    const member = await this.classListRepository.findOne({
      where: { class_id: class_id, user_id: member_id },
    });

    if (member) {
      await this.classListRepository.remove(member);
      return HttpStatus.OK;
    } else {
      throw new HttpException("Member doesn't exist", HttpStatus.CONFLICT);
    }
  }

  async updateMember(class_id: string, member_id: string, reqBody: any): Promise<any> {
    const member = await this.classListRepository.findOne({
      where: { class_id: class_id, user_id: member_id },
    });

    if (member) {
      await this.classListRepository.save({
        ...member, fullName: reqBody.fullName,
        student_id: reqBody.student_id,
        role: reqBody.role
      });
      return HttpStatus.OK;
    } else {
      throw new HttpException("Member doesn't exist", HttpStatus.CONFLICT);
    }
  }

  async getMember(class_id: string, member_id: string): Promise<any> {
    const member = await this.classListRepository.findOne({
      where: { class_id: class_id, user_id: member_id },
    });
    if (!member) {
      throw new HttpException("Member doesn't exist", HttpStatus.NOT_FOUND);
    }
    return member;
  }

  async getAllEnrolledClasses(user_id: string): Promise<any> {
    const allEnrolledClassesId = await this.classListRepository.find({
      where: { user_id: user_id },
    });

    const allEnrolledClasses = await Promise.all(
      allEnrolledClassesId.map(async (classList) => {
        const curClass = await this.classRepository.findOne({
          where: { _id: new ObjectId(classList.class_id) },
        });

        return curClass;
      }),
    );

    const allClasses = await Promise.all(
      allEnrolledClasses.map(async (_class) => {
        const member_number = await this.getMemberNumberInClass(_class._id.toString())
        return {
          ..._class,
          student_number: member_number.students,
          teacher_number: member_number.teachers
        };
      }),
    );

    return allClasses;
  }

  async enrolledClass(
    code: string,
    user_id: string,
  ): Promise<any> {
    const curUser = await this.userRepository.findOne({
      where: { _id: new ObjectId(user_id) },
    });

    if (curUser) {
      if (!curUser.student_id) {
        // Instead of redirecting, you can throw an exception or return an error response.
        throw new HttpException(
          'User does not have a student ID',
          HttpStatus.CONFLICT,
        );
      }

      const curClass = await this.classRepository.findOne({
        where: { class_code: code },
      });

      if (!curClass) {
        throw new HttpException(
          'Class code does not match any classes!',
          HttpStatus.NOT_FOUND,
        );
      }

      const existingClass = await this.classListRepository.findOne({
        where: { class_id: curClass._id.toString(), user_id: curUser._id.toString() },
      });

      if (existingClass) {
        throw new HttpException("You've already enrolled the class", HttpStatus.CONFLICT);
      }
      else if (curClass.status === "inactive") {
        throw new HttpException("The class is inactive", HttpStatus.CONFLICT);
      }

      const newMember = this.classListRepository.create({
        class_id: curClass._id.toString(),
        user_id: curUser._id.toString(),
        role: 'Student',
        student_id: curUser.student_id,
        email: curUser.email,
        avatar_url: curUser.avatarUrl
      });

      const createdMember = await this.classListRepository.save(newMember);

      if (createdMember) {
        return { ...curClass, type: "enrolled" };
      } else {
        throw new HttpException("Can't join the class!", HttpStatus.CONFLICT);
      }
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async getMemberNumberInClass(class_id: string): Promise<any> {
    const students = await this.classListRepository.find({
      where: { class_id: class_id, role: "Student" }
    });


    const teachers = await this.classListRepository.find({
      where: { class_id: class_id, role: "Teacher" }
    });

    const result = {
      "students": students.length,
      "teachers": teachers.length + 1
    }
    return result;
  }

}
