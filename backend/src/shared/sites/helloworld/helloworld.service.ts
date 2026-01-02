import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  IAutomationService,
  IAutomationPage,
  AUTOMATION_SERVICE,
} from '../../automation/automation.interface';
import { CacheService } from '../../utils';
import { extractHelloWorldJob } from '../../scraping/helloworld';

export interface JobQuery {
  seniority?: string;
  field?: string;
}

interface Job {
  title: string;
  company: string;
  location: string;
  posted: string;
  link: string;
  tags: string[];
  companyLogo: string;
  inactive: boolean;
}

const BASE_URL = 'https://www.helloworld.rs/oglasi-za-posao/';

const FIELD_MAP: Record<string, string> = {
  programming: 'programiranje',
  programiranje: 'programiranje',
  management: 'menadzment',
  managment: 'menadzment',
};

const SENIORITY_MAP: Record<string, string> = {
  junior: '1',
  medior: '2',
  senior: '3',
};

const SELECTORS = {
  cookieButton: 'div.cookie-ribbon-container button',
  jobCard: 'div.relative.rounded-lg.overflow-hidden',
};

@Injectable()
export class HelloworldService {
  private readonly logger = new Logger(HelloworldService.name);

  constructor(
    @Inject(AUTOMATION_SERVICE)
    private readonly automationService: IAutomationService,
    private readonly cacheService: CacheService,
  ) {}

  async scrape(query: JobQuery = {}): Promise<Job[]> {
    const url = this.buildUrl(query);
    const cacheKey = `helloworld-jobs:${url}`;

    const cached = await this.cacheService.get<Job[]>(cacheKey);
    if (cached) return cached;

    return this.scrapeFromSite(url, cacheKey);
  }

  private buildUrl(query: JobQuery): string {
    const fieldPath = FIELD_MAP[query.field?.toLowerCase() ?? ''] ?? '';
    const seniorityParams = this.buildSeniorityParams(query.seniority);

    let url = `${BASE_URL}${fieldPath}`;
    if (seniorityParams.length > 0) {
      url += `?${seniorityParams.join('&')}`;
    }

    return url;
  }

  private buildSeniorityParams(seniority?: string): string[] {
    if (!seniority) return [];

    const levels = this.parseSeniorityInput(seniority);

    return levels
      .map((level, index) => {
        const value = SENIORITY_MAP[level];
        return value ? `senioritet%5B${index}%5D=${value}` : null;
      })
      .filter((param): param is string => param !== null);
  }

  private parseSeniorityInput(seniority: string | string[]): string[] {
    if (Array.isArray(seniority)) {
      return seniority.map((s) => s.toLowerCase());
    }
    return seniority.split(',').map((s) => s.trim().toLowerCase());
  }

  private async scrapeFromSite(url: string, cacheKey: string): Promise<Job[]> {
    await this.automationService.init(false);
    const page = await this.automationService.newPage();

    try {
      await this.automationService.goto(page, url, 'networkidle2');
      await this.dismissCookieConsent(page);
      await this.waitForJobCards(page);

      const jobs = await this.extractJobs(page);
      const validJobs = this.filterValidJobs(jobs);

      await this.cacheService.set(cacheKey, validJobs);
      return validJobs;
    } catch (error) {
      this.logger.error('Error scraping helloworld.rs:', error);
      return [];
    } finally {
      await page.close();
      await this.automationService.close();
    }
  }

  private async dismissCookieConsent(page: IAutomationPage): Promise<void> {
    try {
      await page.waitForSelector(SELECTORS.cookieButton, { timeout: 3000 });
      await page.click(SELECTORS.cookieButton);
      this.logger.log('[COOKIE CONSENT] Accepted');
    } catch {
      this.logger.log('[COOKIE CONSENT] Not found or already accepted');
    }
  }

  private async waitForJobCards(page: IAutomationPage): Promise<void> {
    await page.waitForSelector(SELECTORS.jobCard, { timeout: 10000 });
  }

  private async extractJobs(page: IAutomationPage): Promise<Job[]> {
    const extractFnStr = extractHelloWorldJob.toString();

    return page.evaluate((fnStr: string) => {
      // eslint-disable-next-line no-eval
      const extractFn = eval(`(${fnStr})`);
      const cards = document.querySelectorAll(
        'div.relative.rounded-lg.overflow-hidden',
      );
      return Array.from(cards).map((card) => extractFn(card));
    }, extractFnStr);
  }

  private filterValidJobs(jobs: Job[]): Job[] {
    return jobs.filter(
      (job) =>
        job.title ||
        job.company ||
        job.location ||
        job.posted ||
        job.link ||
        (job.tags && job.tags.length > 0) ||
        job.companyLogo,
    );
  }
}
