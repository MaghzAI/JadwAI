import { BaseAIProvider, GenerationOptions } from './base';

export class OpenRouterProvider extends BaseAIProvider {
  name = 'openrouter';
  displayName = 'OpenRouter (Multiple Models)';
  private baseUrl = 'https://openrouter.ai/api/v1';

  isAvailable(): boolean {
    return !!process.env.OPENROUTER_API_KEY;
  }

  async generateContent(prompt: string, options?: GenerationOptions): Promise<string> {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not available.');
    }

    try {
      const systemPrompt = options?.type ? this.getSystemPrompt(options.type) : '';
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'Feasibility Study Platform',
        },
        body: JSON.stringify({
          model: options?.model || 'openai/gpt-3.5-turbo',
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
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'فشل في توليد المحتوى من OpenRouter';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      return this.getFallbackContent(options?.type);
    }
  }

  async getAvailableModels(): Promise<string[]> {
    if (!process.env.OPENROUTER_API_KEY) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        }
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data?.map((model: any) => model.id) || [];
    } catch (error) {
      console.error('Failed to fetch OpenRouter models:', error);
      return [];
    }
  }

  private getFallbackContent(type?: string): string {
    switch (type) {
      case 'risk_assessment':
        return `
## تقييم المخاطر

### المخاطر المالية
- **احتمالية**: متوسطة | **التأثير**: عالي
- **الوصف**: تأخير في الحصول على التمويل المطلوب
- **استراتيجية التخفيف**: تنويع مصادر التمويل وإعداد خطط بديلة

### المخاطر السوقية  
- **احتمالية**: منخفضة | **التأثير**: متوسط
- **الوصف**: تغيير مفاجئ في احتياجات السوق
- **استراتيجية التخفيف**: مراقبة مستمرة للسوق والمرونة في التكيف

### المخاطر التقنية
- **احتمالية**: منخفضة | **التأثير**: متوسط  
- **الوصف**: مشاكل في التقنيات المستخدمة
- **استراتيجية التخفيف**: اختيار تقنيات مجربة وفريق تقني مؤهل

### التوصيات العامة
- وضع خطة شاملة لإدارة المخاطر
- مراجعة دورية لتقييم المخاطر الجديدة
- تطوير خطط طوارئ للمخاطر عالية التأثير
        `.trim();
      
      default:
        return 'محتوى افتراضي من OpenRouter - يرجى التحقق من إعدادات API';
    }
  }
}
