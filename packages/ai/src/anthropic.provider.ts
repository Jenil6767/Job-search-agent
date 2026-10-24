import {
  IAgentMessage,
  IAgentToolDefinition,
  IAgentRunResult,
} from '@ai-jobpilot/types';
import { AIProvider, AIOptions, AgentLoopOptions } from './provider.interface.js';

export class AnthropicProvider implements AIProvider {
  readonly name = 'AnthropicProvider';
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = 'claude-3-5-sonnet-latest') {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.defaultModel = defaultModel;
  }

  async generateStructuredOutput<T>(
    prompt: string,
    schema: Record<string, unknown>,
    _options?: AIOptions
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('AnthropicProvider: ANTHROPIC_API_KEY is not configured');
    }
    console.log(`[AnthropicProvider] Generating structured output with schema:`, Object.keys(schema));
    return {} as T;
  }

  async generateText(prompt: string, _options?: AIOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('AnthropicProvider: ANTHROPIC_API_KEY is not configured');
    }
    return `Anthropic response for: ${prompt.slice(0, 30)}...`;
  }

  async generateEmbedding(_text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('AnthropicProvider: ANTHROPIC_API_KEY is not configured');
    }
    return new Array(1536).fill(0.01);
  }

  async executeToolCallingLoop(
    _messages: IAgentMessage[],
    _tools: IAgentToolDefinition[],
    _options?: AgentLoopOptions
  ): Promise<IAgentRunResult> {
    if (!this.apiKey) {
      throw new Error('AnthropicProvider: ANTHROPIC_API_KEY is not configured');
    }
    return {
      response: 'Anthropic Agent loop executed',
      toolExecutions: [],
      iterations: 1,
    };
  }
}
