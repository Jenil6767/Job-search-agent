import { Worker } from 'bullmq';
import { QUEUE_NAMES } from '@ai-jobpilot/config';
import { redisConnectionOptions } from './config/redis.js';
import { logger } from './utils/logger.js';
import { processJobIngestion } from './processors/job-ingestion.processor.js';
import { processJobMatching } from './processors/job-matching.processor.js';
import { processWorkflowExecution } from './processors/workflow.processor.js';

export class WorkerManager {
  private workers: Worker[] = [];

  public start(): void {
    const concurrency = Number(process.env.WORKER_CONCURRENCY) || 5;

    logger.info(`⚡ Initializing BullMQ Workers with concurrency: ${concurrency}`);

    // 1. Job Ingestion Worker
    const ingestionWorker = new Worker(
      QUEUE_NAMES.JOB_INGESTION,
      async (job) => processJobIngestion(job),
      {
        connection: redisConnectionOptions,
        concurrency,
      }
    );

    // 2. Job Matching Worker
    const matchingWorker = new Worker(
      QUEUE_NAMES.JOB_MATCHING,
      async (job) => processJobMatching(job),
      {
        connection: redisConnectionOptions,
        concurrency,
      }
    );

    // 3. Workflow Execution Worker
    const workflowWorker = new Worker(
      QUEUE_NAMES.WORKFLOW_EXECUTION,
      async (job) => processWorkflowExecution(job),
      {
        connection: redisConnectionOptions,
        concurrency,
      }
    );

    this.workers = [ingestionWorker, matchingWorker, workflowWorker];

    this.workers.forEach((worker) => {
      worker.on('completed', (job) => {
        logger.info(`[Worker: ${worker.name}] Job ${job.id} completed successfully`);
      });

      worker.on('failed', (job, err) => {
        logger.error(`[Worker: ${worker.name}] Job ${job?.id} failed: ${err.message}`);
      });

      worker.on('error', (err) => {
        logger.error(`[Worker: ${worker.name}] Internal worker error: ${err.message}`);
      });
    });

    logger.info(`✅ [WorkerManager] Registered ${this.workers.length} BullMQ background workers`);
  }

  public async stop(): Promise<void> {
    logger.info('🛑 Closing BullMQ workers gracefully...');
    await Promise.all(this.workers.map((w) => w.close()));
    logger.info('BullMQ workers stopped.');
  }
}
