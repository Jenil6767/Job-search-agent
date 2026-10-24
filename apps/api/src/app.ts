import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger.js';
import { requestIdMiddleware } from './middleware/request-id.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiV1Router } from './routes/index.js';
import { NotFoundError } from './utils/errors.js';

export function createApp(): Express {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  );

  // Core Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Tracing & Logging
  app.use(requestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => req.url === '/api/v1/health' || req.url === '/favicon.ico',
      },
      customProps: (req) => ({
        requestId: req.headers['x-request-id'],
      }),
    })
  );

  // Base API Route
  app.use('/api/v1', apiV1Router);

  // 404 Fallback
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
