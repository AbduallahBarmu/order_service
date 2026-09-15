// what the client sends to the server when creating a new job

// DTO defines what that body must look like. If the client sends garbage, 
// the request gets rejected before your code ever runs.


import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {

  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  company: string;

  @ApiPropertyOptional({ example: 'Remote' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'https://acme.com/jobs/1' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ example: 'Building APIs with NestJS and TypeORM' })
  @IsOptional()
  @IsString()
  description?: string;
}