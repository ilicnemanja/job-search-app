import { Controller, Get, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobQueryDto, JobResponseDto, FiltersResponseDto } from './dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(@Query() query: JobQueryDto): Promise<JobResponseDto[]> {
    return this.jobsService.findAll(query);
  }

  @Get('filters')
  getFilters(): FiltersResponseDto {
    return this.jobsService.getFilters();
  }
}
