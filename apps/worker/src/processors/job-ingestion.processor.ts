import { Job } from 'bullmq';
import { IJobIngestionJobData } from '@ai-jobpilot/types';
import { JobModel } from '@ai-jobpilot/database';
import { JSearchService } from '../services/jsearch.service.js';
import { logger } from '../utils/logger.js';

const jsearchService = new JSearchService();

export async function processJobIngestion(
  job: Job<IJobIngestionJobData>
): Promise<{ processedCount: number; skippedCount: number; source: string }> {
  const { source = 'jsearch', keywords = [], location } = job.data;

  logger.info(
    `[JobIngestionProcessor] Job ${job.id} | source=${source}, keywords=[${keywords.join(', ')}], location=${location || 'any'}`
  );

  if (source !== 'jsearch') {
    logger.warn(`[JobIngestionProcessor] Unknown source "${source}" — skipping`);
    return { processedCount: 0, skippedCount: 0, source };
  }

  // Build search query from keywords
  const query = keywords.length > 0 ? keywords.join(' ') : 'software developer';

  // Call JSearch API (rate-limit checked internally)
  const { jobs: normalizedJobs, rawCount } = await jsearchService.searchJobs(query, location);

  if (rawCount === 0) {
    logger.info(`[JobIngestionProcessor] No jobs returned (rate limit reached or no results)`);
    return { processedCount: 0, skippedCount: 0, source };
  }

  // Upsert each job into MongoDB (deduplicate via source + externalId compound index)
  let processedCount = 0;
  let skippedCount = 0;

  for (const jobData of normalizedJobs) {
    try {
      const result = await JobModel.findOneAndUpdate(
        { source: jobData.source, externalId: jobData.externalId },
        { $set: jobData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Check if it was a new insert vs update by comparing timestamps
      const isNew =
        result.createdAt &&
        result.updatedAt &&
        Math.abs(new Date(result.createdAt as string).getTime() - new Date(result.updatedAt as string).getTime()) < 1000;

      if (isNew) {
        processedCount++;
      } else {
        skippedCount++;
      }
    } catch (err) {
      // Duplicate key errors are expected for concurrent ingestion — treat as skip
      if ((err as { code?: number }).code === 11000) {
        skippedCount++;
      } else {
        logger.error(`[JobIngestionProcessor] Failed to upsert job ${jobData.externalId}: ${(err as Error).message}`);
      }
    }
  }

  logger.info(
    `[JobIngestionProcessor] Job ${job.id} complete — ${processedCount} new, ${skippedCount} duplicates (of ${rawCount} fetched)`
  );

  return { processedCount, skippedCount, source };
}
