'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  MapPin,
  DollarSign,
  Calendar,
  Building,
  Target
} from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    industry: '',
    location: '',
    
    // Financial
    initialInvestment: '',
    expectedRevenue: '',
    currency: 'SAR',
    timeframe: '12',
    
    // Goals
    primaryGoal: '',
    targetMarket: '',
    competitiveAdvantage: '',
    
    // Additional
    teamSize: '',
    hasExperience: '',
    riskTolerance: 'medium',
  });

  const industries = [
    'مطاعم وخدمات طعام',
    'تجارة إلكترونية',
    'تعليم وتدريب',
    'صحة ولياقة',
    'تقنية ومعلومات',
    'عقارات وإنشاءات',
    'نقل ولوجستيات',
    'سياحة وضيافة',
    'أخرى',
  ];

  const saudiCities = [
    'الرياض',
    'جدة',
    'مكة المكرمة',
    'المدينة المنورة',
    'الدمام',
    'الخبر',
    'الظهران',
    'تبوك',
    'بريدة',
    'الطائف',
    'أخرى',
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Here would be the API call to create the project
    console.log('Creating project:', formData);
    
    // For now, just redirect to projects page
    router.push('/projects');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                معلومات المشروع الأساسية
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                ابدأ بتقديم نظرة عامة عن مشروعك
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اسم المشروع *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="مثال: مطعم الأصالة"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف المشروع *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="اشرح فكرة مشروعك والخدمات/المنتجات التي ستقدمها..."
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    القطاع *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => updateFormData('industry', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">اختر القطاع</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الموقع *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">اختر المدينة</option>
                    {saudiCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                التوقعات المالية
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                قدم تقديراتك المالية للمشروع
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاستثمار المطلوب *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.initialInvestment}
                      onChange={(e) => updateFormData('initialInvestment', e.target.value)}
                      placeholder="500000"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      ريال
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الإيرادات المتوقعة (سنوياً) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.expectedRevenue}
                      onChange={(e) => updateFormData('expectedRevenue', e.target.value)}
                      placeholder="1200000"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      ريال
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الإطار الزمني للتقييم
                </label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => updateFormData('timeframe', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="6">6 أشهر</option>
                  <option value="12">سنة واحدة</option>
                  <option value="24">سنتان</option>
                  <option value="36">3 سنوات</option>
                  <option value="60">5 سنوات</option>
                </select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      نصيحة مالية
                    </p>
                    <p className="text-blue-700 dark:text-blue-400">
                      تأكد من إدراج جميع التكاليف المتوقعة بما في ذلك التكاليف التشغيلية، الرواتب، الإيجار، والتسويق في حساب الاستثمار المطلوب.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                الأهداف والاستراتيجية
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                حدد أهدافك واستراتيجيتك التنافسية
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الهدف الأساسي من المشروع *
                </label>
                <textarea
                  value={formData.primaryGoal}
                  onChange={(e) => updateFormData('primaryGoal', e.target.value)}
                  placeholder="مثال: تقديم خدمة طعام عالية الجودة للعائلات في الحي..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  السوق المستهدف *
                </label>
                <textarea
                  value={formData.targetMarket}
                  onChange={(e) => updateFormData('targetMarket', e.target.value)}
                  placeholder="مثال: العائلات والشباب في الأحياء الراقية، الأعمار 25-45..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الميزة التنافسية
                </label>
                <textarea
                  value={formData.competitiveAdvantage}
                  onChange={(e) => updateFormData('competitiveAdvantage', e.target.value)}
                  placeholder="ما الذي يميز مشروعك عن المنافسين؟"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                معلومات إضافية
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                أكمل بيانات مشروعك لإنشاء دراسة أكثر دقة
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    حجم الفريق المتوقع
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => updateFormData('teamSize', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">اختر حجم الفريق</option>
                    <option value="1-3">1-3 أشخاص</option>
                    <option value="4-10">4-10 أشخاص</option>
                    <option value="11-25">11-25 شخص</option>
                    <option value="26-50">26-50 شخص</option>
                    <option value="50+">أكثر من 50 شخص</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الخبرة في المجال
                  </label>
                  <select
                    value={formData.hasExperience}
                    onChange={(e) => updateFormData('hasExperience', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">اختر مستوى الخبرة</option>
                    <option value="none">لا توجد خبرة</option>
                    <option value="limited">خبرة محدودة</option>
                    <option value="moderate">خبرة متوسطة</option>
                    <option value="extensive">خبرة واسعة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  مستوى تحمل المخاطر
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'low', label: 'منخفض', desc: 'أفضل الاستثمارات الآمنة' },
                    { value: 'medium', label: 'متوسط', desc: 'توازن بين المخاطر والعوائد' },
                    { value: 'high', label: 'عالي', desc: 'مستعد للمخاطر العالية' },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`cursor-pointer rounded-lg border-2 p-3 transition-colors ${
                        formData.riskTolerance === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => updateFormData('riskTolerance', option.value)}
                    >
                      <div className="text-center">
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {option.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800 dark:text-green-300 mb-1">
                      جاهز للبدء!
                    </p>
                    <p className="text-green-700 dark:text-green-400">
                      بمجرد إنشاء المشروع، ستتمكن من إنشاء دراسات جدوى مفصلة باستخدام الذكاء الاصطناعي.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.description && formData.industry && formData.location;
      case 2:
        return formData.initialInvestment && formData.expectedRevenue;
      case 3:
        return formData.primaryGoal && formData.targetMarket;
      case 4:
        return true; // All fields in step 4 are optional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              إنشاء مشروع جديد
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              الخطوة {currentStep} من {totalSteps}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            السابق
          </Button>

          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2"
              >
                التالي
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="flex items-center gap-2"
              >
                إنشاء المشروع
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
