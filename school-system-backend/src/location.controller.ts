import { Controller, Post, Body, Get, Param, InternalServerErrorException, Logger } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
  private readonly logger = new Logger('LocationController');

  constructor(private readonly locationService: LocationService) {}

  @Get('by-user/:id')
  async getClassLocations(@Param('id') id: string) {
    this.logger.log(`Fetching locations for user ID: ${id}`);
    return await this.locationService.getAllClassLocations(id);
  }

  @Post('student-update')
  async updateStudentLocation(@Body() data: any) {
    try {
      this.logger.log(`Update request for Student ID: ${data.ID}`);
      
      const lat = this.locationService.convertToDecimal(data.Coordinates.Latitude);
      const lng = this.locationService.convertToDecimal(data.Coordinates.Longitude);
      
      return await this.locationService.updateLocationInDB({
        idNumber: String(data.ID),
        role: 'student',
        lat,
        lng: lng + 0.005
      });
    } catch (e) {
      this.logger.error(`Failed to update student location:`);
      throw new InternalServerErrorException("Invalid data structure");
    }
  }

  @Post('teacher-update')
  async updateTeacherLocation(@Body() data: any) {
    try {
      this.logger.log(`Update request for Teacher ID: ${data.ID}`);
      const lat = this.locationService.convertToDecimal(data.Coordinates.Latitude);
      const lng = this.locationService.convertToDecimal(data.Coordinates.Longitude);
      
      return await this.locationService.updateLocationInDB({
        idNumber: String(data.ID),
        role: 'teacher',
        lat,
        lng
      });
    } catch (e) {
      this.logger.error(`Failed to update teacher location: `);
      throw new InternalServerErrorException("Invalid data structure");
    }
  }
}