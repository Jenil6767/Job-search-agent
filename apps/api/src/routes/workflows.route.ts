import { Router, Request, Response } from 'express';
import { IApiResponse } from '@ai-jobpilot/types';

export const workflowsRouter = Router();

workflowsRouter.get('/', async (_req: Request, res: Response<IApiResponse>) => {
  res.json({
    success: true,
    message: 'Workflows endpoint ready for Phase 7 implementation',
    data: [],
  });
});
