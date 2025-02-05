import { Redis } from '@upstash/redis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

// Extract URL and token from the Redis URL
const url = process.env.REDIS_URL.split('@')[1].split(':')[0];
const token = process.env.REDIS_URL.split('://')[1].split('@')[0];

// Create Redis client
const redisClient = new Redis({
  url: `https://${url}`,
  token: token,
});

// Rate limiting functions
export async function isRateLimited(ip: string, limit: number, window: number): Promise<boolean> {
  if (!ip || typeof ip !== 'string' || ip === 'unknown') return false; // Allow unknown IPs

  // Sanitize IP to ensure it's safe for Redis key
  const sanitizedIp = ip.replace(/[^a-zA-Z0-9.:]/g, '_');
  const key = `rate_limit:${sanitizedIp}`;
  const now = Date.now();
  const windowStart = now - window;

  try {
    // First, clean up old entries
    await redisClient.zremrangebyscore(key, 0, windowStart);

    // Get current count before adding new request
    const currentCount = await redisClient.zcard(key);

    // If already over limit, extend expiry and return true
    if (currentCount >= limit) {
      await redisClient.expire(key, Math.ceil(window / 1000));
      return true;
    }

    // Add current request
    await redisClient.zadd(key, { score: now, member: `${now}` });
    await redisClient.expire(key, Math.ceil(window / 1000));

    return false;
  } catch {
    return false; // On error, allow the request
  }
}

// Caching functions
export async function getCachedData<T>(key: string): Promise<T | null> {
  if (!key || typeof key !== 'string') return null;

  try {
    const data = await redisClient.get<string>(key);
    if (!data) return null;

    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  expirySeconds: number = 3600,
): Promise<void> {
  if (!key || typeof key !== 'string') return;

  try {
    const serializedData = JSON.stringify(data);
    if (typeof serializedData !== 'string') return;

    await redisClient.setex(key, expirySeconds, serializedData);
  } catch {
    // Fail silently
  }
}

export async function invalidateCache(key: string): Promise<void> {
  if (!key || typeof key !== 'string') return;

  try {
    await redisClient.del(key);
  } catch {
    // Fail silently
  }
}

export default redisClient;
