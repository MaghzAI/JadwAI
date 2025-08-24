'use client';

import { useEffect, useState } from 'react';
import { useStudyWizard } from '@/contexts/StudyWizardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, DollarSign, Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const PROJECT_TYPES = [
  { value: 'technology', label: 'تقنية معلومات' },
  { value: 'manufacturing', label: 'تصنيع' },
  { value: 'services', label: 'خدمات' },
  { value: 'retail', label: 'تجارة التجزئة' },
  { value: 'healthcare', label: 'رعاية صحية' },
  { value: 'education', label: 'تعليم' },
  { value: 'real-estate', label: 'عقارات' },
  { value: 'agriculture', label: 'زراعة' },
  { value: 'tourism', label: 'سياحة' },
  { value: 'other', label: 'أخرى' },
];

const INVESTMENT_RANGES = [
  { value: 'under-100k', label: 'أقل من 100 ألف' },
  { value: '100k-500k', label: '100 - 500 ألف' },
  { value: '500k-1m', label: '500 ألف - مليون' },
  { value: '1m-5m', label: '1 - 5 مليون' },
  { value: '5m-10m', label: '5 - 10 مليون' },
  { value: 'over-10m', label: 'أكثر من 10 مليون' },
];

export default function ExecutiveSummaryStep() {
  const { state, updateData, updateStepStatus, setError, clearError } = useStudyWizard();
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    overview: '',
    objectives: '',
    targetMarket: '',
    investmentRange: '',
    expectedRevenue: '',
    timeline: '',
    location: '',
    keySuccessFactors: [] as string[],
    competitiveAdvantage: '',
  });

  const [newSuccessFactor, setNewSuccessFactor] = useState('');

  // تحميل البيانات من الحالة
  useEffect(() => {
    const existingData = state.data.executiveSummary;
    if (existingData) {
      setFormData({
        projectName: existingData.projectName || '',
        projectType: existingData.projectType || '',
        overview: existingData.overview || '',
        objectives: existingData.objectives || '',
        targetMarket: existingData.targetMarket || '',
        investmentRange: existingData.investmentRange || '',
        expectedRevenue: existingData.expectedRevenue || '',
        timeline: existingData.timeline || '',
        location: existingData.location || '',
        keySuccessFactors: existingData.keySuccessFactors || [],
        competitiveAdvantage: existingData.competitiveAdvantage || '',
      });
    }
  }, [state.data.executiveSummary]);

  // تحديث البيانات والتحقق من الصحة
  useEffect(() => {
    const isValid = validateForm();
    const isCompleted = isValid && formData.projectName && formData.overview;
    
    updateData({
      executiveSummary: formData,
    });
    
    updateStepStatus(0, isCompleted, isValid);
  }, [formData, updateData, updateStepStatus]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.projectName.trim()) {
      errors.push('اسم المشروع مطلوب');
    }

    if (!formData.projectType) {
      errors.push('نوع المشروع مطلوب');
    }

    if (!formData.overview.trim() || formData.overview.length < 100) {
      errors.push('نظرة عامة مفصلة مطلوبة (100 حرف على الأقل)');
    }

    if (!formData.objectives.trim()) {
      errors.push('أهداف المشروع مطلوبة');
    }

    if (!formData.targetMarket.trim()) {
      errors.push('السوق المستهدف مطلوب');
    }

    if (errors.length > 0) {
      setError('executiveSummary', errors.join('، '));
      return false;
    } else {
      clearError('executiveSummary');
      return true;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSuccessFactor = () => {
    if (newSuccessFactor.trim() && !formData.keySuccessFactors.includes(newSuccessFactor.trim())) {
      setFormData(prev => ({
        ...prev,
        keySuccessFactors: [...prev.keySuccessFactors, newSuccessFactor.trim()],
      }));
      setNewSuccessFactor('');
    }
  };

  const removeSuccessFactor = (factor: string) => {
    setFormData(prev => ({
      ...prev,
      keySuccessFactors: prev.keySuccessFactors.filter(f => f !== factor),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
          <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          الملخص التنفيذي
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          قدم نظرة شاملة عن مشروعك وأهدافه الأساسية
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              المعلومات الأساسية
            </CardTitle>
            <CardDescription>
              الخصائص الأساسية للمشروع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="projectName">اسم المشروع *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="مثال: منصة التجارة الإلكترونية الذكية"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="projectType">نوع المشروع *</Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) => handleInputChange('projectType', value)}
              >
                <SelectTrigger className="mt-1">
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
            </div>

            <div>
              <Label htmlFor="location">الموقع</Label>
              <div className="relative mt-1">
                <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="المدينة، الدولة"
                  className="pr-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="timeline">الجدول الزمني</Label>
              <div className="relative mt-1">
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  placeholder="مثال: 18 شهر"
                  className="pr-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              نظرة مالية سريعة
            </CardTitle>
            <CardDescription>
              التقديرات المالية الأولية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="investmentRange">نطاق الاستثمار المطلوب</Label>
              <Select
                value={formData.investmentRange}
                onValueChange={(value) => handleInputChange('investmentRange', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر نطاق الاستثمار" />
                </SelectTrigger>
                <SelectContent>
                  {INVESTMENT_RANGES.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expectedRevenue">الإيرادات المتوقعة (سنوياً)</Label>
              <Input
                id="expectedRevenue"
                value={formData.expectedRevenue}
                onChange={(e) => handleInputChange('expectedRevenue', e.target.value)}
                placeholder="مثال: 2.5 مليون"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>نظرة عامة عن المشروع *</CardTitle>
          <CardDescription>
            اكتب وصفاً مفصلاً عن المشروع وما يهدف إلى تحقيقه
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.overview}
            onChange={(e) => handleInputChange('overview', e.target.value)}
            placeholder="صف مشروعك بالتفصيل: ما هو، لماذا مهم، كيف سيحل مشكلة معينة..."
            className="min-h-[120px]"
          />
          <div className="mt-2 text-xs text-gray-500">
            {formData.overview.length}/100 حرف على الأقل
          </div>
        </CardContent>
      </Card>

      {/* Objectives */}
      <Card>
        <CardHeader>
          <CardTitle>أهداف المشروع *</CardTitle>
          <CardDescription>
            ما هي الأهداف الرئيسية التي تسعى لتحقيقها؟
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.objectives}
            onChange={(e) => handleInputChange('objectives', e.target.value)}
            placeholder="• زيادة الحصة السوقية بنسبة 15%&#10;• تحقيق عائد استثمار 25%&#10;• توظيف 50 شخص خلال السنة الأولى"
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Target Market */}
      <Card>
        <CardHeader>
          <CardTitle>السوق المستهدف *</CardTitle>
          <CardDescription>
            من هم عملاؤك المستهدفون؟
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.targetMarket}
            onChange={(e) => handleInputChange('targetMarket', e.target.value)}
            placeholder="صف السوق المستهدف: الفئة العمرية، المستوى الاقتصادي، الاهتمامات..."
            className="min-h-[80px]"
          />
        </CardContent>
      </Card>

      {/* Key Success Factors */}
      <Card>
        <CardHeader>
          <CardTitle>عوامل النجاح الرئيسية</CardTitle>
          <CardDescription>
            ما هي العوامل التي ستضمن نجاح مشروعك؟
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSuccessFactor}
              onChange={(e) => setNewSuccessFactor(e.target.value)}
              placeholder="أضف عامل نجاح..."
              onKeyPress={(e) => e.key === 'Enter' && addSuccessFactor()}
            />
            <Button onClick={addSuccessFactor} variant="outline">
              إضافة
            </Button>
          </div>
          
          {formData.keySuccessFactors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.keySuccessFactors.map((factor, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                  onClick={() => removeSuccessFactor(factor)}
                >
                  {factor} ×
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitive Advantage */}
      <Card>
        <CardHeader>
          <CardTitle>الميزة التنافسية</CardTitle>
          <CardDescription>
            ما الذي يميز مشروعك عن المنافسين؟
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.competitiveAdvantage}
            onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
            placeholder="صف كيف يتميز مشروعك: التقنية المستخدمة، الخدمة المقدمة، نموذج العمل..."
            className="min-h-[80px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
