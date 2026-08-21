import Redis from 'ioredis';

// Fallback in-memory cache when Redis is disconnected or unconfigured
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

declare global {
  // eslint-disable-next-line no-var
  var _redisClient: Redis | undefined;
}

let redis: Redis | null = null;
let isConnected = false;

function createRedisInstance(): Redis | null {
  const redisUrl = process.env.REDIS_URL || process.env.REDIS_URI;

  if (!redisUrl && process.env.NODE_ENV === 'production') {
    console.warn('[Redis] REDIS_URL not provided. Operating in fallback in-memory cache mode.');
    return null;
  }

  try {
    const client = new Redis(redisUrl || 'redis://127.0.0.1:6379', {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('[Redis] Max connection retries reached. Falling back to in-memory caching.');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    client.on('connect', () => {
      isConnected = true;
      console.log('[Redis] Successfully connected to Redis instance.');
    });

    client.on('error', (err) => {
      isConnected = false;
      // Suppress spamming error trace in console during fallback mode
    });

    return client;
  } catch (err) {
    console.warn('[Redis] Initialization error. Using fallback cache.');
    return null;
  }
}

if (process.env.NODE_ENV === 'development') {
  if (!global._redisClient) {
    global._redisClient = createRedisInstance() || undefined;
  }
  redis = global._redisClient || null;
} else {
  redis = createRedisInstance();
}

/** Check if active Redis instance is connected */
export function isRedisConnected(): boolean {
  return isConnected && redis?.status === 'ready';
}

/** Get item from Redis cache or fallback in-memory cache */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (redis && (redis.status === 'ready' || redis.status === 'connecting')) {
      const data = await redis.get(key);
      if (data) return JSON.parse(data) as T;
    }
  } catch (err) {
    // Silent failover to in-memory fallback
  }

  // Fallback in-memory lookup
  const cached = memoryCache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  try {
    return JSON.parse(cached.value) as T;
  } catch {
    return null;
  }
}

/** Set item in Redis cache with TTL in seconds (default 60s) */
export async function setCache(key: string, value: any, ttlSeconds: number = 60): Promise<void> {
  const jsonString = JSON.stringify(value);

  try {
    if (redis && (redis.status === 'ready' || redis.status === 'connecting')) {
      await redis.set(key, jsonString, 'EX', ttlSeconds);
    }
  } catch (err) {
    // Fallback
  }

  // Always sync to in-memory fallback as backup
  memoryCache.set(key, {
    value: jsonString,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/** Delete specified cache keys */
export async function deleteCache(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  try {
    if (redis && (redis.status === 'ready' || redis.status === 'connecting')) {
      await redis.del(...keys);
    }
  } catch (err) {
    // Fallback
  }

  keys.forEach((k) => memoryCache.delete(k));
}

/** Invalidate cache keys matching pattern prefix */
export async function clearCachePattern(patternPrefix: string): Promise<void> {
  try {
    if (redis && (redis.status === 'ready' || redis.status === 'connecting')) {
      const keys = await redis.keys(`${patternPrefix}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }
  } catch (err) {
    // Fallback
  }

  for (const key of memoryCache.keys()) {
    if (key.startsWith(patternPrefix)) {
      memoryCache.delete(key);
    }
  }
}

export default redis;
