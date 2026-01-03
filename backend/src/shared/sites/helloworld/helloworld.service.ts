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
  q?: string; // Keyword search
  page?: number; // Page number (1-based) for pagination
  allPages?: boolean; // When true, fetches all pages
}

interface Job {
  title: string;
  company: string;
  location: string;
  posted: string;
  link: string;
  tags: string[];
  companyLogo: string;
}

const BASE_URL = 'https://www.helloworld.rs/oglasi-za-posao/';
const PAGE_SIZE = 30; // Helloworld uses offset-based pagination with 30 items per page

const FIELD_MAP: Record<string, string> = {
  'software-engineering': 'programiranje',
  'project-management': 'menadzment',
};

const SENIORITY_MAP: Record<string, string> = {
  junior: '1',
  medior: '2',
  mid: '2',
  senior: '3',
};

// Available filters - exported for use in JobsService
export const AVAILABLE_FIELDS = [
  { value: 'software-engineering', label: 'Software Engineering' },
  { value: 'project-management', label: 'Project Management' },
];

export const AVAILABLE_SENIORITIES = [
  { value: 'junior', label: 'Junior' },
  { value: 'medior', label: 'Medior' },
  { value: 'senior', label: 'Senior' },
];

const SELECTORS = {
  cookieButton: 'div.cookie-ribbon-container button',
  jobCard: 'div.relative.rounded-lg.overflow-hidden',
  searchInput: 'input[name="q"].__autocomplete-full-text-search',
  autocompleteDropdown: 'ul.ui-autocomplete',
  autocompleteFirstItem: 'ul.ui-autocomplete li.ui-menu-item:first-child a',
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
    // Calculate page offset from page number (1-based to 0-based offset)
    const pageOffset = query.page ? (query.page - 1) * PAGE_SIZE : 0;
    const baseUrl = this.buildUrl(query);
    const urlWithPage = this.buildUrlWithPage(baseUrl, pageOffset);
    const cacheKey = `helloworld-jobs:${urlWithPage}:q=${query.q ?? ''}:allPages=${query.allPages ?? false}`;

    const cached = await this.cacheService.get<Job[]>(cacheKey);
    if (cached) return cached;

    if (query.allPages) {
      return this.scrapeAllPages(baseUrl, cacheKey, query.q);
    }

    return this.scrapeFromSite(urlWithPage, cacheKey, query.q);
  }

  private buildUrl(query: JobQuery, pageOffset?: number): string {
    const fieldPath = FIELD_MAP[query.field?.toLowerCase() ?? ''] ?? '';
    const seniorityParams = this.buildSeniorityParams(query.seniority);

    let url = `${BASE_URL}${fieldPath}`;
    const params: string[] = [...seniorityParams];

    if (pageOffset !== undefined && pageOffset > 0) {
      params.push(`page=${pageOffset}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
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

  private async scrapeAllPages(
    baseUrl: string,
    cacheKey: string,
    searchQuery?: string,
  ): Promise<Job[]> {
    await this.automationService.init();
    const page = await this.automationService.newPage();
    const allJobs: Job[] = [];

    try {
      let pageOffset = 0;
      let hasMorePages = true;

      while (hasMorePages) {
        const url = this.buildUrlWithPage(baseUrl, pageOffset);
        this.logger.log(
          `[PAGINATION] Scraping page offset ${pageOffset}: ${url}`,
        );

        await this.automationService.goto(page, url, 'networkidle2');

        if (pageOffset === 0) {
          await this.dismissCookieConsent(page);
          // Perform keyword search only on first page
          if (searchQuery) {
            await this.performKeywordSearch(page, searchQuery);
          }
        }

        const hasJobCards = await this.checkForJobCards(page);
        if (!hasJobCards) {
          this.logger.log(
            `[PAGINATION] No job cards found at offset ${pageOffset}, stopping`,
          );
          hasMorePages = false;
          break;
        }

        const jobs = await this.extractJobs(page);
        const validJobs = this.filterValidJobs(jobs);

        if (validJobs.length === 0) {
          this.logger.log(
            `[PAGINATION] No valid jobs at offset ${pageOffset}, stopping`,
          );
          hasMorePages = false;
        } else {
          this.logger.log(
            `[PAGINATION] Found ${validJobs.length} jobs at offset ${pageOffset}`,
          );
          allJobs.push(...validJobs);

          // If we got fewer jobs than PAGE_SIZE, we're likely on the last page
          if (validJobs.length < PAGE_SIZE) {
            this.logger.log(
              `[PAGINATION] Less than ${PAGE_SIZE} jobs found, likely last page`,
            );
            hasMorePages = false;
          } else {
            pageOffset += PAGE_SIZE;
          }
        }
      }

      this.logger.log(`[PAGINATION] Total jobs scraped: ${allJobs.length}`);
      await this.cacheService.set(cacheKey, allJobs);
      return allJobs;
    } catch (error) {
      this.logger.error('Error scraping all pages from helloworld.rs:', error);
      return allJobs; // Return what we have so far
    } finally {
      await page.close();
      await this.automationService.close();
    }
  }

  private buildUrlWithPage(baseUrl: string, pageOffset: number): string {
    if (pageOffset === 0) {
      return baseUrl;
    }

    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}page=${pageOffset}`;
  }

  private async checkForJobCards(page: IAutomationPage): Promise<boolean> {
    try {
      await page.waitForSelector(SELECTORS.jobCard, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  private async scrapeFromSite(
    url: string,
    cacheKey: string,
    searchQuery?: string,
  ): Promise<Job[]> {
    await this.automationService.init();
    const page = await this.automationService.newPage();

    try {
      await this.automationService.goto(page, url, 'networkidle2');
      await this.dismissCookieConsent(page);

      // Perform keyword search if provided
      if (searchQuery) {
        await this.performKeywordSearch(page, searchQuery);
      }

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

  private async performKeywordSearch(
    page: IAutomationPage,
    query: string,
  ): Promise<void> {
    try {
      this.logger.log(`[SEARCH] Typing keyword: "${query}"`);
      await page.waitForSelector(SELECTORS.searchInput, { timeout: 5000 });
      await page.type(SELECTORS.searchInput, query);

      // Wait for autocomplete dropdown to appear
      this.logger.log('[SEARCH] Waiting for autocomplete dropdown...');
      await page.waitForSelector(SELECTORS.autocompleteDropdown, {
        timeout: 5000,
      });
      await this.delay(500); // Small delay for dropdown to fully render

      // Click on the first item in the dropdown
      this.logger.log('[SEARCH] Clicking first autocomplete suggestion...');
      await page.click(SELECTORS.autocompleteFirstItem);

      // Wait for results to load after selection
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      // Additional delay to ensure data is fully loaded
      await this.delay(1000);
      this.logger.log('[SEARCH] Search completed, results loaded');
    } catch (error) {
      this.logger.error('[SEARCH] Failed to perform keyword search:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
