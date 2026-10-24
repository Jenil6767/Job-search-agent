import {
  IAgentMessage,
  IAgentToolDefinition,
  IAgentRunResult,
} from '@ai-jobpilot/types';
import { AIProvider, AIOptions, AgentLoopOptions } from './provider.interface.js';

export class OpenAIProvider implements AIProvider {
  readonly name = 'OpenAIProvider';
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = 'gpt-4o-mini') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.defaultModel = defaultModel;
  }

  async generateStructuredOutput<T>(
    prompt: string,
    schema: Record<string, unknown>,
    _options?: AIOptions
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('OpenAIProvider: OPENAI_API_KEY is not configured');
    }
    // Will be wired to openai client in Phase 4
    console.log(`[OpenAIProvider] Generating structured output with schema:`, Object.keys(schema));
    return {} as T;
  }

  async generateText(prompt: string, _options?: AIOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAIProvider: OPENAI_API_KEY is not configured');
    }
    return `OpenAI response for: ${prompt.slice(0, 30)}...`;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('OpenAIProvider: OPENAI_API_KEY is not configured');
    }
    return new Array(1536).fill(0.01);
  }

  async executeToolCallingLoop(
    _messages: IAgentMessage[],
    _tools: IAgentToolDefinition[],
    _options?: AgentLoopOptions
  ): Promise<IAgentRunResult> {
    if (!this.apiKey) {
      throw new Error('OpenAIProvider: OPENAI_API_KEY is not configured');
    }
    return {
      response: 'OpenAI Agent loop executed',
      toolExecutions: [],
      iterations: 1,
    };
  }
}
