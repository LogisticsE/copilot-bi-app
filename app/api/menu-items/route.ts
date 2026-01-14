import { NextRequest, NextResponse } from 'next/server';
import { MenuItem } from '@/lib/types';
import { getRedisClient, isRedisConfigured } from '@/lib/redis';

const STORAGE_KEY = 'portal:menu_items';

// Default menu items (used as fallback or initial data)
const DEFAULT_ITEMS: MenuItem[] = [
  {
    id: 'demo-copilot',
    name: 'Support Assistant',
    icon: 'MessageSquare',
    type: 'copilot',
    config: {
      embedUrl: 'https://copilotstudio.microsoft.com/environments/Default-xxxx',
    },
    order: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@admin.com',
  },
  {
    id: 'demo-powerbi',
    name: 'Sales Dashboard',
    icon: 'BarChart3',
    type: 'powerbi',
    config: {
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      tenantId: 'your-tenant-id',
      workspaceId: 'your-workspace-id',
      reportId: 'your-report-id',
    },
    order: 1,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@admin.com',
  },
];

// GET - Retrieve all menu items
export async function GET() {
  try {
    // If Redis is not configured, return default items
    if (!isRedisConfigured()) {
      return NextResponse.json({ 
        items: DEFAULT_ITEMS,
        warning: 'Redis not configured. Using default items. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.'
      });
    }

    const redis = getRedisClient();
    if (!redis) {
      return NextResponse.json({ 
        items: DEFAULT_ITEMS,
        warning: 'Redis client unavailable. Verify UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.'
      });
    }

    // Try to fetch from Redis
    const stored = await redis.get<MenuItem[]>(STORAGE_KEY);
    
    if (stored && Array.isArray(stored)) {
      return NextResponse.json({ items: stored });
    }

    // If no data in Redis, initialize with defaults and save
    await redis.set(STORAGE_KEY, DEFAULT_ITEMS);
    return NextResponse.json({ items: DEFAULT_ITEMS });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Fallback to default items on error
    return NextResponse.json({ items: DEFAULT_ITEMS });
  }
}

// POST - Save menu items (replace all)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request: items must be an array' },
        { status: 400 }
      );
    }

    // Validate items structure
    for (const item of items) {
      if (!item.id || !item.name || !item.type || !item.config) {
        return NextResponse.json(
          { error: 'Invalid item structure' },
          { status: 400 }
        );
      }
    }

    // If Redis is not configured, return error
    if (!isRedisConfigured()) {
      return NextResponse.json(
        { 
          error: 'Redis not configured. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.',
          items: items // Return items anyway for development
        },
        { status: 503 }
      );
    }

    const redis = getRedisClient();
    if (!redis) {
      return NextResponse.json(
        { 
          error: 'Redis client unavailable after configuration check. Verify UPSTASH environment variables.',
        },
        { status: 503 }
      );
    }

    // Save to Redis
    await redis.set(STORAGE_KEY, items);
    
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Error saving menu items:', error);
    return NextResponse.json(
      { error: 'Failed to save menu items' },
      { status: 500 }
    );
  }
}
