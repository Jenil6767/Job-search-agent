import { Redis } from 'ioredis';
import { logger } from '../utils/logger.js';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = Number(process.env.REDIS_PORT) || 6379;
    const password = process.env.REDIS_PASSWORD || undefined;

    redisClient = new Redis({
      host,
      port,
      password,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy(times) {
        const delay = Math.min(times * 500, 3000);
        return delay;
      },
    });

    redisClient.on('connect', () => {
      logger.info(`[Redis] Connected successfully to ${host}:${port}`);
    });

    redisClient.on('error', (err) => {
      logger.error(`[Redis] Connection error: ${err.message}`);
    });
  }

  return redisClient;
}

export async function pingRedis(): Promise<boolean> {
  try {
    const client = getRedisClient();
    const pong = await client.ping();
    return pong === 'PONG';
  } catch (err) {
    logger.warn(`[Redis] Ping failed: ${(err as Error).message}`);
    return false;
  }
}

export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('[Redis] Connection closed gracefully');
  }
}
