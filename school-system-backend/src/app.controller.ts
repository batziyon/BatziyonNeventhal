import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post('register')
  async register(@Body() data: any) {
    return await this.appService.register(data);
  }

  @Post('login')
  async login(@Body() data: any) {
    return await this.appService.login(data);
  }

  @Get('search-teacher')
  async searchTeacher(@Query('name') name: string) {
    const exists = await this.appService.searchTeacher(name);
    return { 
      registered: exists, 
      message: exists ? 'המורה נמצאה במערכת' : 'מורה זו לא נמצאה' 
    };
  }

  @Get('search-student')
  async searchStudent(@Query('name') name: string) {
    const exists = await this.appService.searchStudent(name);
    return { 
      registered: exists, 
      message: exists ? 'התלמידה נמצאה במערכת' : 'תלמידה זו לא נמצאה' 
    };
  }

  @Get('teachers')
  async findAllTeachers() {
    return await this.appService.findAllTeachers();
  }

  @Get('students-by-grade')
  async getStudentsByGrade(@Query('grade') grade: string) {
    return await this.appService.getStudentsByGrade(grade);
  }
}