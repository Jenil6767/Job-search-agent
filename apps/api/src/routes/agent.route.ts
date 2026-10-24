import { Router, Request, Response } from 'express';
import { IApiResponse } from '@ai-jobpilot/types';

export const agentRouter = Router();

agentRouter.post('/chat', async (_req: Request, res: Response<IApiResponse>) => {
  res.json({
    success: true,
    message: 'AI Agent chat endpoint ready for Phase 5 implementation',
  });
});
