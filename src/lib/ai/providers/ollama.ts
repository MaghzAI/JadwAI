import { BaseAIProvider, GenerationOptions } from './base';

export class OllamaProvider extends BaseAIProvider {
  name = 'ollama';
  displayName = 'Ollama (Local Models)';
  private baseUrl: string;

  constructor() {
    super();
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  }

  isAvailable(): boolean {
    return !!process.env.OLLAMA_BASE_URL;
  }

  async generateContent(prompt: string, options?: GenerationOptions): Promise<string> {
    try {
      // Check if Ollama server is running
      const healthCheck = await fetch(`${this.baseUrl}/api/tags`);
      if (!healthCheck.ok) {
        throw new Error('Ollama server not available');
      }

      const systemPrompt = options?.type ? this.getSystemPrompt(options.type) : '';
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options?.model || process.env.OLLAMA_MODEL || 'llama2',
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: options?.temperature || 0.7,
            num_predict: options?.maxTokens || 2000,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || 'فشل في توليد المحتوى من Ollama';
    } catch (error) {
      console.error('Ollama API error:', error);
      return this.getFallbackContent(options?.type);
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error('Failed to fetch Ollama models:', error);
      return [];
    }
  }

  async isServerRunning(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private getFallbackContent(type?: string): string {
    switch (type) {
      case 'recommendations':
        return `
## التوصيات والخطة التنفيذية

### التوصية العامة
بناءً على التحليل الشامل لدراسة الجدوى، نوصي بالمضي قدماً في تنفيذ المشروع مع اتخاذ الاحتياطات اللازمة.

### التوصيات الرئيسية
1. **التمويل**: تأمين التمويل من مصادر متنوعة لتقليل المخاطر
2. **الفريق**: بناء فريق عمل متخصص ومتنوع الخبرات
3. **التسويق**: وضع استراتيجية تسويقية شاملة قبل الإطلاق
4. **التقنية**: اختيار تقنيات مجربة وقابلة للتطوير
5. **المراقبة**: إنشاء نظام مراقبة الأداء والمؤشرات

### الخطوات التالية
1. **المرحلة الأولى (1-3 أشهر)**:
   - إعداد خطة العمل التفصيلية
   - الحصول على التراخيص والموافقات
   - تأمين التمويل الأولي

2. **المرحلة الثانية (3-6 أشهر)**:
   - تشكيل الفريق الأساسي
   - بدء العمليات التشغيلية الأولية
   - تطوير المنتج أو الخدمة

3. **المرحلة الثالثة (6-12 شهر)**:
   - الإطلاق التجريبي المحدود
   - جمع الملاحظات والتحسين
   - التوسع التدريجي في السوق

### مؤشرات النجاح
- تحقيق التدفق النقدي الإيجابي خلال 18 شهر
- الوصول إلى 5% من الحصة السوقية المستهدفة
- تحقيق رضا العملاء بنسبة تزيد عن 85%
        `.trim();
      
      default:
        return 'محتوى افتراضي من Ollama - يرجى التأكد من تشغيل خادم Ollama المحلي';
    }
  }
}
