import Redis from "ioredis";

// For development - using local Docker Redis
const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  // Default to local Docker Redis
  return "redis://localhost:6379";
};

// Create Redis client
const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: null, // Important for Next.js
  enableReadyCheck: false,
});

// For development, log connection status
if (process.env.NODE_ENV === "development") {
  redis.on("connect", () => {
    console.log("✅ Connected to Redis");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
  });
}

export default redis;
