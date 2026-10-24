import { Router, Request, Response } from 'express';
import { pingDatabase } from '@ai-jobpilot/database';
import { pingRedis } from '../services/redis.service.js';
import { IApiResponse } from '@ai-jobpilot/types';

export const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response<IApiResponse>) => {
  const [dbHealthy, redisHealthy] = await Promise.all([
    pingDatabase().catch(() => false),
    pingRedis().catch(() => false),
  ]);

  const isHealthy = dbHealthy && redisHealthy;
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: isHealthy,
    message: isHealthy ? 'AI JobPilot API is fully operational' : 'One or more downstream services degraded',
    data: {
      status: isHealthy ? 'healthy' : 'degraded',
      services: {
        mongodb: dbHealthy ? 'connected' : 'disconnected',
        redis: redisHealthy ? 'connected' : 'disconnected',
      },
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});
