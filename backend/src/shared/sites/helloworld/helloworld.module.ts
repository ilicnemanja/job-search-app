import { Module } from '@nestjs/common';
import { HelloworldService } from './helloworld.service';
import { AutomationModule } from '../../automation/automation.module';

@Module({
  imports: [AutomationModule],
  providers: [HelloworldService],
  exports: [HelloworldService],
})
export class HelloworldModule {}
