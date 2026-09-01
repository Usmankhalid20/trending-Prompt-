import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { isRedisConnected } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    services: {
      mongodb: 'up' | 'down';
      redis: 'up' | 'fallback';
      cloudinary: 'configured' | 'unconfigured';
    };
  } = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'down',
      redis: 'fallback',
      cloudinary: 'unconfigured',
    },
  };

  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    health.services.mongodb = 'up';
  } catch {
    health.services.mongodb = 'down';
    health.status = 'degraded';
  }

  if (isRedisConnected()) {
    health.services.redis = 'up';
  } else {
    health.services.redis = 'fallback';
  }

  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    health.services.cloudinary = 'configured';
  }

  const statusCode = health.services.mongodb === 'up' ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
