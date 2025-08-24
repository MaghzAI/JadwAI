'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  RefreshCw,
  FileText,
  TrendingUp,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface ContentGeneratorProps {
  type: 'executive_summary' | 'market_analysis' | 'risk_assessment' | 'recommendations';
  projectData?: any;
  onContentGenerated?: (content: any) => void;
  className?: string;
}

export function ContentGenerator({ type, projectData, onContentGenerated, className }: ContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  const getTypeInfo = () => {
    switch (type) {
      case 'executive_summary':
        return {
          title: 'مولد الملخص التنفيذي',
          description: 'إنشاء ملخص تنفيذي شامل ومقنع لمشروعك',
          icon: FileText,
          color: 'bg-blue-500'
        };
      case 'market_analysis':
        return {
          title: 'مولد تحليل السوق',
          description: 'تحليل مفصل للسوق والفرص والتحديات',
          icon: TrendingUp,
          color: 'bg-green-500'
        };
      case 'risk_assessment':
        return {
          title: 'مولد تقييم المخاطر',
          description: 'تحديد وتقييم المخاطر مع استراتيجيات التخفيف',
          icon: AlertTriangle,
          color: 'bg-orange-500'
        };
      case 'recommendations':
        return {
          title: 'مولد التوصيات',
          description: 'توصيات شاملة بناءً على تحليل الدراسة',
          icon: Lightbulb,
          color: 'bg-purple-500'
        };
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          data: projectData || {}
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setGeneratedContent(result.data);
        if (onContentGenerated) {
          onContentGenerated(result.data);
        }
      } else {
        throw new Error(result.error || 'فشل في توليد المحتوى');
      }
    } catch (error) {
      console.error('خطأ في توليد المحتوى:', error);
      // في حالة الخطأ، نستخدم محتوى تجريبي
      const mockContent = getMockContent();
      setGeneratedContent(mockContent);
      if (onContentGenerated) {
        onContentGenerated(mockContent);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedContent) return;
    
    let textToCopy = '';
    
    if (typeof generatedContent === 'string') {
      textToCopy = generatedContent;
    } else if (typeof generatedContent === 'object') {
      textToCopy = JSON.stringify(generatedContent, null, 2);
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('فشل في نسخ المحتوى:', error);
    }
  };

  const getMockContent = () => {
    switch (type) {
      case 'executive_summary':
        return `
## الملخص التنفيذي

### نظرة عامة على المشروع
يهدف هذا المشروع إلى تقديم حلول مبتكرة في السوق المحلي، مع التركيز على تلبية احتياجات العملاء وتحقيق النمو المستدام.

### الأهداف الاستراتيجية
- تحقيق حصة سوقية تنافسية خلال السنوات الثلاث الأولى
- بناء علامة تجارية قوية ومعترف بها
- تحقيق الربحية والاستدامة المالية
- توظيف الكوادر المحلية المؤهلة

### الفرص السوقية
تشير الدراسات إلى وجود فجوة في السوق يمكن استغلالها من خلال تقديم منتجات وخدمات عالية الجودة بأسعار تنافسية.

### التوقعات المالية
تُظهر التوقعات المالية الأولية إمكانية تحقيق عائد استثمار إيجابي خلال السنة الثانية من التشغيل، مع نمو مستمر في الإيرادات.

### التوصية
بناءً على التحليل الشامل، نوصي بالمضي قدماً في تنفيذ المشروع مع مراعاة استراتيجيات إدارة المخاطر المحددة.
        `;
      case 'market_analysis':
        return {
          marketSize: '500 مليون ريال سعودي',
          growthRate: '12% سنوياً',
          keyTrends: [
            'تزايد الطلب على الحلول الرقمية',
            'نمو الاستثمار في التقنيات الناشئة',
            'التحول نحو الاستدامة البيئية',
            'زيادة الوعي بأهمية الجودة',
            'تطور أنماط الاستهلاك'
          ],
          opportunities: [
            'دخول قطاعات جديدة غير مستغلة',
            'تطوير شراكات استراتيجية مع الشركات الكبرى',
            'الاستفادة من برامج الدعم الحكومية',
            'التوسع في الأسواق الإقليمية',
            'تطبيق تقنيات الذكاء الاصطناعي'
          ],
          challenges: [
            'المنافسة الشديدة من اللاعبين الكبار',
            'تقلبات أسعار المواد الخام',
            'التحديات التنظيمية والقانونية',
            'صعوبة الحصول على التمويل',
            'نقص في الكوادر المتخصصة'
          ]
        };
      case 'risk_assessment':
        return [
          {
            category: 'مالية',
            description: 'تأخير في الحصول على التمويل اللازم',
            probability: 'medium',
            impact: 'high',
            mitigation: 'تنويع مصادر التمويل والتخطيط المبكر',
            contingency: 'خطة تمويل بديلة من مؤسسات متعددة'
          },
          {
            category: 'السوق',
            description: 'تغيير مفاجئ في طلب السوق',
            probability: 'medium',
            impact: 'medium',
            mitigation: 'مراقبة مستمرة للسوق والمرونة في التكيف',
            contingency: 'تطوير منتجات بديلة متنوعة'
          },
          {
            category: 'تقنية',
            description: 'مشاكل في التقنيات المستخدمة',
            probability: 'low',
            impact: 'medium',
            mitigation: 'اختيار تقنيات مجربة وفريق تقني مؤهل',
            contingency: 'خطة دعم تقني شاملة'
          }
        ];
      case 'recommendations':
        return {
          overallRecommendation: 'proceed_with_caution',
          reasoning: 'المشروع يحمل إمكانيات نجاح جيدة مع ضرورة أخذ الحيطة والحذر',
          keyRecommendations: [
            'وضع خطة عمل مفصلة ومرحلية',
            'تأمين التمويل من مصادر متنوعة',
            'بناء فريق عمل متخصص',
            'تطوير استراتيجية تسويقية شاملة',
            'وضع نظام مراقبة الأداء'
          ],
          nextSteps: [
            'إعداد خطة العمل التفصيلية',
            'البحث عن مصادر التمويل',
            'تشكيل الفريق الإداري',
            'الحصول على التراخيص اللازمة',
            'بدء المرحلة التجريبية'
          ]
        };
      default:
        return 'محتوى تجريبي للاختبار';
    }
  };

  const renderContent = () => {
    if (!generatedContent) return null;

    if (type === 'executive_summary' && typeof generatedContent === 'string') {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert text-right">
          <pre className="whitespace-pre-wrap font-sans">{generatedContent}</pre>
        </div>
      );
    }

    if (typeof generatedContent === 'object') {
      return (
        <div className="space-y-4 text-right">
          {Object.entries(generatedContent).map(([key, value]) => (
            <div key={key}>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {key === 'marketSize' ? 'حجم السوق' :
                 key === 'growthRate' ? 'معدل النمو' :
                 key === 'keyTrends' ? 'الاتجاهات الرئيسية' :
                 key === 'opportunities' ? 'الفرص' :
                 key === 'challenges' ? 'التحديات' :
                 key === 'overallRecommendation' ? 'التوصية العامة' :
                 key === 'reasoning' ? 'التبرير' :
                 key === 'keyRecommendations' ? 'التوصيات الرئيسية' :
                 key === 'nextSteps' ? 'الخطوات التالية' : key}
              </h4>
              {Array.isArray(value) ? (
                <ul className="list-disc list-inside space-y-1">
                  {value.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {typeof item === 'object' ? JSON.stringify(item) : item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">{value}</p>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-sm text-gray-600 dark:text-gray-400 text-right">
        {generatedContent}
      </div>
    );
  };

  const typeInfo = getTypeInfo();
  const IconComponent = typeInfo.icon;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${typeInfo.color} flex items-center justify-center`}>
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{typeInfo.title}</CardTitle>
              <CardDescription>{typeInfo.description}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
            <Sparkles className="h-3 w-3 ml-1" />
            AI
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!generatedContent ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">اضغط على الزر أدناه لتوليد محتوى ذكي لهذا القسم</p>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                <>
                  <Sparkles className="ml-2 h-4 w-4" />
                  توليد بالذكاء الاصطناعي
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              {renderContent()}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex-1"
              >
                {isCopied ? (
                  <>
                    <Check className="ml-2 h-4 w-4 text-green-600" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="ml-2 h-4 w-4" />
                    نسخ المحتوى
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <RefreshCw className="ml-2 h-4 w-4" />
                إعادة التوليد
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
