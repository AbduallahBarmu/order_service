import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../jobs/job.entity.js';
import { IngestionService } from './ingestion.service.js';
import { IngestionProcessor } from './ingestion.processor.js';
import { IngestionListener } from './ingestion.listener.js';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'job-ingestion' }),  // creates the named queue
    TypeOrmModule.forFeature([Job]),                       // processor needs the repo
  ],
  providers: [IngestionService, IngestionProcessor, IngestionListener],
})
export class IngestionModule {}