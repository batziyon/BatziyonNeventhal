import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LocationController } from './location.controller'; 
import { LocationService } from './location.service';  
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-lucky-bread-anlhqpsj-pooler.c-6.us-east-1.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: 'npg_oIG9y5rzbgNV',
      database: 'neondb',
      entities: [Student, Teacher],
      synchronize: true, 
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false, 
        },
      },
      connectTimeoutMS: 5000, 
    }),
    TypeOrmModule.forFeature([Student, Teacher]),
  ],
  controllers: [
    AppController, 
    LocationController 
  ],
  providers: [
    AppService, 
    LocationService,
  ],
})
export class AppModule {}