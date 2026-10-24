export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface IToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface IAgentMessage {
  role: MessageRole;
  content: string;
  name?: string;
  toolCallId?: string;
  toolCalls?: IToolCall[];
  timestamp?: string | Date;
}

export interface IAgentToolParameter {
  type: string;
  description?: string;
  enum?: string[];
  items?: Record<string, unknown>;
  properties?: Record<string, unknown>;
  required?: string[];
}

export interface IAgentToolDefinition {
  name: string;
  description: string;
  permission: string;
  requiresApproval?: boolean;
  parameters: {
    type: 'object';
    properties: Record<string, IAgentToolParameter>;
    required?: string[];
  };
}

export interface IToolExecution {
  id: string;
  toolName: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  status: 'pending' | 'requires_approval' | 'approved' | 'rejected' | 'completed' | 'failed';
  error?: string;
  executedAt?: string | Date;
}

export interface IAgentRunResult {
  response: string;
  toolExecutions: IToolExecution[];
  iterations: number;
  tokensUsed?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
