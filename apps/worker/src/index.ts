import dotenv from 'dotenv';
import { WorkerManager } from './runner.js';
import { registerScheduledIngestion } from './queues/job-ingestion.queue.js';
import { logger } from './utils/logger.js';
import { connectDatabase, disconnectDatabase } from '@ai-jobpilot/database';

dotenv.config();

async function bootstrap() {
  logger.info('==============================================');
  logger.info('🚀 Starting AI JobPilot BullMQ Worker Service');
  logger.info('==============================================');

  try {
    // Attempt database connection (with resilient non-fatal retry in dev)
    try {
      await connectDatabase({ maxRetries: 2, retryIntervalMs: 1000 });
    } catch (err) {
      logger.warn(`[Worker] MongoDB connection warning: ${(err as Error).message}`);
    }

    const workerManager = new WorkerManager();
    workerManager.start();

    // Register scheduled JSearch ingestion cron jobs (3x/day)
    try {
      await registerScheduledIngestion();
    } catch (err) {
      logger.warn(`[Worker] Failed to register scheduled ingestion: ${(err as Error).message}`);
    }

    // Graceful Shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down worker service...`);
      try {
        await workerManager.stop();
        await disconnectDatabase();
        logger.info('Worker shutdown completed cleanly.');
        process.exit(0);
      } catch (err) {
        logger.error('Error during worker shutdown:', err);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Fatal worker startup error:', err);
    process.exit(1);
  }
}

bootstrap();
