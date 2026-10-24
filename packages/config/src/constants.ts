export const QUEUE_NAMES = {
  JOB_INGESTION: 'job-ingestion',
  JOB_ANALYSIS: 'job-analysis',
  JOB_MATCHING: 'job-matching',
  AI_TASKS: 'ai-tasks',
  NOTIFICATIONS: 'notifications',
  WORKFLOW_EXECUTION: 'workflow-execution',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const APPLICATION_STATUSES = {
  DISCOVERED: 'discovered',
  SHORTLISTED: 'shortlisted',
  APPLIED: 'applied',
  ASSESSMENT: 'assessment',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

export const MATCH_WEIGHTS = {
  SKILLS: 0.35,
  EXPERIENCE: 0.25,
  ROLE: 0.15,
  LOCATION: 0.1,
  SEMANTIC: 0.15,
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
