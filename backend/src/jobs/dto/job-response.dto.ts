/**
 * DTO for job response data
 */
export class JobResponseDto {
  title: string;
  company: string;
  location: string;
  posted: string;
  link: string;
  tags: string[];
  companyLogo: string;
  inactive: boolean;
}

/**
 * DTO for paginated job list response
 */
export class JobListResponseDto {
  data: JobResponseDto[];
  total: number;
  source: string;
}
