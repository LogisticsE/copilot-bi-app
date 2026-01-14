import { NextResponse } from 'next/server';
import { isRedisConfigured } from '@/lib/redis';

// Health check endpoint for debugging environment variable issues
export async function GET() {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      // Show partial values for debugging (never expose full credentials)
      upstashUrlConfigured: !!upstashUrl,
      upstashUrlPrefix: upstashUrl ? upstashUrl.substring(0, 20) + '...' : null,
      upstashTokenConfigured: !!upstashToken,
      upstashTokenLength: upstashToken ? upstashToken.length : 0,
      isRedisConfigured: isRedisConfigured(),
    },
    azure: {
      websiteName: process.env.WEBSITE_SITE_NAME || null,
      websiteSlot: process.env.WEBSITE_SLOT_NAME || null,
    }
  });
}
