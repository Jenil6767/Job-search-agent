export type QueueName =
  | 'job-ingestion'
  | 'job-analysis'
  | 'job-matching'
  | 'ai-tasks'
  | 'notifications'
  | 'workflow-execution';

export interface IBaseJobData {
  jobId?: string;
  userId?: string;
  timestamp: string;
  traceId?: string;
}

export interface IJobIngestionJobData extends IBaseJobData {
  source: string;
  keywords?: string[];
  location?: string;
}

export interface IJobMatchingJobData extends IBaseJobData {
  candidateProfileId: string;
  jobId: string;
}

export interface IWorkflowJobData extends IBaseJobData {
  workflowId: string;
  executionId: string;
  nodeId?: string;
}
