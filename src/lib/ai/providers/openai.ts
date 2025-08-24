import { OpenAI } from 'openai';
import { BaseAIProvider, GenerationOptions } from './base';

export class OpenAIProvider extends BaseAIProvider {
  name = 'openai';
  displayName = 'OpenAI GPT-4';
  private client: OpenAI | null = null;

  constructor() {
    super();
    if (process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  isAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY && !!this.client;
  }

  async generateContent(prompt: string, options?: GenerationOptions): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not available. Please check your API key.');
    }

    try {
      const systemPrompt = options?.type ? this.getSystemPrompt(options.type) : '';
      const fullPrompt = this.formatPrompt(prompt, options?.type);

      const response = await this.client.chat.completions.create({
        model: options?.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000,
      });

      return response.choices[0]?.message?.content || 'فشل في توليد المحتوى من OpenAI';
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Fallback content
      return this.getFallbackContent(options?.type);
    }
  }

  private getFallbackContent(type?: string): string {
    switch (type) {
      case 'executive_summary':
        return `
## الملخص التنفيذي

### نظرة عامة على المشروع
يهدف هذا المشروع إلى تقديم حلول مبتكرة تلبي احتياجات السوق المتنامية وتحقق قيمة مضافة حقيقية للعملاء.

### الأهداف الاستراتيجية
- تحقيق حصة سوقية تنافسية خلال السنوات الثلاث الأولى
- بناء علامة تجارية قوية ومعترف بها محلياً وإقليمياً
- تحقيق الاستدامة المالية والربحية على المدى الطويل

### الفرص السوقية
تشير الدراسات الأولية إلى وجود فرص واعدة في السوق يمكن استغلالها من خلال تقديم منتجات وخدمات متميزة.

### التوقعات المالية
تظهر التوقعات المالية إمكانية تحقيق عائد استثمار إيجابي خلال السنة الثانية مع نمو مستمر في الإيرادات.
        `.trim();
      
      default:
        return 'محتوى افتراضي من OpenAI - يرجى التحقق من إعدادات API';
    }
  }
}
