import { Redis } from '@upstash/redis';

let redisClient: Redis | null = null;

// Helper function to check if Redis is configured
export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

// Lazy-initialize Redis only when credentials are present.
// Avoids construction errors in environments (like Azure App Service slots)
// where env vars may be injected after the app boots.
export function getRedisClient(): Redis | null {
  if (!isRedisConfigured()) return null;
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redisClient;
}
