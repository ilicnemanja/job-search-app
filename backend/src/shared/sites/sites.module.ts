import { Module } from '@nestjs/common';
import { HelloworldModule } from './helloworld/helloworld.module';

/**
 * SitesModule - Aggregates all job site scrapers
 *
 * Each job site has its own folder with module and service.
 * To add a new site:
 * 1. Create a new folder (e.g., infostud/)
 * 2. Add infostud.service.ts and infostud.module.ts
 * 3. Import and export InfostudModule here
 */
@Module({
  imports: [HelloworldModule],
  exports: [HelloworldModule],
})
export class SitesModule {}
