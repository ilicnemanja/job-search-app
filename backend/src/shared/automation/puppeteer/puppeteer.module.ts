import { Module } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import { AUTOMATION_SERVICE } from '../automation.interface';

@Module({
  providers: [
    PuppeteerService,
    {
      provide: AUTOMATION_SERVICE,
      useExisting: PuppeteerService,
    },
  ],
  exports: [PuppeteerService, AUTOMATION_SERVICE],
})
export class PuppeteerModule {}
