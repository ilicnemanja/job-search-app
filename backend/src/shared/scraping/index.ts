/**
 * Scraping Module - Aggregates all site-specific scraping utilities
 *
 * Each job site has its own folder with extraction utilities.
 * To add a new site:
 * 1. Create a new folder (e.g., infostud/)
 * 2. Add extraction utilities
 * 3. Export from index.ts
 */

// Re-export all site-specific scraping utilities
export * from './helloworld';
