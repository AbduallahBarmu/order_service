import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job as BullJob } from 'bullmq';
import { Job } from '../jobs/job.entity.js';
import { CreateJobDto } from '../jobs/dto/create-job.dto.js';

@Processor('job-ingestion')  // listens to the same queue name
export class IngestionProcessor extends WorkerHost {

  private readonly logger = new Logger(IngestionProcessor.name);

  constructor(
    @InjectRepository(Job)
    private readonly jobsRepo: Repository<Job>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  // This runs for every item in the queue
  async process(bullJob: BullJob<CreateJobDto>) {
    const data = bullJob.data;

    // Check if we already have this job (by title + company) to avoid duplicates
    const exists = await this.jobsRepo.findOneBy({
      title: data.title,
      company: data.company,
    });

    if (exists) {
      this.logger.debug(`Skipping duplicate: ${data.title} at ${data.company}`);
      return;
    }

    // Save to database
    const job = this.jobsRepo.create(data);
    const saved = await this.jobsRepo.save(job);

    this.logger.log(`Saved: ${saved.title} at ${saved.company}`);

    // Emit an event — anyone listening for 'job.created' will react
    this.eventEmitter.emit('job.created', saved);
  }
}