import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Queue } from 'bullmq';
import { IApiResponse, IJobIngestionJobData } from '@ai-jobpilot/types';
import { QUEUE_NAMES } from '@ai-jobpilot/config';
import { JobModel, ApiUsageModel } from '@ai-jobpilot/database';

export const jobsRouter = Router();

// ----- Validation Schema -----

const searchExternalSchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters'),
  location: z.string().optional(),
});

// ----- Lazy BullMQ Queue -----

let ingestionQueue: Queue<IJobIngestionJobData> | null = null;

function getIngestionQueue(): Queue<IJobIngestionJobData> {
  if (!ingestionQueue) {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = Number(process.env.REDIS_PORT) || 6379;
    const password = process.env.REDIS_PASSWORD || undefined;

    ingestionQueue = new Queue<IJobIngestionJobData>(QUEUE_NAMES.JOB_INGESTION, {
      connection: { host, port, password, maxRetriesPerRequest: null },
    });
  }
  return ingestionQueue;
}

// ----- Routes -----

/**
 * GET /api/v1/jobs
 * List jobs from MongoDB (already ingested).
 */
jobsRouter.get('/', async (req: Request, res: Response<IApiResponse>) => {
  try {
    const {
      query,
      location,
      workplaceType,
      page = '1',
      limit = '20',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: Record<string, unknown> = { isActive: true };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (workplaceType) {
      filter.workplaceType = workplaceType;
    }

    const [jobs, total] = await Promise.all([
      JobModel.find(filter).sort({ postedAt: -1 }).skip(skip).limit(limitNum).lean(),
      JobModel.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch jobs: ${(err as Error).message}`,
    });
  }
});

/**
 * POST /api/v1/jobs/search-external
 * Enqueue an on-demand JSearch API fetch via the worker.
 */
jobsRouter.post('/search-external', async (req: Request, res: Response<IApiResponse>) => {
  try {
    // Validate input
    const parsed = searchExternalSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid request body',
        data: parsed.error.format(),
      });
      return;
    }

    const { query, location } = parsed.data;

    // Enqueue the job — the worker handles rate limiting
    const queue = getIngestionQueue();
    const job = await queue.add('manual-search', {
      source: 'jsearch',
      keywords: [query],
      location,
      timestamp: new Date().toISOString(),
    });

    res.status(202).json({
      success: true,
      message: 'Job search queued. Results will appear shortly.',
      data: { jobId: job.id },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Failed to enqueue search: ${(err as Error).message}`,
    });
  }
});

/**
 * GET /api/v1/jobs/api-usage
 * Check current JSearch API usage stats.
 */
jobsRouter.get('/api-usage', async (_req: Request, res: Response<IApiResponse>) => {
  try {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyLimit = Number(process.env.JSEARCH_MONTHLY_LIMIT) || 200;

    const usageRecords = await ApiUsageModel.find({
      source: 'jsearch',
      date: { $regex: `^${monthKey}` },
    });

    const used = usageRecords.reduce((sum, r) => sum + r.requestCount, 0);

    res.json({
      success: true,
      data: {
        month: monthKey,
        used,
        limit: monthlyLimit,
        remaining: Math.max(0, monthlyLimit - 10 - used),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch API usage: ${(err as Error).message}`,
    });
  }
});
