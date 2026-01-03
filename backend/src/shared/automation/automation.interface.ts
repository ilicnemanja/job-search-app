/**
 * Automation Interface - Contract for browser automation libraries
 *
 * Any automation library (Puppeteer, Playwright, etc.) must implement this interface
 * to ensure interchangeability and adherence to the Open/Closed Principle.
 */

export type WaitUntilOption =
  | 'load'
  | 'domcontentloaded'
  | 'networkidle0'
  | 'networkidle2';

/**
 * Represents a browser page abstraction.
 * Each automation library will have its own implementation.
 */
export interface IAutomationPage {
  goto(url: string, options?: { waitUntil?: WaitUntilOption }): Promise<void>;
  waitForSelector(
    selector: string,
    options?: { timeout?: number },
  ): Promise<void>;
  waitForNavigation(options?: { waitUntil?: WaitUntilOption }): Promise<void>;
  click(selector: string): Promise<void>;
  type(selector: string, text: string): Promise<void>;
  keyboard: {
    press(key: string): Promise<void>;
  };
  evaluate<T>(
    fn: string | ((...args: unknown[]) => T),
    ...args: unknown[]
  ): Promise<T>;
  close(): Promise<void>;
}

/**
 * Automation Service Interface
 *
 * All automation services (PuppeteerService, PlaywrightService, etc.)
 * must implement this interface to ensure consistent API across implementations.
 */
export interface IAutomationService {
  /**
   * Initialize the browser instance.
   * @param headless - Whether to run the browser in headless mode.
   */
  init(headless?: boolean): Promise<void>;

  /**
   * Create and return a new browser page.
   */
  newPage(): Promise<IAutomationPage>;

  /**
   * Navigate to a URL on a given page.
   * @param page - The automation page instance.
   * @param url - The URL to navigate to.
   * @param waitUntil - When to consider navigation complete.
   */
  goto(
    page: IAutomationPage,
    url: string,
    waitUntil?: WaitUntilOption,
  ): Promise<void>;

  /**
   * Execute a scraper function in the page context.
   * @param page - The automation page instance.
   * @param scraper - Function to execute in the browser context.
   */
  scrapeHtml<T>(
    page: IAutomationPage,
    scraper: () => T | Promise<T>,
  ): Promise<T>;

  /**
   * Close the browser instance and release resources.
   */
  close(): Promise<void>;
}

/**
 * Token for dependency injection of the automation service.
 * Use this token to inject the automation service in your modules.
 *
 * Example:
 * ```typescript
 * @Inject(AUTOMATION_SERVICE) private automationService: IAutomationService
 * ```
 */
export const AUTOMATION_SERVICE = 'AUTOMATION_SERVICE';
