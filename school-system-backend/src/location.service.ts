import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class LocationService {
  private readonly logger = new Logger('LocationService');

  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
  ) {}


  private calculateAirDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async getAllClassLocations(userId: string) {
    try {
      let currentUser: any = await this.teacherRepo.findOne({ where: { idNumber: userId } as any });
      if (!currentUser) {
        currentUser = await this.studentRepo.findOne({ where: { idNumber: userId } as any });
      }

      if (!currentUser || !currentUser.grade) {
        return { students: [], teachers: [] };
      }

      const targetGrade = currentUser.grade;

      const students = await this.studentRepo.find({ where: { grade: targetGrade } as any });
      const teachers = await this.teacherRepo.find({ where: { grade: targetGrade } as any });

      const mainTeacher = teachers[0];
      const tLat = mainTeacher ? Number(mainTeacher.lat) : null;
      const tLng = mainTeacher ? Number(mainTeacher.lng) : null;

      return {
        students: students.map(s => {
          const sLat = Number(s.lat);
          const sLng = Number(s.lng);
          let distance = 0;
          let isFar = false;

          if (tLat && tLng && sLat !== 0) {
            distance = this.calculateAirDistance(tLat, tLng, sLat, sLng);
            isFar = distance > 3; 
          }

          return {
            id: s.idNumber,
            firstName: s.firstName,
            lastName: s.lastName,
            lat: sLat,
            lng: sLng,
            distance: distance.toFixed(2),
            isFar: isFar,
            role: 'student',
            grade: s.grade
          };
        }),
        teachers: teachers.map(t => ({
          id: t.idNumber,
          firstName: t.firstName,
          lastName: t.lastName,
          lat: Number(t.lat),
          lng: Number(t.lng),
          role: 'teacher',
          grade: t.grade
        }))
      };
    } catch (error) {
      return { students: [], teachers: [] };
    }
  }

  convertToDecimal(dms: any): number {
    if (!dms) return 0;
    const deg = parseFloat(dms.Degrees) || 0;
    const min = parseFloat(dms.Minutes) || 0;
    const sec = parseFloat(dms.Seconds) || 0;
    return deg + (min / 60) + (sec / 3600);
  }

  async updateLocationInDB(data: { idNumber: string, role: string, lat: number, lng: number }) {
    const repo = data.role === 'teacher' ? this.teacherRepo : this.studentRepo;
    try {
      const user = await repo.findOne({ where: { idNumber: data.idNumber } as any });
      if (!user) {

        return { success: false, message: 'User not found' };
      }

      user.lat = data.lat;
      user.lng = data.lng;
      await repo.save(user);

    
      return { success: true };
    } catch (error) {
     
      return { success: false };
    }
  }
}