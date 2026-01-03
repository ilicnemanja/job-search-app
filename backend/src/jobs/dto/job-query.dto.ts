import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * DTO for job search query parameters
 */
export class JobQueryDto {
  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  q?: string; // Keyword search

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  seniority?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  allPages?: boolean;
}
