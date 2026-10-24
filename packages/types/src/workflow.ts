export type WorkflowTriggerType = 'schedule' | 'manual' | 'webhook' | 'new_job_detected';

export type WorkflowNodeType =
  | 'trigger_schedule'
  | 'trigger_manual'
  | 'action_search_jobs'
  | 'action_filter_duplicates'
  | 'action_analyze_job'
  | 'action_match_resume'
  | 'action_save_job'
  | 'action_generate_cover_letter'
  | 'action_send_notification'
  | 'action_update_application'
  | 'action_ai_agent'
  | 'logic_condition'
  | 'logic_filter'
  | 'logic_delay';

export interface IWorkflowSchedule {
  cronExpression?: string;
  timezone?: string;
  enabled: boolean;
}

export interface IWorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

export interface IWorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface IWorkflow {
  id: string;
  userId: string;
  name: string;
  description?: string;
  triggerType: WorkflowTriggerType;
  schedule?: IWorkflowSchedule;
  nodes: IWorkflowNode[];
  edges: IWorkflowEdge[];
  isEnabled: boolean;
  lastRunAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface IWorkflowExecutionStep {
  nodeId: string;
  nodeType: WorkflowNodeType;
  status: ExecutionStatus;
  startedAt: string | Date;
  completedAt?: string | Date;
  input?: unknown;
  output?: unknown;
  error?: string;
  retryCount: number;
}

export interface IWorkflowExecution {
  id: string;
  workflowId: string;
  userId: string;
  triggerSource: string;
  status: ExecutionStatus;
  startedAt: string | Date;
  completedAt?: string | Date;
  steps: IWorkflowExecutionStep[];
  error?: string;
}
