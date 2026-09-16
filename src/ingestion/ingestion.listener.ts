import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Job } from '../jobs/job.entity.js';

@Injectable()
export class IngestionListener {

  private readonly logger = new Logger(IngestionListener.name);

  // This runs every time 'job.created' event is emitted
  @OnEvent('job.created')
  handleJobCreated(job: Job) {
    this.logger.log(`Event received — new job: "${job.title}" at ${job.company}`);

    // In a real app, this is where you'd:
    // - Send a notification email
    // - Update a search index
    // - Push to a websocket for real-time updates
    // - Trigger analytics
  }
}