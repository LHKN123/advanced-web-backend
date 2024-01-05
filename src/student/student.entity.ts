import { Exclude, Transform, Type } from 'class-transformer';
import { Column, Entity, ObjectIdColumn, ObjectId as ObjectIDType } from 'typeorm';

export class Student {
    @Column()
    studentId: string;

    @Column()
    fullname: string;

    static fromPlain(plain: any): Student {
        const student = new Student();
        student.studentId = plain.studentId;
        student.fullname = plain.fullname;
        return student;
    }
}

@Entity()
export class StudentEntity {
    @ObjectIdColumn()
    _id: ObjectIDType;

    @Column()
    class_id: string;

    @Column()
    @Transform(({ value }) => value.map((student: any) => Student.fromPlain(student)), { toClassOnly: true })
    students: Student[];
}
