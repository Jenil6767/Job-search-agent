import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Attempt to load .env from root if not already loaded
dotenv.config();

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  WEB_PORT: z.coerce.number().default(3000),
  
  // Database
  MONGODB_URI: z.string().default('mongodb://localhost:27017/ai_jobpilot'),
  
  // Redis & BullMQ
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  
  // Worker
  WORKER_CONCURRENCY: z.coerce.number().default(5),
  
  // Security
  JWT_SECRET: z.string().default('super_secret_jwt_key_at_least_32_chars_long_production_quality'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // AI Provider
  AI_PROVIDER: z.enum(['mock', 'openai', 'anthropic']).default('mock'),
  OPENAI_API_KEY: z.string().optional().default(''),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  ANTHROPIC_API_KEY: z.string().optional().default(''),
  ANTHROPIC_MODEL: z.string().default('claude-3-5-sonnet-latest'),

  // JSearch (RapidAPI) — Job Ingestion
  RAPIDAPI_KEY: z.string().optional().default(''),
  JSEARCH_HOST: z.string().default('jsearch.p.rapidapi.com'),
  JSEARCH_MONTHLY_LIMIT: z.coerce.number().default(200),
  JSEARCH_DAILY_LIMIT: z.coerce.number().default(6),
});

export type EnvConfig = z.infer<typeof envSchema>;

let parsedEnv: EnvConfig;

export function getEnvConfig(): EnvConfig {
  if (!parsedEnv) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.error('❌ Invalid environment variables:', result.error.format());
      throw new Error('Invalid environment variables configuration');
    }
    parsedEnv = result.data;
  }
  return parsedEnv;
}
