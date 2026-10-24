import { Queue } from 'bullmq';
import { QUEUE_NAMES } from '@ai-jobpilot/config';
import { IJobIngestionJobData } from '@ai-jobpilot/types';
import { redisConnectionOptions } from '../config/redis.js';
import { logger } from '../utils/logger.js';

/**
 * Scheduled job ingestion using BullMQ repeatable jobs.
 *
 * Strategy (free tier — 200 req/month):
 *   - 3 scheduled searches per day = ~90 req/month
 *   - Remaining ~110 for on-demand user searches
 *   - Keywords rotate daily for variety
 */

// Keyword sets that rotate by day-of-month
const KEYWORD_ROTATION: { keywords: string[]; location?: string }[] = [
  { keywords: ['react developer'], location: 'India' },
  { keywords: ['node.js developer'], location: 'Remote' },
  { keywords: ['full stack developer'], location: 'India' },
  { keywords: ['typescript engineer'], location: 'Remote' },
  { keywords: ['backend developer'], location: 'India' },
  { keywords: ['frontend developer'], location: 'Remote' },
];

let ingestionQueue: Queue<IJobIngestionJobData> | null = null;

/**
 * Get (or create) the job-ingestion BullMQ queue.
 */
export function getIngestionQueue(): Queue<IJobIngestionJobData> {
  if (!ingestionQueue) {
    ingestionQueue = new Queue<IJobIngestionJobData>(QUEUE_NAMES.JOB_INGESTION, {
      connection: redisConnectionOptions,
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { age: 86400, count: 100 }, // keep last 100 or 24h
        removeOnFail: { age: 604800, count: 200 },    // keep failed for 7 days
      },
    });
  }
  return ingestionQueue;
}

/**
 * Register the 3 daily repeatable jobs for automatic job ingestion.
 *
 * Schedule (IST-friendly times):
 *   - 08:00 UTC+5:30 → cron "30 2 * * *" (UTC)
 *   - 14:00 UTC+5:30 → cron "30 8 * * *" (UTC)
 *   - 20:00 UTC+5:30 → cron "30 14 * * *" (UTC)
 */
export async function registerScheduledIngestion(): Promise<void> {
  const queue = getIngestionQueue();

  // Remove old repeatable jobs first (idempotent re-registration)
  const existingRepeatables = await queue.getRepeatableJobs();
  for (const r of existingRepeatables) {
    await queue.removeRepeatableByKey(r.key);
  }

  const schedules = [
    { name: 'morning-ingestion',   cron: '30 2 * * *',  slotIndex: 0 },
    { name: 'afternoon-ingestion', cron: '30 8 * * *',  slotIndex: 1 },
    { name: 'evening-ingestion',   cron: '30 14 * * *', slotIndex: 2 },
  ];

  for (const schedule of schedules) {
    await queue.add(
      schedule.name,
      {
        source: 'jsearch',
        keywords: getRotatedKeywords(schedule.slotIndex).keywords,
        location: getRotatedKeywords(schedule.slotIndex).location,
        timestamp: new Date().toISOString(),
      },
      {
        repeat: { pattern: schedule.cron },
        jobId: schedule.name,
      }
    );

    logger.info(`[Scheduler] Registered repeatable job: ${schedule.name} (${schedule.cron} UTC)`);
  }

  logger.info('✅ [Scheduler] 3 daily JSearch ingestion jobs registered');
}

/**
 * Select keyword set based on day-of-month + slot offset for variety.
 */
function getRotatedKeywords(slotIndex: number): { keywords: string[]; location?: string } {
  const dayOfMonth = new Date().getDate();
  const idx = (dayOfMonth + slotIndex) % KEYWORD_ROTATION.length;
  return KEYWORD_ROTATION[idx];
}

/**
 * Manually enqueue a one-off ingestion job (used by the API for on-demand searches).
 */
export async function enqueueManualIngestion(
  keywords: string[],
  location?: string,
  userId?: string
): Promise<string> {
  const queue = getIngestionQueue();

  const job = await queue.add('manual-ingestion', {
    source: 'jsearch',
    keywords,
    location,
    userId,
    timestamp: new Date().toISOString(),
  });

  logger.info(`[Scheduler] Manual ingestion job enqueued: ${job.id}`);
  return job.id!;
}
