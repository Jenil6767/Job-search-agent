import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { IApiResponse } from '@ai-jobpilot/types';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<IApiResponse>,
  _next: NextFunction
): void {
  const requestId = req.headers['x-request-id'] as string;

  // Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details: err.errors,
      },
    });
    return;
  }

  // Handle Custom Operational Application Errors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, requestId }, `[AppError] Server error: ${err.message}`);
    } else {
      logger.warn({ statusCode: err.statusCode, requestId }, `[AppError] Client error: ${err.message}`);
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.constructor.name,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Handle Unexpected Uncaught Exceptions
  logger.error({ err, requestId }, `[UnhandledError] Internal server error: ${err.message}`);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    },
  });
}
