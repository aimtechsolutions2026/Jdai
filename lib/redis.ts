import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";

declare global {
  // Reused Redis connection across serverless invocations
  var __codifypro_ioredis: IORedis | undefined;
  var __codifypro_upstash: UpstashRedis | undefined;
}

export interface RedisClientInterface {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, opts?: { ex?: number }) => Promise<any>;
  incr: (key: string) => Promise<number>;
  del: (key: string) => Promise<number>;
}

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redisUrl = process.env.REDIS_URL;

let redisClient: RedisClientInterface;

if (upstashUrl && upstashToken) {
  // 1. Upstash Redis (HTTP REST-based, ideal for Vercel / serverless edge)
  const upstash =
    global.__codifypro_upstash ||
    new UpstashRedis({
      url: upstashUrl,
      token: upstashToken,
    });
  global.__codifypro_upstash = upstash;

  redisClient = {
    get: async (key: string) => {
      try {
        const val = await upstash.get(key);
        return val !== null && val !== undefined ? String(val) : null;
      } catch (err) {
        console.warn(`[Redis] Upstash GET error for key ${key}:`, err);
        return null;
      }
    },
    set: async (key: string, val: string, opts?: { ex?: number }) => {
      try {
        if (opts?.ex) {
          return await upstash.set(key, val, { ex: opts.ex });
        }
        return await upstash.set(key, val);
      } catch (err) {
        console.warn(`[Redis] Upstash SET error for key ${key}:`, err);
        return null;
      }
    },
    incr: async (key: string) => {
      try {
        return await upstash.incr(key);
      } catch {
        return 1;
      }
    },
    del: async (key: string) => {
      try {
        return await upstash.del(key);
      } catch {
        return 0;
      }
    },
  };
} else if (redisUrl) {
  // 2. Standard Redis via IORedis (serverless connection reuse + graceful offline fallback)
  let io: IORedis;
  if (global.__codifypro_ioredis) {
    io = global.__codifypro_ioredis;
  } else {
    io = new IORedis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 2500,
      enableOfflineQueue: false, // Don't block requests if Redis is unreachable
      retryStrategy: (times) => (times > 2 ? null : 500),
    });
    // Suppress unhandled connection error crashes
    io.on("error", (err) => {
      console.warn("[Redis] IORedis connection event error (will fallback to live DB):", err.message || err);
    });
    global.__codifypro_ioredis = io;
  }

  redisClient = {
    get: async (k: string) => {
      try {
        return await io.get(k);
      } catch (err: any) {
        console.warn(`[Redis] GET error for key ${k}:`, err?.message || err);
        return null;
      }
    },
    set: async (k: string, v: string, opts?: { ex?: number }) => {
      try {
        return opts?.ex ? await io.set(k, v, "EX", opts.ex) : await io.set(k, v);
      } catch (err: any) {
        console.warn(`[Redis] SET error for key ${k}:`, err?.message || err);
        return null;
      }
    },
    incr: async (k: string) => {
      try {
        return await io.incr(k);
      } catch {
        return 1;
      }
    },
    del: async (k: string) => {
      try {
        return await io.del(k);
      } catch {
        return 0;
      }
    },
  };
} else {
  // 3. No Redis configured: graceful null fallback directing all queries to live MongoDB
  redisClient = {
    get: async () => null,
    set: async () => null,
    incr: async () => 1,
    del: async () => 0,
  };
}

export const redis = redisClient;
