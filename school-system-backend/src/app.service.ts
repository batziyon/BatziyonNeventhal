import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
  ) {}


  async register(data: any) {
    const SIXTH_GRADES = ['ו1', 'ו2', 'ו3', 'ו4'];
    const validGrades = [...SIXTH_GRADES, 'ט'];
    const role = data.role?.toLowerCase().trim();

  
    if (!validGrades.includes(data.grade)) {
      throw new BadRequestException('כיתה לא חוקית ');
    }

    const existingUser = await this.findUserById(data.idNumber);
    if (existingUser) {
      throw new BadRequestException('תעודת זהות זו כבר רשומה במערכת');
    }

    const nameParts = (data.fullName || '').split(' ');
    const baseData: any = {
      idNumber: data.idNumber,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      grade: data.grade || null,
      role: role, 
      lat: 0, 
      lng: 0,
    };

    if (role === 'teacher') {
      const teacher = this.teacherRepo.create(baseData);
      return await this.teacherRepo.save(teacher);
    } else {
      const student = this.studentRepo.create(baseData);
      return await this.studentRepo.save(student);
    }
  }

  async login(data: any) {
    const role = data.role?.toLowerCase().trim();
    const repo = role === 'teacher' ? this.teacherRepo : this.studentRepo;

    const user = await repo.findOne({
      where: { idNumber: data.idNumber },
    });

    if (!user) {
      throw new UnauthorizedException('מספר זהות לא נמצא במערכת');
    }
    return user;
  }

  async searchTeacher(fullName: string): Promise<boolean> {
    const [firstName, ...rest] = fullName.split(' ');
    const lastName = rest.join(' ');
    const user = await this.teacherRepo.findOne({ where: { firstName, lastName } });
    return !!user;
  }

  async searchStudent(fullName: string): Promise<boolean> {
    const [firstName, ...rest] = fullName.split(' ');
    const lastName = rest.join(' ');
    const user = await this.studentRepo.findOne({ where: { firstName, lastName } });
    return !!user;
  }


  async findAllTeachers() {
    return await this.teacherRepo.find({
      select: ['firstName', 'lastName', 'grade'],
    });
  }

  async getStudentsByGrade(grade: string) {
    return await this.studentRepo.find({
      where: { grade },
      select: ['firstName', 'lastName', 'grade', 'lat', 'lng'],
    });
  }

  private async findUserById(idNumber: string) {
    const t = await this.teacherRepo.findOne({ where: { idNumber } });
    const s = await this.studentRepo.findOne({ where: { idNumber } });
    return t || s;
  }
}