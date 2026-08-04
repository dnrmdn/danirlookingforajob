import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '../env';
import { logger } from './logger';
import { AppError } from './errors';

// If no Redis URL is provided (e.g. local dev without Redis), we'll create a mock/in-memory limiter
let redisClient: Redis | null = null;

try {
  if (env.KV_REST_API_URL && env.KV_REST_API_TOKEN) {
    redisClient = new Redis({
      url: env.KV_REST_API_URL,
      token: env.KV_REST_API_TOKEN,
    });
  }
} catch (error) {
  logger.warn('Failed to initialize Redis client for rate limiting. Will use in-memory fallback.');
}

// In-memory fallback map for development
const memoryCache = new Map<string, { count: number; resetAt: number }>();

/**
 * Creates a rate limiter instance
 */
export const createRateLimiter = (requests: number, windowStr: '10 s' | '1 m' | '15 m' | '1 h' | '1 d' = '1 m') => {
  if (redisClient) {
    return new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(requests, windowStr),
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  }

  // Very basic in-memory fallback for local dev when Redis is absent
  return {
    limit: async (identifier: string) => {
      const now = Date.now();
      const windowMs = parseWindow(windowStr);
      
      const record = memoryCache.get(identifier);
      
      if (!record || record.resetAt < now) {
        memoryCache.set(identifier, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: requests - 1 };
      }
      
      if (record.count >= requests) {
        return { success: false, remaining: 0 };
      }
      
      record.count += 1;
      return { success: true, remaining: requests - record.count };
    }
  };
};

function parseWindow(windowStr: string): number {
  const [val, unit] = windowStr.split(' ');
  const num = parseInt(val, 10);
  switch (unit) {
    case 's': return num * 1000;
    case 'm': return num * 60 * 1000;
    case 'h': return num * 60 * 60 * 1000;
    case 'd': return num * 24 * 60 * 60 * 1000;
    default: return 60000;
  }
}

// Common limiters
export const authRateLimit = createRateLimiter(5, '15 m'); // 5 attempts per 15 minutes
export const uploadRateLimit = createRateLimiter(10, '1 h'); // 10 uploads per hour

export async function requireRateLimit(identifier: string, limiter = authRateLimit) {
  const { success } = await limiter.limit(identifier);
  if (!success) {
    throw new AppError('Too many requests, please try again later.', 429, 'RATE_LIMIT_EXCEEDED');
  }
}
