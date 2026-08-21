import { NextResponse } from 'next/server';
import { getCache, setCache, isRedisConnected } from '@/lib/redis';

export const dynamic = 'force-dynamic';

interface DemoPostPayload {
  title: string;
  content: string;
  author?: string;
  createdAt: string;
}

const DEMO_CACHE_KEY = 'demo:latest_post';

export async function GET() {
  try {
    const cachedPost = await getCache<DemoPostPayload>(DEMO_CACHE_KEY);
    const connected = isRedisConnected();

    return NextResponse.json({
      status: 'online',
      message: 'AI Prompt Hub server and Redis cache system are running smoothly.',
      redis: {
        connected,
        status: connected ? 'Connected (Active)' : 'Fallback Mode (In-Memory Cache Active)',
      },
      latestDemoPost: cachedPost || {
        title: 'Welcome to AI Prompt Hub Demo',
        content: 'No custom demo posts created yet. Submit a POST request to this endpoint to test Redis caching!',
        author: 'System',
        createdAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to execute demo GET request.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { title, content, author } = body;

    const payload: DemoPostPayload = {
      title: title?.trim() || 'Demo Test Prompt',
      content: content?.trim() || 'Testing Redis API caching and server responsiveness.',
      author: author?.trim() || 'Usman Admin',
      createdAt: new Date().toISOString(),
    };

    // Cache the demo post in Redis for 10 minutes (600 seconds)
    await setCache(DEMO_CACHE_KEY, payload, 600);
    const connected = isRedisConnected();

    return NextResponse.json(
      {
        success: true,
        message: 'Demo POST request processed successfully! Data saved and cached.',
        redis: {
          connected,
          mode: connected ? 'Redis Engine' : 'In-Memory Engine',
        },
        savedData: payload,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process demo POST request.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
