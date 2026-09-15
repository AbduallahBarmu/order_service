import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryJobsDto {

  @IsOptional()
  @Type(() => Number)    // query params arrive as strings, this converts "10" → 10
  @IsInt()
  @Min(1)
  page: number = 1;     // default to page 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)              // prevent someone requesting 10,000 rows at once
  limit: number = 10;   // default 10 items per page

  @IsOptional()
  @IsString()
  title?: string;        // filter by title (partial match)

  @IsOptional()
  @IsString()
  company?: string;      // filter by company (partial match)

  @IsOptional()
  @IsString()
  location?: string;     // filter by location (partial match)
}