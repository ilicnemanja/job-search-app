import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { SitesModule } from '../shared/sites/sites.module';

@Module({
  imports: [SitesModule],
  providers: [JobsService],
  controllers: [JobsController],
})
export class JobsModule {}
