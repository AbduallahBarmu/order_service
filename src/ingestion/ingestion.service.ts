import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class IngestionService {

  // Logger gives you structured output with the class name as context
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    @InjectQueue('job-ingestion')           // inject the queue by name
    private readonly ingestionQueue: Queue,
  ) {}

  // Runs every hour automatically — no HTTP request needed
  @Cron(CronExpression.EVERY_HOUR)
  async fetchJobs() {
    this.logger.log('Starting job ingestion from Arbeitnow API...');

    try {
      const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
      const result = await response.json();
      const jobs = result.data;

      this.logger.log(`Fetched ${jobs.length} jobs from API`);

      // Add each job to the queue individually
      // The queue processes them one by one, with retries on failure
      for (const job of jobs) {
        await this.ingestionQueue.add('process-job', {
          title: job.title,
          company: job.company_name,
          location: job.location,
          url: job.url,
          description: job.description,
        });
      }

      this.logger.log(`Added ${jobs.length} jobs to queue`);
    } catch (error) {
      this.logger.error('Failed to fetch jobs from API', error);
    }
  }
}