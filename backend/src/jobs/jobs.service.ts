import { Injectable } from '@nestjs/common';
import {
  HelloworldService,
  AVAILABLE_FIELDS,
  AVAILABLE_SENIORITIES,
} from '../shared/sites/helloworld/helloworld.service';
import { JobQueryDto, JobResponseDto, FiltersResponseDto } from './dto';

@Injectable()
export class JobsService {
  constructor(private readonly helloworldService: HelloworldService) {}

  async findAll(query: JobQueryDto = {}): Promise<JobResponseDto[]> {
    // Scrape from multiple job sites
    const results = await Promise.all([
      this.helloworldService.scrape(query),
      // Add other jobsite services here
    ]);
    // Flatten and return all jobs
    return results.flat();
  }

  getFilters(): FiltersResponseDto {
    return {
      fields: AVAILABLE_FIELDS,
      seniorities: AVAILABLE_SENIORITIES,
    };
  }
}
