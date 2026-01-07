import redis from "./redis";

export async function acquireLock(
  key: string,
  ttlMs: number,
  retryCount = 0,
  retryDelay = 100
): Promise<{ success: boolean; identifier?: string }> {
  const identifier = Math.random().toString(36).substring(2, 15); // Unique lock identifier
  let attempts = 0;

  while (attempts <= retryCount) {
    try {
      // SET key identifier NX PX ttlMs
      const result = await redis.set(key, identifier, "PX", ttlMs, "NX");

      if (result === "OK") {
        return { success: true, identifier };
      }

      if (attempts < retryCount) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
      attempts++;
    } catch (error) {
      console.error("Redis set error:", error);
    }
  }

  return { success: false };
}

export async function setCache(key: string, value: any, ttl?: number) {
  try {
    const stringValue = JSON.stringify(value);

    if (ttl) {
      // Set with expiration (seconds)
      const result = await redis.setex(key, ttl, stringValue);
      console.log("@@@result", result);
      return result === "OK";
    } else {
      // Set without expiration
      await redis.set(key, stringValue);
    }

    return true;
  } catch (error) {
    console.error("Redis set error:", error);
    return false;
  }
}

export async function setNX(key: string, value: any, ttl?: number): Promise<boolean> {
  try {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      // SET key value NX EX ttl
      const result = await redis.set(key, stringValue, "EX", ttl, "NX");
      console.log("@@@result", result);
      return result === "OK";
    } else {
      // SET key value NX
      const result = await redis.set(key, stringValue, "NX");
      return result === "OK";
    }
  } catch (error) {
    console.error("Redis setNX error:", error);
    return false;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (!data) return null;

    return JSON.parse(data) as T;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

export async function deleteCache(key: string) {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error("Redis delete error:", error);
    return false;
  }
}

// Clear all cache (use with caution)
export async function clearCache() {
  try {
    await redis.flushall();
    return true;
  } catch (error) {
    console.error("Redis clear error:", error);
    return false;
  }
}
