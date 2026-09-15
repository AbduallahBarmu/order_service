import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity.js';
import { JobsService } from './jobs.service.js';
import { JobsController } from './jobs.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),  // registers the Job repository for this module
  ],
  controllers: [JobsController],     // HTTP layer
  providers: [JobsService],          // business logic layer
})
export class JobsModule {}