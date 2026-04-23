import Redis from "ioredis";

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null;
  if (!client) {
    client = new Redis(process.env.REDIS_URL, { lazyConnect: false, maxRetriesPerRequest: 3 });
  }
  return client;
}

export function getRedisKey(key: string): string {
  const prefix = process.env.REDIS_KEY_PREFIX?.trim();
  if (!prefix) return key;
  return `${prefix}:${key}`;
}
