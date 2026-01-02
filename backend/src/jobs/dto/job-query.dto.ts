import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for job search query parameters
 */
export class JobQueryDto {
  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  seniority?: string;
}
