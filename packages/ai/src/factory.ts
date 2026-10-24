import { AIProvider } from './provider.interface.js';
import { MockAIProvider } from './mock.provider.js';
import { OpenAIProvider } from './openai.provider.js';
import { AnthropicProvider } from './anthropic.provider.js';

export class AIProviderFactory {
  private static instance: AIProvider;

  public static getProvider(providerType?: string): AIProvider {
    const selected = (providerType || process.env.AI_PROVIDER || 'mock').toLowerCase();

    switch (selected) {
      case 'openai':
        return new OpenAIProvider();
      case 'anthropic':
        return new AnthropicProvider();
      case 'mock':
      default:
        return new MockAIProvider();
    }
  }

  public static getDefaultProvider(): AIProvider {
    if (!this.instance) {
      this.instance = this.getProvider();
    }
    return this.instance;
  }
}
