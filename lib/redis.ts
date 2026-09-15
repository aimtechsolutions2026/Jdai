// Universal Redis client with in-memory TTL fallback
import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";

interface CacheStore {
  [key: string]: { value: string; expiresAt?: number };
}

class InMemoryRedisFallback {
  private store: CacheStore = {};

  async get(key: string): Promise<string | null> {
    const item = this.store[key];
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      delete this.store[key];
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, opts?: { ex?: number }): Promise<"OK"> {
    const expiresAt = opts?.ex ? Date.now() + opts.ex * 1000 : undefined;
    this.store[key] = { value, expiresAt };
    return "OK";
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const num = current ? parseInt(current, 10) + 1 : 1;
    await this.set(key, num.toString());
    return num;
  }

  async del(key: string): Promise<number> {
    if (this.store[key]) {
      delete this.store[key];
      return 1;
    }
    return 0;
  }
}

let redisInstance: {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, opts?: { ex?: number }) => Promise<any>;
  incr: (key: string) => Promise<number>;
  del: (key: string) => Promise<number>;
};

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redisUrl = process.env.REDIS_URL;

if (upstashUrl && upstashToken) {
  const upstash = new UpstashRedis({
    url: upstashUrl,
    token: upstashToken,
  });
  redisInstance = {
    get: async (key: string) => {
      const val = await upstash.get(key);
      return val !== null && val !== undefined ? String(val) : null;
    },
    set: async (key: string, val: string, opts?: { ex?: number }) => {
      if (opts?.ex) {
        return upstash.set(key, val, { ex: opts.ex });
      }
      return upstash.set(key, val);
    },
    incr: async (key: string) => upstash.incr(key),
    del: async (key: string) => upstash.del(key),
  };
} else if (redisUrl && !redisUrl.includes("localhost")) {
  try {
    const io = new IORedis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
    redisInstance = {
      get: async (k) => io.get(k),
      set: async (k, v, opts) => (opts?.ex ? io.set(k, v, "EX", opts.ex) : io.set(k, v)),
      incr: async (k) => io.incr(k),
      del: async (k) => io.del(k),
    };
  } catch {
    redisInstance = new InMemoryRedisFallback();
  }
} else {
  // Use memory fallback
  redisInstance = new InMemoryRedisFallback();
}

export const redis = redisInstance;

