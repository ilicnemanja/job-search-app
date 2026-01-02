import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AutomationModule } from './shared/automation/automation.module';
import { UtilsModule } from './shared/utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 7200,
    }),
    AutomationModule,
    UtilsModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
