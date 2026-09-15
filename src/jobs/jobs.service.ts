import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';
import { QueryJobsDto } from './dto/query-jobs.dto.js';

@Injectable()
export class JobsService {

  constructor(
    @InjectRepository(Job)
    private readonly jobsRepo: Repository<Job>,
  ) {}

  create(dto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepo.create(dto);
    return this.jobsRepo.save(job);
  }

  async findAll(query: QueryJobsDto) {
    const { page, limit, title, company, location } = query;

    // QueryBuilder gives us fine-grained control over the SQL
    const qb = this.jobsRepo.createQueryBuilder('job');

    // Add WHERE clauses only if the filter was provided
    // ILIKE = case-insensitive LIKE (Postgres-specific)
    if (title) {
      qb.andWhere('job.title ILIKE :title', { title: `%${title}%` });
    }

    if (company) {
      qb.andWhere('job.company ILIKE :company', { company: `%${company}%` });
    }

    if (location) {
      qb.andWhere('job.location ILIKE :location', { location: `%${location}%` });
    }

    // Order by newest first
    qb.orderBy('job.createdAt', 'DESC');

    // Pagination: skip = how many rows to skip, take = how many to return
    qb.skip((page - 1) * limit);
    qb.take(limit);

    // getManyAndCount runs TWO queries:
    // 1. SELECT with LIMIT/OFFSET → the data
    // 2. SELECT COUNT → total matching rows (ignoring pagination)
    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobsRepo.findOneBy({ id });
    if (!job) {
      throw new NotFoundException(`Job with id "${id}" not found`);
    }
    return job;
  }

  async update(id: string, dto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);
    Object.assign(job, dto);
    return this.jobsRepo.save(job);
  }

  async remove(id: string): Promise<void> {
    const job = await this.findOne(id);
    await this.jobsRepo.remove(job);
  }
}