import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAIProvider, GenerationOptions } from './base';

export class GeminiService extends BaseAIProvider {
  name = 'gemini';
  displayName = 'Google Gemini';
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    super();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found. Gemini features will be disabled.');
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  isAvailable(): boolean {
    return !!process.env.GEMINI_API_KEY && !!this.model;
  }

  async generateContent(prompt: string, options?: GenerationOptions): Promise<string> {
    if (!this.model) {
      return this.getFallbackContent(options?.type);
    }

    try {
      const systemPrompt = options?.type ? this.getSystemPrompt(options.type) : '';
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('خطأ في Gemini AI:', error);
      return this.getFallbackContent(options?.type);
    }
  }

  private getFallbackContent(type?: string): string {
    switch (type) {
      case 'executive_summary':
        return this.getMockExecutiveSummary({ name: 'مشروع نموذجي', description: 'وصف المشروع', industry: 'تقنية' });
      case 'market_analysis':
        return JSON.stringify(this.getMockMarketAnalysis({ name: 'مشروع نموذجي', industry: 'تقنية' }));
      case 'risk_assessment':
        return JSON.stringify(this.getMockRiskAssessment({ name: 'مشروع نموذجي', industry: 'تقنية' }));
      case 'recommendations':
        return JSON.stringify(this.getMockRecommendations({ projectName: 'مشروع نموذجي', financialViability: true, marketPotential: 'جيد', riskLevel: 'متوسط' }));
      default:
        return 'محتوى افتراضي من Gemini - يرجى التحقق من إعدادات API';
    }
  }

  async generateExecutiveSummary(projectData: {
    name: string;
    description: string;
    industry: string;
    targetMarket?: string;
    projectIdea?: string;
    objectives?: string;
  }): Promise<string> {
    if (!this.model) {
      return this.getMockExecutiveSummary(projectData);
    }

    const prompt = `
أنت خبير في إعداد دراسات الجدوى. اكتب ملخص تنفيذي شامل لمشروع باللغة العربية بناءً على البيانات التالية:

اسم المشروع: ${projectData.name}
الوصف: ${projectData.description}
الصناعة: ${projectData.industry}
السوق المستهدف: ${projectData.targetMarket || 'غير محدد'}
فكرة المشروع: ${projectData.projectIdea || 'غير محدد'}
الأهداف: ${projectData.objectives || 'غير محدد'}

يجب أن يتضمن الملخص التنفيذي:
1. نظرة عامة على المشروع
2. الأهداف الرئيسية
3. السوق المستهدف والفرص
4. المزايا التنافسية المتوقعة
5. ملخص النتائج المالية المتوقعة
6. التوصية النهائية

اكتب بطريقة مهنية ومقنعة، واستخدم اللغة العربية الفصحى.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('خطأ في Gemini AI:', error);
      return this.getMockExecutiveSummary(projectData);
    }
  }

  async generateMarketAnalysis(projectData: {
    name: string;
    industry: string;
    targetMarket?: string;
    location?: string;
  }): Promise<{
    marketSize: string;
    growthRate: string;
    keyTrends: string[];
    opportunities: string[];
    challenges: string[];
  }> {
    if (!this.model) {
      return this.getMockMarketAnalysis(projectData);
    }

    const prompt = `
أنت محلل سوق خبير. قم بإعداد تحليل سوق شامل لمشروع باللغة العربية:

اسم المشروع: ${projectData.name}
الصناعة: ${projectData.industry}
السوق المستهدف: ${projectData.targetMarket || 'غير محدد'}
الموقع: ${projectData.location || 'غير محدد'}

أريد منك تحليل مفصل يشمل:
1. حجم السوق المتوقع (بالأرقام إن أمكن)
2. معدل النمو السنوي
3. الاتجاهات الرئيسية في السوق (5 نقاط)
4. الفرص المتاحة (5 نقاط)
5. التحديات والعوائق (5 نقاط)

قدم الإجابة بتنسيق JSON باللغة العربية كما يلي:
{
  "marketSize": "حجم السوق",
  "growthRate": "معدل النمو",
  "keyTrends": ["اتجاه 1", "اتجاه 2", ...],
  "opportunities": ["فرصة 1", "فرصة 2", ...],
  "challenges": ["تحدي 1", "تحدي 2", ...]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // استخراج JSON من الاستجابة
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.getMockMarketAnalysis(projectData);
    } catch (error) {
      console.error('خطأ في Gemini AI:', error);
      return this.getMockMarketAnalysis(projectData);
    }
  }

  async generateRiskAssessment(projectData: {
    name: string;
    industry: string;
    initialInvestment?: number;
    projectType?: string;
  }): Promise<Array<{
    category: string;
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
    contingency: string;
  }>> {
    if (!this.model) {
      return this.getMockRiskAssessment(projectData);
    }

    const prompt = `
أنت خبير في إدارة المخاطر. قم بتحليل المخاطر المحتملة لمشروع:

اسم المشروع: ${projectData.name}
الصناعة: ${projectData.industry}
الاستثمار المبدئي: ${projectData.initialInvestment || 'غير محدد'}
نوع المشروع: ${projectData.projectType || 'غير محدد'}

أريد تحليل شامل للمخاطر يشمل:
1. المخاطر المالية
2. المخاطر التقنية
3. المخاطر التشغيلية
4. مخاطر السوق
5. المخاطر التنظيمية

لكل خطر، حدد:
- الفئة
- الوصف
- الاحتمالية (low/medium/high)
- التأثير (low/medium/high)
- استراتيجية التخفيف
- الخطة البديلة

قدم الإجابة بتنسيق JSON باللغة العربية.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // استخراج JSON من الاستجابة
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.getMockRiskAssessment(projectData);
    } catch (error) {
      console.error('خطأ في Gemini AI:', error);
      return this.getMockRiskAssessment(projectData);
    }
  }

  async generateRecommendations(studyData: {
    projectName: string;
    financialViability: boolean;
    marketPotential: string;
    riskLevel: string;
    roi?: number;
    paybackPeriod?: number;
  }): Promise<{
    overallRecommendation: 'proceed' | 'proceed_with_caution' | 'not_recommended';
    reasoning: string;
    keyRecommendations: string[];
    nextSteps: string[];
    conditions?: string[];
  }> {
    if (!this.model) {
      return this.getMockRecommendations(studyData);
    }

    const prompt = `
أنت استشاري أعمال خبير. قم بتقديم توصية نهائية بناءً على دراسة الجدوى:

اسم المشروع: ${studyData.projectName}
الجدوى المالية: ${studyData.financialViability ? 'مجدي' : 'غير مجدي'}
إمكانات السوق: ${studyData.marketPotential}
مستوى المخاطر: ${studyData.riskLevel}
العائد على الاستثمار: ${studyData.roi || 'غير محدد'}%
فترة الاسترداد: ${studyData.paybackPeriod || 'غير محدد'} سنة

قدم توصية شاملة تشمل:
1. التوصية العامة (proceed/proceed_with_caution/not_recommended)
2. التبرير المفصل
3. التوصيات الرئيسية (5-7 نقاط)
4. الخطوات التالية المقترحة (5 خطوات)
5. الشروط والاعتبارات إن وجدت

قدم الإجابة بتنسيق JSON باللغة العربية.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.getMockRecommendations(studyData);
    } catch (error) {
      console.error('خطأ في Gemini AI:', error);
      return this.getMockRecommendations(studyData);
    }
  }

  // Mock methods for development/fallback
  private getMockExecutiveSummary(projectData: any): string {
    return `
## الملخص التنفيذي لمشروع ${projectData.name}

### نظرة عامة
يهدف مشروع ${projectData.name} في قطاع ${projectData.industry} إلى تقديم حلول مبتكرة تلبي احتياجات السوق المتنامية. يتميز المشروع بموقعه الاستراتيجي وفهمه العميق لمتطلبات العملاء.

### الأهداف الرئيسية
- تحقيق حصة سوقية تنافسية في قطاع ${projectData.industry}
- تقديم خدمات عالية الجودة تلبي توقعات العملاء
- بناء علامة تجارية قوية ومعترف بها
- تحقيق الاستدامة المالية والتشغيلية

### السوق المستهدف والفرص
يستهدف المشروع ${projectData.targetMarket || 'قطاعات متنوعة من السوق'} مع التركيز على الجودة والابتكار. تشير الدراسات إلى نمو مستمر في هذا القطاع.

### المزايا التنافسية
- الخبرة والكفاءة في المجال
- التقنيات المتطورة
- فريق عمل مؤهل ومتخصص
- نموذج عمل مرن وقابل للتطوير

### التوقعات المالية
تشير التحليلات الأولية إلى إمكانية تحقيق عوائد مجزية خلال السنوات الأولى من التشغيل، مع تحسن مستمر في الأداء المالي.

### التوصية النهائية
بناءً على التحليل الشامل، نوصي بالمضي قدماً في تنفيذ المشروع مع مراعاة خطة إدارة المخاطر المقترحة.
`;
  }

  private getMockMarketAnalysis(projectData: any): any {
    return {
      marketSize: `${Math.floor(Math.random() * 900 + 100)} مليون ريال سعودي`,
      growthRate: `${Math.floor(Math.random() * 15 + 5)}% سنوياً`,
      keyTrends: [
        'تزايد الطلب على الحلول الرقمية',
        'نمو الاستثمار في القطاعات الناشئة',
        'التوجه نحو الاستدامة البيئية',
        'زيادة الاعتماد على التقنيات المتطورة',
        'تطور سلوك المستهلكين وتفضيلاتهم'
      ],
      opportunities: [
        'دخول أسواق جديدة غير مستغلة',
        'تطوير شراكات استراتيجية',
        'الاستفادة من برامج الدعم الحكومية',
        'تطبيق تقنيات الذكاء الاصطناعي',
        'التوسع في الأسواق الإقليمية'
      ],
      challenges: [
        'المنافسة الشديدة من الشركات الكبيرة',
        'تقلبات الأسعار في السوق',
        'صعوبة الحصول على التمويل',
        'التحديات التنظيمية والقانونية',
        'نقص في الكوادر المتخصصة'
      ]
    };
  }

  private getMockRiskAssessment(projectData: any): any {
    return [
      {
        category: 'مالية',
        description: 'تأخير في الحصول على التمويل المطلوب',
        probability: 'medium' as const,
        impact: 'high' as const,
        mitigation: 'تنويع مصادر التمويل والتخطيط المسبق',
        contingency: 'خطة تمويل بديلة من مصادر متعددة'
      },
      {
        category: 'تقنية',
        description: 'مشاكل في تطبيق التقنيات المطلوبة',
        probability: 'low' as const,
        impact: 'medium' as const,
        mitigation: 'التدريب المكثف واختيار تقنيات مجربة',
        contingency: 'فريق دعم تقني متخصص'
      },
      {
        category: 'تشغيلية',
        description: 'صعوبة في إيجاد الكوادر المناسبة',
        probability: 'medium' as const,
        impact: 'medium' as const,
        mitigation: 'برامج التدريب والتطوير المستمر',
        contingency: 'التعاقد مع شركات استشارية متخصصة'
      },
      {
        category: 'السوق',
        description: 'تغيير في طلب السوق أو تفضيلات العملاء',
        probability: 'medium' as const,
        impact: 'high' as const,
        mitigation: 'دراسة مستمرة للسوق ومرونة في التكيف',
        contingency: 'تطوير منتجات وخدمات بديلة'
      }
    ];
  }

  private getMockRecommendations(studyData: any): any {
    const isViable = studyData.financialViability && studyData.marketPotential !== 'ضعيف';
    const hasHighRisk = studyData.riskLevel === 'عالي';

    return {
      overallRecommendation: isViable ? (hasHighRisk ? 'proceed_with_caution' : 'proceed') : 'not_recommended',
      reasoning: `بناءً على التحليل الشامل لمشروع ${studyData.projectName}، والذي يشمل الدراسة المالية والسوقية وتقييم المخاطر، ${
        isViable 
          ? `نجد أن المشروع يحمل إمكانيات نجاح جيدة ${hasHighRisk ? 'مع ضرورة أخذ الحيطة والحذر من المخاطر المحددة' : 'مع مؤشرات إيجابية قوية'}.`
          : 'نجد أن المشروع يواجه تحديات كبيرة قد تعيق نجاحه في الظروف الحالية.'
      }`,
      keyRecommendations: isViable ? [
        'وضع خطة عمل تفصيلية مرحلية',
        'تأمين التمويل اللازم من مصادر متنوعة',
        'بناء فريق عمل متخصص وكفء',
        'تطوير استراتيجية تسويقية شاملة',
        'وضع نظام مراقبة الأداء والجودة',
        'إنشاء خطة شاملة لإدارة المخاطر',
        'التحديث المستمر للدراسات والتقييمات'
      ] : [
        'إعادة النظر في نموذج العمل المقترح',
        'تقليل التكاليف والاستثمار المبدئي',
        'البحث عن شراكات استراتيجية',
        'تأجيل المشروع حتى تحسن ظروف السوق',
        'دراسة بدائل وأسواق أخرى'
      ],
      nextSteps: isViable ? [
        'إعداد خطة العمل التفصيلية',
        'بدء إجراءات الحصول على التراخيص',
        'تأمين مصادر التمويل المطلوبة',
        'تشكيل فريق الإدارة والتشغيل',
        'البدء في المراحل الأولى للتنفيذ'
      ] : [
        'مراجعة شاملة لنموذج العمل',
        'دراسة خيارات التطوير والتحسين',
        'البحث عن فرص استثمارية بديلة',
        'إعادة تقييم السوق والظروف',
        'استشارة خبراء إضافيين في المجال'
      ],
      conditions: hasHighRisk ? [
        'وضع خطة شاملة لإدارة المخاطر العالية',
        'تأمين احتياطي مالي إضافي 20% من التكلفة',
        'المراقبة الدورية للمؤشرات الرئيسية',
        'وضع خطط بديلة لكل سيناريو محتمل'
      ] : undefined
    };
  }
}

export const geminiService = new GeminiService();
