import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

export const DEFAULT_CACHE_TTL = 7200; // 2 hours

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.cacheManager.get<T>(key);

    if (cached) {
      this.logger.log(`[CACHE HIT] ${key}`);
      return cached;
    }

    this.logger.log(`[CACHE MISS] ${key}`);
    return null;
  }

  async set<T>(key: string, value: T, ttl = DEFAULT_CACHE_TTL): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
    this.logger.log(`[CACHE SET] ${key}`);
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.logger.log(`[CACHE DELETE] ${key}`);
  }

  async clear(): Promise<void> {
    await this.cacheManager.clear();
    this.logger.log('[CACHE CLEAR]');
  }

  /**
   * Get or set pattern - fetches from cache or executes factory function
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl = DEFAULT_CACHE_TTL,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }
}
