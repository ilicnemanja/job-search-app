/**
 * Utility for extracting job data from a job card DOM element on helloworld.rs
 */

export interface ExtractedJob {
  title: string;
  company: string;
  location: string;
  posted: string;
  link: string;
  tags: string[];
  companyLogo: string;
  inactive: boolean;
}

/**
 * Main extraction function - extracts job data from a helloworld.rs job card
 * NOTE: This function must be self-contained as it gets serialized and
 * evaluated in the browser context via page.evaluate()
 */
export function extractHelloWorldJob(card: Element): ExtractedJob {
  const BASE_URL = 'https://www.helloworld.rs';

  // Helper: Extract text content from selector
  const getTextContent = (selector: string): string =>
    card.querySelector(selector)?.textContent?.trim() || '';

  // Helper: Extract attribute from selector
  const getAttribute = (selector: string, attr: string): string | null =>
    card.querySelector(selector)?.getAttribute(attr) || null;

  // Helper: Get text from sibling of icon element
  const getIconSiblingText = (iconClass: string): string => {
    const el = Array.from(card.querySelectorAll(`i.${iconClass} ~ p`))[0];
    return el?.textContent?.trim() || '';
  };

  // Helper: Check if card is inactive
  const isInactive = (): boolean => {
    const classList = card.className;
    return (
      classList.includes('bg-transparent') &&
      classList.includes('shadow-none') &&
      classList.includes('border-gray-600')
    );
  };

  // Helper: Extract tags
  const extractTags = (): string[] =>
    Array.from(card.querySelectorAll('a.jobtag'))
      .map((a) => a.textContent?.trim())
      .filter(Boolean) as string[];

  // Helper: Build full URL
  const buildUrl = (path: string | null): string =>
    path ? `${BASE_URL}${path}` : '';

  const linkHref = getAttribute('h3 a', 'href');
  const logoSrc = getAttribute('a.__ga4_job_company_logo img', 'src');

  return {
    title: getTextContent('h3 a'),
    company: getTextContent('h4 a'),
    location: getIconSiblingText('la-map-marker'),
    posted: getIconSiblingText('la-clock'),
    link: buildUrl(linkHref),
    tags: extractTags(),
    companyLogo: buildUrl(logoSrc),
    inactive: isInactive(),
  };
}
