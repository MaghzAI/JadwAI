export interface AIProvider {
  name: string;
  displayName: string;
  generateContent(prompt: string, options?: GenerationOptions): Promise<string>;
  isAvailable(): boolean;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  type?: 'executive_summary' | 'market_analysis' | 'risk_assessment' | 'recommendations';
}

export abstract class BaseAIProvider implements AIProvider {
  abstract name: string;
  abstract displayName: string;

  abstract generateContent(prompt: string, options?: GenerationOptions): Promise<string>;
  
  abstract isAvailable(): boolean;

  protected getSystemPrompt(type: string): string {
    const prompts = {
      executive_summary: `أنت خبير في إعداد دراسات الجدوى وتخصص في كتابة الملخصات التنفيذية الاحترافية. 
اكتب باللغة العربية بأسلوب احترافي ومقنع. ركز على الأهداف والفرص والقيمة المضافة للمشروع.`,
      
      market_analysis: `أنت محلل سوق محترف متخصص في دراسة الأسواق والمنافسة. 
قم بتحليل السوق المستهدف وحدد الفرص والتحديات والاتجاهات الرئيسية باللغة العربية.`,
      
      risk_assessment: `أنت خبير في تقييم المخاطر التجارية والمالية. 
حدد وقيم المخاطر المحتملة واقترح استراتيجيات للتخفيف منها باللغة العربية.`,
      
      recommendations: `أنت مستشار تجاري محترف. 
قدم توصيات عملية وقابلة للتنفيذ بناءً على تحليل دراسة الجدوى باللغة العربية.`
    };

    return prompts[type as keyof typeof prompts] || prompts.executive_summary;
  }

  protected formatPrompt(userPrompt: string, type?: string): string {
    const systemPrompt = type ? this.getSystemPrompt(type) : '';
    return `${systemPrompt}\n\n${userPrompt}`;
  }
}
