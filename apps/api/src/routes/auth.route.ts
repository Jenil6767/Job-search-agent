import { Router, Request, Response } from 'express';
import { IApiResponse } from '@ai-jobpilot/types';

export const authRouter = Router();

authRouter.post('/register', async (_req: Request, res: Response<IApiResponse>) => {
  res.status(501).json({
    success: false,
    message: 'Auth registration endpoint will be fully implemented in Phase 2',
  });
});

authRouter.post('/login', async (_req: Request, res: Response<IApiResponse>) => {
  res.status(501).json({
    success: false,
    message: 'Auth login endpoint will be fully implemented in Phase 2',
  });
});
