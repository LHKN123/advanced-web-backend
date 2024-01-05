import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student, StudentEntity } from './student.entity';
import { Repository } from 'typeorm';
import { ImportStudentDto } from './dto/import_student.dto';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(StudentEntity)
        private readonly studentRepository: Repository<StudentEntity>,
    ) { }

    async create(classId: string, studentDto: ImportStudentDto): Promise<any> {
        const existedRow = await this.studentRepository.findOne({
            where: { class_id: classId },
        });
        if (!existedRow) {
            const newRow = this.studentRepository.create({
                class_id: classId,
                students: studentDto.students
            });
            console.log("new row  ", newRow);

            return await this.studentRepository.save(newRow);
        } else {
            existedRow.students = studentDto.students;

            return await this.studentRepository.save(existedRow);
        }
    }

    async get(class_id: string): Promise<any> {
        const studentList = await this.studentRepository.find({
            where: { class_id: class_id },
        });
        console.log('Student list found', studentList, class_id);
        return studentList;
    }


}
