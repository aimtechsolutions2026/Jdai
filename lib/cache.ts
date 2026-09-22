import { redis } from "./redis";

/**
 * Shared Redis-backed cache helper with automatic fallback to live MongoDB query.
 * 
 * - Checks Redis cache first for matching key.
 * - On cache hit: deserializes JSON and returns immediately.
 * - On cache miss or Redis outage: logs warning and executes `fetchFn()` directly.
 * - On successful `fetchFn()`, asynchronously writes result back to Redis with `ttlSeconds`.
 * 
 * @param key Unique Redis cache key string (e.g. "admin:stats")
 * @param ttlSeconds Time-to-live in seconds
 * @param fetchFn Asynchronous function performing the actual MongoDB query or aggregation
 * @returns Cached or newly fetched data
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached !== null && cached !== undefined) {
      try {
        return JSON.parse(cached) as T;
      } catch {
        return cached as unknown as T;
      }
    }
  } catch (err: any) {
    console.warn(
      `[Cache] Redis read failed for key "${key}", falling through to live DB query:`,
      err?.message || err
    );
  }

  // Cache miss or Redis connection failure: execute live query
  const result = await fetchFn();

  // Asynchronously write result to Redis
  if (result !== undefined && result !== null) {
    try {
      await redis.set(key, JSON.stringify(result), { ex: ttlSeconds });
    } catch (writeErr: any) {
      console.warn(
        `[Cache] Redis write failed for key "${key}" (non-fatal):`,
        writeErr?.message || writeErr
      );
    }
  }

  return result;
}

