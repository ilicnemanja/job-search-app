import { Module } from '@nestjs/common';
import { PuppeteerModule } from './puppeteer/puppeteer.module';

/**
 * AutomationModule - Main module for browser automation
 *
 * This module re-exports the current automation implementation (Puppeteer).
 * To switch to a different implementation (e.g., Playwright):
 * 1. Create a new module in automation/playwright/
 * 2. Import PlaywrightModule instead of PuppeteerModule
 * 3. No other code changes needed in consuming modules
 */
@Module({
  imports: [PuppeteerModule],
  exports: [PuppeteerModule],
})
export class AutomationModule {}
