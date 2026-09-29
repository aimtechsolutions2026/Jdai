import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/codifypro";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

let lastFailureTimestamp = 0;
const RETRY_COOLDOWN_MS = 15000;

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (cached.conn) {
    return cached.conn;
  }

  // Prevent back-to-back 8s blocking timeouts on concurrent requests when offline/not whitelisted
  if (Date.now() - lastFailureTimestamp < RETRY_COOLDOWN_MS) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3500,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        lastFailureTimestamp = Date.now();
        console.warn(
          "MongoDB connection failed or not running locally:",
          err.message,
          "— Database service is currently unavailable."
        );
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
    if (!cached.conn) {
      cached.promise = null;
    }
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    return null;
  }

  return cached.conn;
}
