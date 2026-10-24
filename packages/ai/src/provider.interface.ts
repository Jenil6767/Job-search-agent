import { IAgentMessage, IAgentToolDefinition, IAgentRunResult } from '@ai-jobpilot/types';

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AgentLoopOptions extends AIOptions {
  maxIterations?: number;
  toolExecutor?: (toolName: string, args: Record<string, unknown>) => Promise<unknown>;
}

export interface AIProvider {
  readonly name: string;
  generateStructuredOutput<T>(
    prompt: string,
    schema: Record<string, unknown>,
    options?: AIOptions
  ): Promise<T>;
  generateText(prompt: string, options?: AIOptions): Promise<string>;
  generateEmbedding(text: string): Promise<number[]>;
  executeToolCallingLoop(
    messages: IAgentMessage[],
    tools: IAgentToolDefinition[],
    options?: AgentLoopOptions
  ): Promise<IAgentRunResult>;
}
