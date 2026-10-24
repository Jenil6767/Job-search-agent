import { Job } from 'bullmq';
import { IJobMatchingJobData } from '@ai-jobpilot/types';
import { logger } from '../utils/logger.js';

export async function processJobMatching(job: Job<IJobMatchingJobData>): Promise<{ matchScore: number }> {
  logger.info(`[JobMatchingProcessor] Executing matching for profile: ${job.data.candidateProfileId}, job: ${job.data.jobId}`);

  // Simulating matching analysis
  await new Promise((resolve) => setTimeout(resolve, 250));

  logger.info(`[JobMatchingProcessor] Completed match for job ${job.id}`);
  return { matchScore: 85 };
}
