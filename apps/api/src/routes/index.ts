import { Router } from 'express';
import { healthRouter } from './health.route.js';
import { authRouter } from './auth.route.js';
import { profileRouter } from './profile.route.js';
import { jobsRouter } from './jobs.route.js';
import { workflowsRouter } from './workflows.route.js';
import { agentRouter } from './agent.route.js';

export const apiV1Router = Router();

apiV1Router.use('/health', healthRouter);
apiV1Router.use('/auth', authRouter);
apiV1Router.use('/profile', profileRouter);
apiV1Router.use('/jobs', jobsRouter);
apiV1Router.use('/workflows', workflowsRouter);
apiV1Router.use('/agent', agentRouter);
