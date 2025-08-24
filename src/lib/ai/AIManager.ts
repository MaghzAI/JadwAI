import { AIProvider, GenerationOptions } from './providers/base';
import { GeminiService } from './providers/gemini';
import { OpenAIProvider } from './providers/openai';
import { ClaudeProvider } from './providers/claude';
import { OpenRouterProvider } from './providers/openrouter';
import { OllamaProvider } from './providers/ollama';

export type AIProviderType = 'gemini' | 'openai' | 'claude' | 'openrouter' | 'ollama';

export class AIManager {
  private providers: Map<AIProviderType, AIProvider> = new Map();
  private defaultProvider: AIProviderType;

  constructor() {
    // Initialize all providers
    this.providers.set('gemini', new GeminiService());
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('claude', new ClaudeProvider());
    this.providers.set('openrouter', new OpenRouterProvider());
    this.providers.set('ollama', new OllamaProvider());

    // Set default provider from environment or fallback to gemini
    this.defaultProvider = (process.env.DEFAULT_AI_PROVIDER as AIProviderType) || 'gemini';
  }

  async generateContent(
    prompt: string, 
    options?: GenerationOptions & { provider?: AIProviderType }
  ): Promise<{ content: string; provider: AIProviderType; success: boolean }> {
    const providerType = options?.provider || this.defaultProvider;
    const provider = this.providers.get(providerType);

    if (!provider || !provider.isAvailable()) {
      // Fallback to first available provider
      const availableProvider = this.getFirstAvailableProvider();
      if (!availableProvider) {
        throw new Error('لا توجد مقدمات AI متاحة. يرجى التحقق من إعدادات API.');
      }

      try {
        const content = await availableProvider.provider.generateContent(prompt, options);
        return { 
          content, 
          provider: availableProvider.type, 
          success: true 
        };
      } catch (error) {
        return { 
          content: 'فشل في توليد المحتوى من جميع مقدمات AI المتاحة', 
          provider: availableProvider.type, 
          success: false 
        };
      }
    }

    try {
      const content = await provider.generateContent(prompt, options);
      return { content, provider: providerType, success: true };
    } catch (error) {
      console.error(`Error with ${providerType}:`, error);
      
      // Try fallback provider
      const fallbackProvider = this.getFirstAvailableProvider(providerType);
      if (fallbackProvider) {
        try {
          const content = await fallbackProvider.provider.generateContent(prompt, options);
          return { 
            content, 
            provider: fallbackProvider.type, 
            success: true 
          };
        } catch (fallbackError) {
          console.error('Fallback provider also failed:', fallbackError);
        }
      }

      return { 
        content: 'فشل في توليد المحتوى. يرجى المحاولة مرة أخرى.', 
        provider: providerType, 
        success: false 
      };
    }
  }

  getAvailableProviders(): Array<{ type: AIProviderType; name: string; displayName: string; available: boolean }> {
    return Array.from(this.providers.entries()).map(([type, provider]) => ({
      type,
      name: provider.name,
      displayName: provider.displayName,
      available: provider.isAvailable()
    }));
  }

  private getFirstAvailableProvider(exclude?: AIProviderType): { type: AIProviderType; provider: AIProvider } | null {
    for (const [type, provider] of this.providers.entries()) {
      if (type !== exclude && provider.isAvailable()) {
        return { type, provider };
      }
    }
    return null;
  }

  setDefaultProvider(provider: AIProviderType): void {
    if (this.providers.has(provider)) {
      this.defaultProvider = provider;
    }
  }

  getDefaultProvider(): AIProviderType {
    return this.defaultProvider;
  }

  async testProvider(provider: AIProviderType): Promise<boolean> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance || !providerInstance.isAvailable()) {
      return false;
    }

    try {
      const result = await providerInstance.generateContent('اختبار', { 
        maxTokens: 50,
        temperature: 0.5
      });
      return result.length > 0;
    } catch (error) {
      return false;
    }
  }

  async getProviderModels(provider: AIProviderType): Promise<string[]> {
    const providerInstance = this.providers.get(provider);
    
    if (provider === 'openrouter' && providerInstance instanceof OpenRouterProvider) {
      return await providerInstance.getAvailableModels();
    }
    
    if (provider === 'ollama' && providerInstance instanceof OllamaProvider) {
      return await providerInstance.getAvailableModels();
    }

    // Default models for other providers
    const defaultModels: Record<AIProviderType, string[]> = {
      'gemini': ['gemini-pro', 'gemini-pro-vision'],
      'openai': ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      'claude': ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
      'openrouter': [],
      'ollama': []
    };

    return defaultModels[provider] || [];
  }
}

// Global instance
export const aiManager = new AIManager();
