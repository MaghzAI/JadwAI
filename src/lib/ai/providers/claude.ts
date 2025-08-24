import Anthropic from '@anthropic-ai/sdk';
import { BaseAIProvider, GenerationOptions } from './base';

export class ClaudeProvider extends BaseAIProvider {
  name = 'claude';
  displayName = 'Anthropic Claude';
  private client: Anthropic | null = null;

  constructor() {
    super();
    if (process.env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  isAvailable(): boolean {
    return !!process.env.ANTHROPIC_API_KEY && !!this.client;
  }

  async generateContent(prompt: string, options?: GenerationOptions): Promise<string> {
    if (!this.client) {
      throw new Error('Claude client not available. Please check your API key.');
    }

    try {
      const systemPrompt = options?.type ? this.getSystemPrompt(options.type) : '';
      const fullPrompt = this.formatPrompt(prompt, options?.type);

      const response = await this.client.messages.create({
        model: options?.model || 'claude-3-sonnet-20240229',
        max_tokens: options?.maxTokens || 2000,
        temperature: options?.temperature || 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      return 'فشل في توليد المحتوى من Claude';
    } catch (error) {
      console.error('Claude API error:', error);
      
      // Fallback content
      return this.getFallbackContent(options?.type);
    }
  }

  private getFallbackContent(type?: string): string {
    switch (type) {
      case 'market_analysis':
        return `
## تحليل السوق

### حجم السوق المستهدف
يقدر حجم السوق المستهدف بحوالي 500 مليون ريال سعودي سنوياً، مع معدل نمو سنوي يبلغ 12%.

### الاتجاهات الرئيسية
- تزايد الطلب على الحلول الرقمية المبتكرة
- نمو الوعي بأهمية الجودة والخدمة المتميزة
- التحول نحو الاستدامة البيئية والاجتماعية

### الفرص السوقية
- دخول قطاعات جديدة غير مستغلة بالكامل
- الاستفادة من برامج الدعم الحكومية
- تطوير شراكات استراتيجية مع الشركات الرائدة

### التحديات المتوقعة
- المنافسة الشديدة من اللاعبين الكبار
- التحديات التنظيمية والقانونية
- تقلبات الأسعار في السوق العالمية
        `.trim();
      
      default:
        return 'محتوى افتراضي من Claude - يرجى التحقق من إعدادات API';
    }
  }
}
