import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import {
  IAutomationService,
  IAutomationPage,
  WaitUntilOption,
} from '../automation.interface';

/**
 * Puppeteer Page Adapter - Wraps puppeteer.Page to implement IAutomationPage
 */
class PuppeteerPageAdapter implements IAutomationPage {
  public keyboard: { press: (key: string) => Promise<void> };

  constructor(private readonly page: puppeteer.Page) {
    this.keyboard = {
      press: async (key: string) => {
        await this.page.keyboard.press(key as puppeteer.KeyInput);
      },
    };
  }

  async goto(
    url: string,
    options?: { waitUntil?: WaitUntilOption },
  ): Promise<void> {
    await this.page.goto(url, { waitUntil: options?.waitUntil });
  }

  async waitForSelector(
    selector: string,
    options?: { timeout?: number },
  ): Promise<void> {
    await this.page.waitForSelector(selector, options);
  }

  async waitForNavigation(options?: {
    waitUntil?: WaitUntilOption;
  }): Promise<void> {
    await this.page.waitForNavigation({ waitUntil: options?.waitUntil });
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    await this.page.type(selector, text);
  }

  async evaluate<T>(
    fn: string | ((...args: unknown[]) => T),
    ...args: unknown[]
  ): Promise<T> {
    return this.page.evaluate(fn as any, ...args);
  }

  async close(): Promise<void> {
    await this.page.close();
  }
}

/**
 * PuppeteerService - Implements IAutomationService using Puppeteer
 *
 * This service can be swapped with PlaywrightService or any other
 * implementation that follows the IAutomationService contract.
 */
@Injectable()
export class PuppeteerService implements IAutomationService {
  private readonly logger = new Logger(PuppeteerService.name);
  private browser: puppeteer.Browser | null = null;

  async init(headless = true): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ headless });
      this.logger.log('Puppeteer browser launched');
    }
  }

  async newPage(): Promise<IAutomationPage> {
    if (!this.browser) {
      await this.init();
    }
    const page = await this.browser!.newPage();
    return new PuppeteerPageAdapter(page);
  }

  async goto(
    page: IAutomationPage,
    url: string,
    waitUntil: WaitUntilOption = 'networkidle2',
  ): Promise<void> {
    await page.goto(url, { waitUntil });
  }

  async scrapeHtml<T>(
    page: IAutomationPage,
    scraper: () => T | Promise<T>,
  ): Promise<T> {
    return page.evaluate(scraper);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.logger.log('Puppeteer browser closed');
    }
  }
}
