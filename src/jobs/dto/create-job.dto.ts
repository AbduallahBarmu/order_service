// what the client sends to the server when creating a new job

// DTO defines what that body must look like. If the client sends garbage, 
// the request gets rejected before your code ever runs.


import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateJobDto {

    @IsString()
    title: string;

    @IsString()
    company: string;

    @IsString()
    @IsOptional()  // → this field is optional
    location?: string;

    @IsUrl()
    @IsOptional()
    url?: string;


    @IsOptional()
    @IsString()
    description?: string;
}