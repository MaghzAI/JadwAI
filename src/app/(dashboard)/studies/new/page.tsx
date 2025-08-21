'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Zap,
  Brain,
  FileText,
  Settings,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewStudyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    studyType: 'comprehensive',
    title: '',
    description: '',
    language: 'ar',
    aiModel: 'gemini',
    includeFinancialAnalysis: true,
    includeMarketAnalysis: true,
    includeTechnicalAnalysis: true,
    includeRiskAnalysis: true,
    includeLegalAnalysis: false,
    includeEnvironmentalAnalysis: false,
    customPrompts: '',
    reportFormat: 'detailed',
    currency: 'SAR',
    analysisDepth: 'comprehensive'
  });

  const totalSteps = 4;

  const studyTypes = [
    {
      id: 'comprehensive',
      title: 'دراسة شاملة',
      description: 'تحليل كامل يشمل جميع جوانب المشروع',
      icon: FileText,
      recommended: true
    },
    {
      id: 'economic',
      title: 'دراسة اقتصادية',
      description: 'تركز على التحليل المالي والاقتصادي',
      icon: Zap
    },
    {
      id: 'technical',
      title: 'دراسة تقنية',
      description: 'تحليل المتطلبات التقنية والتشغيلية',
      icon: Settings
    },
    {
      id: 'market',
      title: 'دراسة السوق',
      description: 'تحليل السوق والمنافسة والعملاء',
      icon: Brain
    }
  ];

  const aiModels = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'متطور في التحليل والاستنتاجات',
      speed: 'سريع',
      quality: 'عالية'
    },
    {
      id: 'openai',
      name: 'OpenAI GPT',
      description: 'ممتاز في الكتابة والتفسير',
      speed: 'متوسط',
      quality: 'عالية جداً'
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      description: 'دقيق في التحليل المنطقي',
      speed: 'متوسط',
      quality: 'عالية'
    }
  ];

  // Mock projects - سيتم استبدالها بـ API call
  const projects = [
    { id: 1, name: 'مطعم الأصالة', type: 'مطعم' },
    { id: 2, name: 'متجر الإلكترونيات الذكية', type: 'تجارة إلكترونية' },
    { id: 3, name: 'مركز التدريب التقني', type: 'تعليم' },
    { id: 4, name: 'مركز اللياقة البدنية', type: 'خدمات' }
  ];

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation process
    setTimeout(() => {
      setIsGenerating(false);
      router.push('/studies/generated/123'); // Mock study ID
    }, 3000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">اختيار المشروع ونوع الدراسة</h2>
              <p className="text-gray-600 dark:text-gray-400">حدد المشروع ونوع الدراسة المطلوبة</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">المشروع</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => updateFormData('projectId', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">اختر المشروع</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name} - {project.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">نوع الدراسة</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studyTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.studyType === type.id
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                        onClick={() => updateFormData('studyType', type.id)}
                      >
                        {type.recommended && (
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            مُوصى
                          </span>
                        )}
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <h3 className="font-medium">{type.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان الدراسة</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    placeholder="أدخل عنوان الدراسة"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اللغة</label>
                  <select
                    value={formData.language}
                    onChange={(e) => updateFormData('language', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                    <option value="both">ثنائية اللغة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">وصف مختصر (اختياري)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="أضف وصف مختصر للدراسة..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">اختيار محرك الذكاء الاصطناعي</h2>
              <p className="text-gray-600 dark:text-gray-400">حدد نموذج الذكاء الاصطناعي لتوليد الدراسة</p>
            </div>

            <div className="space-y-4">
              {aiModels.map(model => (
                <div
                  key={model.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.aiModel === model.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                  onClick={() => updateFormData('aiModel', model.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{model.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {model.description}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">السرعة:</span> {model.speed}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">الجودة:</span> {model.quality}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">عمق التحليل</label>
                <select
                  value={formData.analysisDepth}
                  onChange={(e) => updateFormData('analysisDepth', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="basic">أساسي</option>
                  <option value="detailed">مفصل</option>
                  <option value="comprehensive">شامل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تنسيق التقرير</label>
                <select
                  value={formData.reportFormat}
                  onChange={(e) => updateFormData('reportFormat', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="executive">ملخص تنفيذي</option>
                  <option value="detailed">مفصل</option>
                  <option value="technical">تقني متخصص</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">محتوى الدراسة</h2>
              <p className="text-gray-600 dark:text-gray-400">حدد الأقسام المطلوب تضمينها في الدراسة</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'includeFinancialAnalysis', label: 'التحليل المالي', desc: 'معدل العائد، التدفق النقدي، الربحية' },
                  { key: 'includeMarketAnalysis', label: 'تحليل السوق', desc: 'حجم السوق، المنافسة، الفرص' },
                  { key: 'includeTechnicalAnalysis', label: 'التحليل التقني', desc: 'المتطلبات التقنية والتشغيلية' },
                  { key: 'includeRiskAnalysis', label: 'تحليل المخاطر', desc: 'تحديد وتقييم المخاطر المحتملة' },
                  { key: 'includeLegalAnalysis', label: 'التحليل القانوني', desc: 'المتطلبات القانونية والتراخيص' },
                  { key: 'includeEnvironmentalAnalysis', label: 'التحليل البيئي', desc: 'التأثير البيئي والاستدامة' },
                ].map(section => (
                  <div
                    key={section.key}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData[section.key as keyof typeof formData]
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                    onClick={() => updateFormData(section.key, !formData[section.key as keyof typeof formData])}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center ${
                        formData[section.key as keyof typeof formData] 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {formData[section.key as keyof typeof formData] && (
                          <div className="w-2 h-2 bg-white rounded-sm" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{section.label}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {section.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">العملة</label>
              <select
                value={formData.currency}
                onChange={(e) => updateFormData('currency', e.target.value)}
                className="w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="EUR">يورو (EUR)</option>
                <option value="AED">درهم إماراتي (AED)</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">توجيهات إضافية</h2>
              <p className="text-gray-600 dark:text-gray-400">أضف أي توجيهات أو متطلبات خاصة للدراسة</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">توجيهات مخصصة (اختياري)</label>
                <textarea
                  value={formData.customPrompts}
                  onChange={(e) => updateFormData('customPrompts', e.target.value)}
                  placeholder="أضف أي توجيهات خاصة أو نقاط تركيز معينة تريد من الذكاء الاصطناعي مراعاتها..."
                  rows={6}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ملخص الدراسة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">المشروع:</span>
                      <span className="mr-2 text-gray-600 dark:text-gray-400">
                        {projects.find(p => p.id.toString() === formData.projectId)?.name || 'لم يتم تحديده'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">نوع الدراسة:</span>
                      <span className="mr-2 text-gray-600 dark:text-gray-400">
                        {studyTypes.find(t => t.id === formData.studyType)?.title}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">محرك الذكاء الاصطناعي:</span>
                      <span className="mr-2 text-gray-600 dark:text-gray-400">
                        {aiModels.find(m => m.id === formData.aiModel)?.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">اللغة:</span>
                      <span className="mr-2 text-gray-600 dark:text-gray-400">
                        {formData.language === 'ar' ? 'العربية' : formData.language === 'en' ? 'English' : 'ثنائية اللغة'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">الأقسام المضمنة:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(formData).filter(([key, value]) => 
                        key.startsWith('include') && value
                      ).map(([key]) => {
                        const sectionNames: Record<string, string> = {
                          includeFinancialAnalysis: 'التحليل المالي',
                          includeMarketAnalysis: 'تحليل السوق',
                          includeTechnicalAnalysis: 'التحليل التقني',
                          includeRiskAnalysis: 'تحليل المخاطر',
                          includeLegalAnalysis: 'التحليل القانوني',
                          includeEnvironmentalAnalysis: 'التحليل البيئي'
                        };
                        return (
                          <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {sectionNames[key]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-semibold">جاري إنتاج دراسة الجدوى</h2>
          <p className="text-gray-600 dark:text-gray-400">
            يقوم الذكاء الاصطناعي بتحليل البيانات وإنتاج دراسة جدوى شاملة لمشروعك...
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
          <p className="text-sm text-gray-500">هذا قد يستغرق بضع دقائق</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/studies">
            <ArrowLeft className="h-4 w-4 ml-1" />
            العودة للدراسات
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            إنشاء دراسة جدوى جديدة
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            استخدم الذكاء الاصطناعي لإنتاج دراسة جدوى شاملة
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    step < currentStep
                      ? 'bg-primary'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          الخطوة {currentStep} من {totalSteps}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          السابق
        </Button>
        
        {currentStep === totalSteps ? (
          <Button 
            onClick={handleGenerate}
            disabled={!formData.projectId}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Brain className="ml-2 h-4 w-4" />
            إنتاج الدراسة
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={currentStep === 1 && !formData.projectId}
          >
            التالي
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
