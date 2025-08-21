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
import { 
  ArrowLeft,
  Save,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface ProjectFormData {
  name: string;
  description: string;
  type: string;
  industry: string;
  location: string;
  status: string;
  currency: string;
  initialInvestment: string;
  expectedRevenue: string;
  targetMarket: string;
  projectDuration: string;
  teamSize: string;
  businessModel: string;
  competitiveAdvantage: string;
  risks: string;
  successMetrics: string;
}

const PROJECT_TYPES = [
  { value: 'STARTUP', label: 'شركة ناشئة' },
  { value: 'EXPANSION', label: 'توسع' },
  { value: 'NEW_PRODUCT', label: 'منتج جديد' },
  { value: 'ACQUISITION', label: 'استحواذ' },
  { value: 'FRANCHISE', label: 'امتياز' },
];

const PROJECT_STATUSES = [
  { value: 'PLANNING', label: 'في التخطيط' },
  { value: 'IN_PROGRESS', label: 'قيد التنفيذ' },
  { value: 'COMPLETED', label: 'مكتمل' },
  { value: 'ON_HOLD', label: 'متوقف مؤقتاً' },
  { value: 'CANCELLED', label: 'ملغي' },
];

const CURRENCIES = [
  { value: 'SAR', label: 'ريال سعودي (SAR)' },
  { value: 'USD', label: 'دولار أمريكي (USD)' },
  { value: 'EUR', label: 'يورو (EUR)' },
  { value: 'AED', label: 'درهم إماراتي (AED)' },
];

const INDUSTRIES = [
  'التكنولوجيا',
  'التجارة الإلكترونية',
  'الصحة',
  'التعليم',
  'العقارات',
  'السياحة',
  'المالية',
  'الطاقة',
  'الزراعة',
  'الصناعة',
  'الخدمات',
  'أخرى'
];

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<ProjectFormData>();

  const watchedType = watch('type');
  const watchedStatus = watch('status');
  const watchedCurrency = watch('currency');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error('فشل في جلب بيانات المشروع');
        }
        const project = await response.json();
        
        // Populate form with existing data
        setValue('name', project.name);
        setValue('description', project.description);
        setValue('type', project.type);
        setValue('industry', project.industry);
        setValue('location', project.location);
        setValue('status', project.status);
        setValue('currency', project.currency);
        setValue('initialInvestment', project.initialInvestment?.toString() || '');
        setValue('expectedRevenue', project.expectedRevenue?.toString() || '');
        setValue('targetMarket', project.targetMarket || '');
        setValue('projectDuration', project.projectDuration?.toString() || '');
        setValue('teamSize', project.teamSize?.toString() || '');
        setValue('businessModel', project.businessModel || '');
        setValue('competitiveAdvantage', project.competitiveAdvantage || '');
        setValue('risks', project.risks || '');
        setValue('successMetrics', project.successMetrics || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...data,
        initialInvestment: data.initialInvestment ? parseFloat(data.initialInvestment) : null,
        expectedRevenue: data.expectedRevenue ? parseFloat(data.expectedRevenue) : null,
        projectDuration: data.projectDuration ? parseInt(data.projectDuration) : null,
        teamSize: data.teamSize ? parseInt(data.teamSize) : null,
      };

      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في تحديث المشروع');
      }

      router.push(`/projects/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث المشروع');
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
          <Link href="/projects">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للمشاريع
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
            <Link href={`/projects/${params.id}`}>
              <ArrowLeft className="h-4 w-4 ml-1" />
              العودة للمشروع
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تحرير المشروع
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              قم بتحديث معلومات المشروع
            </p>
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
              المعلومات الأساسية للمشروع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المشروع *</Label>
                <Input
                  id="name"
                  {...register('name', { 
                    required: 'اسم المشروع مطلوب',
                    minLength: { value: 2, message: 'الاسم يجب أن يكون على الأقل حرفين' }
                  })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">نوع المشروع *</Label>
                <Select value={watchedType} onValueChange={(value) => setValue('type', value)}>
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر نوع المشروع" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((type) => (
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
                <Label htmlFor="industry">القطاع *</Label>
                <Select value={watch('industry')} onValueChange={(value) => setValue('industry', value)}>
                  <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر القطاع" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-600">{errors.industry.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">حالة المشروع *</Label>
                <Select value={watchedStatus} onValueChange={(value) => setValue('status', value)}>
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر حالة المشروع" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((status) => (
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
                <Label htmlFor="location">الموقع *</Label>
                <Input
                  id="location"
                  {...register('location', { required: 'الموقع مطلوب' })}
                  placeholder="مثال: الرياض، المملكة العربية السعودية"
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location.message}</p>
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
              <Label htmlFor="description">وصف المشروع *</Label>
              <Textarea
                id="description"
                {...register('description', { 
                  required: 'وصف المشروع مطلوب',
                  minLength: { value: 10, message: 'الوصف يجب أن يكون على الأقل 10 أحرف' }
                })}
                placeholder="وصف تفصيلي للمشروع وأهدافه"
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>المعلومات المالية</CardTitle>
            <CardDescription>
              البيانات المالية والاستثمارية للمشروع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="initialInvestment">الاستثمار المبدئي</Label>
                <Input
                  id="initialInvestment"
                  type="number"
                  {...register('initialInvestment', {
                    min: { value: 0, message: 'يجب أن يكون المبلغ موجباً' }
                  })}
                  placeholder="0"
                  className={errors.initialInvestment ? 'border-red-500' : ''}
                />
                {errors.initialInvestment && (
                  <p className="text-sm text-red-600">{errors.initialInvestment.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedRevenue">الإيرادات المتوقعة</Label>
                <Input
                  id="expectedRevenue"
                  type="number"
                  {...register('expectedRevenue', {
                    min: { value: 0, message: 'يجب أن يكون المبلغ موجباً' }
                  })}
                  placeholder="0"
                  className={errors.expectedRevenue ? 'border-red-500' : ''}
                />
                {errors.expectedRevenue && (
                  <p className="text-sm text-red-600">{errors.expectedRevenue.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل المشروع</CardTitle>
            <CardDescription>
              معلومات إضافية حول المشروع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projectDuration">مدة المشروع (بالأشهر)</Label>
                <Input
                  id="projectDuration"
                  type="number"
                  {...register('projectDuration', {
                    min: { value: 1, message: 'يجب أن تكون المدة على الأقل شهر واحد' }
                  })}
                  placeholder="12"
                  className={errors.projectDuration ? 'border-red-500' : ''}
                />
                {errors.projectDuration && (
                  <p className="text-sm text-red-600">{errors.projectDuration.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">حجم الفريق</Label>
                <Input
                  id="teamSize"
                  type="number"
                  {...register('teamSize', {
                    min: { value: 1, message: 'يجب أن يكون حجم الفريق على الأقل شخص واحد' }
                  })}
                  placeholder="5"
                  className={errors.teamSize ? 'border-red-500' : ''}
                />
                {errors.teamSize && (
                  <p className="text-sm text-red-600">{errors.teamSize.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetMarket">السوق المستهدف</Label>
              <Textarea
                id="targetMarket"
                {...register('targetMarket')}
                placeholder="وصف السوق المستهدف والعملاء المحتملين"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessModel">نموذج الأعمال</Label>
              <Textarea
                id="businessModel"
                {...register('businessModel')}
                placeholder="كيف سيحقق المشروع الإيرادات؟"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitiveAdvantage">الميزة التنافسية</Label>
              <Textarea
                id="competitiveAdvantage"
                {...register('competitiveAdvantage')}
                placeholder="ما الذي يميز هذا المشروع عن المنافسين؟"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risks">المخاطر المحتملة</Label>
              <Textarea
                id="risks"
                {...register('risks')}
                placeholder="ما هي المخاطر التي قد تواجه المشروع؟"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="successMetrics">مقاييس النجاح</Label>
              <Textarea
                id="successMetrics"
                {...register('successMetrics')}
                placeholder="كيف ستقيس نجاح المشروع؟"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" asChild>
            <Link href={`/projects/${params.id}`}>
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
