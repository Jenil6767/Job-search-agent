import dotenv from 'dotenv';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';
import { connectDatabase, disconnectDatabase } from '@ai-jobpilot/database';
import { getRedisClient, closeRedisConnection } from './services/redis.service.js';

dotenv.config();

const port = Number(process.env.PORT) || 5000;

async function bootstrap() {
  try {
    // 1. Initialize MongoDB connection (optional soft failure in dev if containers aren't up yet)
    try {
      await connectDatabase({ maxRetries: 2, retryIntervalMs: 1000 });
    } catch (err) {
      logger.warn(`[Bootstrap] MongoDB connection failed at startup: ${(err as Error).message}. Will retry when requests occur.`);
    }

    // 2. Initialize Redis connection
    try {
      getRedisClient();
    } catch (err) {
      logger.warn(`[Bootstrap] Redis connection failed at startup: ${(err as Error).message}`);
    }

    // 3. Start Express server
    const app = createApp();
    const server = app.listen(port, () => {
      logger.info(`🚀 AI JobPilot API Gateway listening on port ${port} (http://localhost:${port})`);
      logger.info(`📋 Health check available at: http://localhost:${port}/api/v1/health`);
    });

    // 4. Graceful Shutdown Handlers
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await disconnectDatabase();
          await closeRedisConnection();
          logger.info('All connections closed cleanly. Exiting process.');
          process.exit(0);
        } catch (err) {
          logger.error('Error during cleanup:', err);
          process.exit(1);
        }
      });

      // Force exit if hanging
      setTimeout(() => {
        logger.error('Graceful shutdown timeout exceeded. Forcefully killing process.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Fatal bootstrap error:', err);
    process.exit(1);
  }
}

bootstrap();
