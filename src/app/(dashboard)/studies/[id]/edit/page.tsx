'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Save,
  AlertTriangle,
  Loader2,
  FileText,
  DollarSign,
  Globe,
  Zap,
  Shield,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

interface StudyFormData {
  title: string;
  description: string;
  type: string;
  status: string;
  aiModel: string;
  language: string;
  currency: string;
  executiveSummary: string;
  marketAnalysis: string;
  technicalAnalysis: string;
  financialAnalysis: string;
  riskAssessment: string;
  recommendations: string;
  assumptions: string;
  methodology: string;
  initialInvestment: string;
  projectedRevenue: string;
  breakEvenPoint: string;
  roi: string;
  npv: string;
  irr: string;
  paybackPeriod: string;
  sensitivityAnalysis: string;
  competitorAnalysis: string;
  swotAnalysis: string;
}

const STUDY_TYPES = [
  { value: 'comprehensive', label: 'دراسة شاملة' },
  { value: 'economic', label: 'دراسة اقتصادية' },
  { value: 'technical', label: 'دراسة تقنية' },
];

const STUDY_STATUSES = [
  { value: 'DRAFT', label: 'مسودة' },
  { value: 'IN_PROGRESS', label: 'قيد التطوير' },
  { value: 'COMPLETED', label: 'مكتملة' },
  { value: 'REVIEWED', label: 'تم المراجعة' },
];

const AI_MODELS = [
  { value: 'gemini-pro', label: 'Google Gemini Pro' },
  { value: 'gpt-4', label: 'OpenAI GPT-4' },
  { value: 'claude-3', label: 'Anthropic Claude 3' },
];

const LANGUAGES = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'English' },
];

const CURRENCIES = [
  { value: 'SAR', label: 'ريال سعودي (SAR)' },
  { value: 'USD', label: 'دولار أمريكي (USD)' },
  { value: 'EUR', label: 'يورو (EUR)' },
  { value: 'AED', label: 'درهم إماراتي (AED)' },
];

export default function EditStudyPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [study, setStudy] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<StudyFormData>();

  const watchedType = watch('type');
  const watchedStatus = watch('status');
  const watchedAiModel = watch('aiModel');
  const watchedLanguage = watch('language');
  const watchedCurrency = watch('currency');

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const response = await fetch(`/api/studies/${params.id}`);
        if (!response.ok) {
          throw new Error('فشل في جلب بيانات الدراسة');
        }
        const studyData = await response.json();
        setStudy(studyData);
        
        // Populate form with existing data
        setValue('title', studyData.title || '');
        setValue('description', studyData.description || '');
        setValue('type', studyData.type || 'comprehensive');
        setValue('status', studyData.status || 'DRAFT');
        setValue('aiModel', studyData.aiModel || 'gemini-pro');
        setValue('language', studyData.language || 'ar');
        setValue('currency', studyData.currency || 'SAR');
        setValue('executiveSummary', studyData.executiveSummary || '');
        setValue('marketAnalysis', studyData.marketAnalysis || '');
        setValue('technicalAnalysis', studyData.technicalAnalysis || '');
        setValue('financialAnalysis', studyData.financialAnalysis || '');
        setValue('riskAssessment', studyData.riskAssessment || '');
        setValue('recommendations', studyData.recommendations || '');
        setValue('assumptions', studyData.assumptions || '');
        setValue('methodology', studyData.methodology || '');
        setValue('initialInvestment', studyData.initialInvestment?.toString() || '');
        setValue('projectedRevenue', studyData.projectedRevenue?.toString() || '');
        setValue('breakEvenPoint', studyData.breakEvenPoint?.toString() || '');
        setValue('roi', studyData.roi?.toString() || '');
        setValue('npv', studyData.npv?.toString() || '');
        setValue('irr', studyData.irr?.toString() || '');
        setValue('paybackPeriod', studyData.paybackPeriod?.toString() || '');
        setValue('sensitivityAnalysis', studyData.sensitivityAnalysis || '');
        setValue('competitorAnalysis', studyData.competitorAnalysis || '');
        setValue('swotAnalysis', studyData.swotAnalysis || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStudy();
    }
  }, [params.id, setValue]);

  const onSubmit = async (data: StudyFormData) => {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...data,
        initialInvestment: data.initialInvestment ? parseFloat(data.initialInvestment) : null,
        projectedRevenue: data.projectedRevenue ? parseFloat(data.projectedRevenue) : null,
        breakEvenPoint: data.breakEvenPoint ? parseInt(data.breakEvenPoint) : null,
        roi: data.roi ? parseFloat(data.roi) : null,
        npv: data.npv ? parseFloat(data.npv) : null,
        irr: data.irr ? parseFloat(data.irr) : null,
        paybackPeriod: data.paybackPeriod ? parseFloat(data.paybackPeriod) : null,
      };

      const response = await fetch(`/api/studies/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في تحديث الدراسة');
      }

      router.push(`/studies/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث الدراسة');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !isDirty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{error}</h1>
        <Button asChild variant="outline">
          <Link href="/studies">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للدراسات
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/studies/${params.id}`}>
              <ArrowLeft className="h-4 w-4 ml-1" />
              العودة للدراسة
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تحرير دراسة الجدوى
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              قم بتحديث معلومات الدراسة والتحليلات
            </p>
            {study?.project && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>المشروع:</span>
                <Link href={`/projects/${study.project.id}`} className="text-blue-600 hover:underline">
                  {study.project.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
            <CardDescription>
              المعلومات الأساسية لدراسة الجدوى
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الدراسة *</Label>
                <Input
                  id="title"
                  {...register('title', { 
                    required: 'عنوان الدراسة مطلوب',
                    minLength: { value: 2, message: 'العنوان يجب أن يكون على الأقل حرفين' }
                  })}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">نوع الدراسة *</Label>
                <Select value={watchedType} onValueChange={(value) => setValue('type', value)}>
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر نوع الدراسة" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">حالة الدراسة *</Label>
                <Select value={watchedStatus} onValueChange={(value) => setValue('status', value)}>
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر حالة الدراسة" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDY_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">العملة *</Label>
                <Select value={watchedCurrency} onValueChange={(value) => setValue('currency', value)}>
                  <SelectTrigger className={errors.currency ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-red-600">{errors.currency.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف الدراسة *</Label>
              <Textarea
                id="description"
                {...register('description', { 
                  required: 'وصف الدراسة مطلوب',
                  minLength: { value: 10, message: 'الوصف يجب أن يكون على الأقل 10 أحرف' }
                })}
                placeholder="وصف تفصيلي لدراسة الجدوى"
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="executive" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="executive">ملخص تنفيذي</TabsTrigger>
            <TabsTrigger value="financial">مالي</TabsTrigger>
            <TabsTrigger value="market">سوق</TabsTrigger>
            <TabsTrigger value="technical">تقني</TabsTrigger>
            <TabsTrigger value="risks">مخاطر</TabsTrigger>
            <TabsTrigger value="recommendations">توصيات</TabsTrigger>
          </TabsList>

          {/* Executive Summary */}
          <TabsContent value="executive">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  الملخص التنفيذي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="executiveSummary">الملخص التنفيذي</Label>
                  <Textarea
                    id="executiveSummary"
                    {...register('executiveSummary')}
                    placeholder="ملخص شامل لدراسة الجدوى ونتائجها الرئيسية"
                    rows={8}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="methodology">المنهجية المتبعة</Label>
                    <Textarea
                      id="methodology"
                      {...register('methodology')}
                      placeholder="وصف المنهجية المستخدمة في إعداد الدراسة"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assumptions">الافتراضات الأساسية</Label>
                    <Textarea
                      id="assumptions"
                      {...register('assumptions')}
                      placeholder="الافتراضات التي تم بناء الدراسة عليها"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Analysis */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  التحليل المالي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="initialInvestment">الاستثمار المبدئي</Label>
                    <Input
                      id="initialInvestment"
                      type="number"
                      {...register('initialInvestment')}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectedRevenue">الإيرادات المتوقعة</Label>
                    <Input
                      id="projectedRevenue"
                      type="number"
                      {...register('projectedRevenue')}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roi">العائد على الاستثمار (%)</Label>
                    <Input
                      id="roi"
                      type="number"
                      step="0.01"
                      {...register('roi')}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financialAnalysis">التحليل المالي التفصيلي</Label>
                  <Textarea
                    id="financialAnalysis"
                    {...register('financialAnalysis')}
                    placeholder="تحليل تفصيلي للجوانب المالية للمشروع"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Analysis */}
          <TabsContent value="market">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  تحليل السوق
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="marketAnalysis">تحليل السوق</Label>
                  <Textarea
                    id="marketAnalysis"
                    {...register('marketAnalysis')}
                    placeholder="تحليل شامل للسوق المستهدف والفرص المتاحة"
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitorAnalysis">تحليل المنافسين</Label>
                  <Textarea
                    id="competitorAnalysis"
                    {...register('competitorAnalysis')}
                    placeholder="تحليل المنافسين الرئيسيين في السوق"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Analysis */}
          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  التحليل التقني
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="technicalAnalysis">التحليل التقني</Label>
                  <Textarea
                    id="technicalAnalysis"
                    {...register('technicalAnalysis')}
                    placeholder="تحليل الجوانب التقنية والتكنولوجية للمشروع"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Assessment */}
          <TabsContent value="risks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  تقييم المخاطر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="riskAssessment">تقييم المخاطر</Label>
                  <Textarea
                    id="riskAssessment"
                    {...register('riskAssessment')}
                    placeholder="تحليل المخاطر المحتملة وطرق التعامل معها"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations */}
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  التوصيات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="recommendations">التوصيات والخلاصة</Label>
                  <Textarea
                    id="recommendations"
                    {...register('recommendations')}
                    placeholder="التوصيات النهائية والخلاصة"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" asChild>
            <Link href={`/studies/${params.id}`}>
              إلغاء
            </Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جارٍ الحفظ...
              </>
            ) : (
              <>
                <Save className="ml-2 h-4 w-4" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
