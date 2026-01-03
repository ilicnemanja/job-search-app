import { Injectable } from '@nestjs/common';
import {
  HelloworldService,
  AVAILABLE_FIELDS,
  AVAILABLE_SENIORITIES,
} from '../shared/sites/helloworld/helloworld.service';
import { JobQueryDto, JobResponseDto, FiltersResponseDto } from './dto';

// Available platforms for job scraping
export const AVAILABLE_PLATFORMS = [
  { value: 'helloworld', label: 'HelloWorld' },
  { value: 'infostud', label: 'Infostud' },
  { value: 'linkedin', label: 'LinkedIn' },
];

@Injectable()
export class JobsService {
  constructor(private readonly helloworldService: HelloworldService) {}

  async findAll(query: JobQueryDto = {}): Promise<JobResponseDto[]> {
    const platform = query.platform?.toLowerCase() || 'helloworld';

    switch (platform) {
      case 'helloworld':
        return this.helloworldService.scrape(query);
      case 'infostud':
        // TODO: Implement InfostudService
        return [];
      case 'linkedin':
        // TODO: Implement LinkedInService
        return [];
      default:
        return this.helloworldService.scrape(query);
    }
  }

  getFilters(): FiltersResponseDto {
    return {
      platforms: AVAILABLE_PLATFORMS,
      fields: AVAILABLE_FIELDS,
      seniorities: AVAILABLE_SENIORITIES,
    };
  }
}
