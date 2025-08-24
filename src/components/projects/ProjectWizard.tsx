'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Calendar, 
  Users, 
  Target,
  Building2,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectData {
  // Basic Info
  name: string;
  description: string;
  category: string;
  location: string;
  
  // Financial
  initialInvestment: number;
  expectedRevenue: number;
  breakEvenMonths: number;
  fundingSource: string;
  
  // Timeline
  startDate: string;
  expectedDuration: number;
  milestones: string[];
  
  // Team
  teamSize: number;
  keyRoles: string[];
  externalConsultants: boolean;
  
  // Strategy
  marketSegment: string;
  competitiveAdvantage: string;
  riskFactors: string[];
}

const initialData: ProjectData = {
  name: '',
  description: '',
  category: '',
  location: '',
  initialInvestment: 0,
  expectedRevenue: 0,
  breakEvenMonths: 12,
  fundingSource: '',
  startDate: '',
  expectedDuration: 12,
  milestones: [],
  teamSize: 1,
  keyRoles: [],
  externalConsultants: false,
  marketSegment: '',
  competitiveAdvantage: '',
  riskFactors: []
};

const steps = [
  { id: 1, title: 'المعلومات الأساسية', icon: FileText },
  { id: 2, title: 'التخطيط المالي', icon: DollarSign },
  { id: 3, title: 'الجدول الزمني', icon: Calendar },
  { id: 4, title: 'الفريق والموارد', icon: Users },
  { id: 5, title: 'الاستراتيجية والمراجعة', icon: Target }
];

export function ProjectWizard({ onComplete, onCancel }: { 
  onComplete: (data: ProjectData) => void;
  onCancel: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateData = (field: keyof ProjectData, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!projectData.name) newErrors.name = 'اسم المشروع مطلوب';
        if (!projectData.description) newErrors.description = 'وصف المشروع مطلوب';
        if (!projectData.category) newErrors.category = 'فئة المشروع مطلوبة';
        break;
      case 2:
        if (projectData.initialInvestment <= 0) newErrors.initialInvestment = 'رأس المال يجب أن يكون أكبر من صفر';
        if (projectData.expectedRevenue <= 0) newErrors.expectedRevenue = 'الإيرادات المتوقعة مطلوبة';
        if (!projectData.fundingSource) newErrors.fundingSource = 'مصدر التمويل مطلوب';
        break;
      case 3:
        if (!projectData.startDate) newErrors.startDate = 'تاريخ البداية مطلوب';
        if (projectData.expectedDuration <= 0) newErrors.expectedDuration = 'مدة المشروع مطلوبة';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onComplete(projectData);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          معالج إنشاء مشروع جديد
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          اتبع الخطوات التالية لإنشاء مشروعك بطريقة منظمة ومدروسة
        </p>
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 mt-2">
            الخطوة {currentStep} من {steps.length}
          </p>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="flex justify-between mb-8 overflow-x-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center min-w-0">
              <div className={cn(
                "flex items-center space-x-2 space-x-reverse p-3 rounded-lg transition-colors",
                isActive ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" :
                isCompleted ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400" :
                "bg-gray-100 dark:bg-gray-800 text-gray-500"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
                <span className="text-sm font-medium whitespace-nowrap">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <BasicInfoStep 
              data={projectData} 
              updateData={updateData} 
              errors={errors} 
            />
          )}
          {currentStep === 2 && (
            <FinancialStep 
              data={projectData} 
              updateData={updateData} 
              errors={errors} 
            />
          )}
          {currentStep === 3 && (
            <TimelineStep 
              data={projectData} 
              updateData={updateData} 
              errors={errors} 
            />
          )}
          {currentStep === 4 && (
            <TeamStep 
              data={projectData} 
              updateData={updateData} 
              errors={errors} 
            />
          )}
          {currentStep === 5 && (
            <ReviewStep 
              data={projectData} 
              updateData={updateData} 
              errors={errors} 
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={currentStep === 1 ? onCancel : prevStep}
        >
          <ChevronLeft className="h-4 w-4 ml-2" />
          {currentStep === 1 ? 'إلغاء' : 'السابق'}
        </Button>
        
        <Button 
          onClick={currentStep === steps.length ? handleSubmit : nextStep}
        >
          {currentStep === steps.length ? 'إنشاء المشروع' : 'التالي'}
          {currentStep < steps.length && <ChevronRight className="h-4 w-4 mr-2" />}
        </Button>
      </div>
    </div>
  );
}

// Step Components
function BasicInfoStep({ data, updateData, errors }: any) {
  const categories = [
    'مطاعم ومقاهي',
    'تجارة إلكترونية',
    'تقنية ومعلومات',
    'تعليم وتدريب',
    'صحة وطب',
    'سياحة وضيافة',
    'صناعة وتصنيع',
    'خدمات مالية',
    'عقارات وإنشاءات',
    'زراعة وغذاء'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          المعلومات الأساسية للمشروع
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          ابدأ بتعريف مشروعك وتحديد المعلومات الأساسية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">اسم المشروع *</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => updateData('name', e.target.value)}
            placeholder="مثال: مطعم الأصالة العربية"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">فئة المشروع *</Label>
          <Select value={data.category} onValueChange={(value) => updateData('category', value)}>
            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر فئة المشروع" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">الموقع</Label>
          <div className="relative">
            <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="location"
              value={data.location}
              onChange={(e) => updateData('location', e.target.value)}
              placeholder="مثال: الرياض، المملكة العربية السعودية"
              className="pr-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">وصف المشروع *</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => updateData('description', e.target.value)}
          placeholder="اكتب وصفاً مفصلاً عن مشروعك، أهدافه، والخدمات أو المنتجات التي سيقدمها..."
          rows={4}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>
    </div>
  );
}

function FinancialStep({ data, updateData, errors }: any) {
  const fundingSources = [
    'تمويل شخصي',
    'قرض بنكي',
    'مستثمر ملاك',
    'صندوق استثماري',
    'شراكة تجارية',
    'تمويل جماعي',
    'برنامج حكومي',
    'أخرى'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          التخطيط المالي
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          حدد الاستثمار المطلوب والتوقعات المالية للمشروع
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="initialInvestment">رأس المال المطلوب (ريال سعودي) *</Label>
          <Input
            id="initialInvestment"
            type="number"
            value={data.initialInvestment}
            onChange={(e) => updateData('initialInvestment', parseFloat(e.target.value) || 0)}
            placeholder="500000"
            className={errors.initialInvestment ? 'border-red-500' : ''}
          />
          {errors.initialInvestment && <p className="text-sm text-red-500">{errors.initialInvestment}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedRevenue">الإيرادات المتوقعة سنوياً (ريال سعودي) *</Label>
          <Input
            id="expectedRevenue"
            type="number"
            value={data.expectedRevenue}
            onChange={(e) => updateData('expectedRevenue', parseFloat(e.target.value) || 0)}
            placeholder="1200000"
            className={errors.expectedRevenue ? 'border-red-500' : ''}
          />
          {errors.expectedRevenue && <p className="text-sm text-red-500">{errors.expectedRevenue}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="breakEvenMonths">فترة استرداد رأس المال (بالأشهر)</Label>
          <Input
            id="breakEvenMonths"
            type="number"
            value={data.breakEvenMonths}
            onChange={(e) => updateData('breakEvenMonths', parseInt(e.target.value) || 12)}
            placeholder="12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fundingSource">مصدر التمويل *</Label>
          <Select value={data.fundingSource} onValueChange={(value) => updateData('fundingSource', value)}>
            <SelectTrigger className={errors.fundingSource ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر مصدر التمويل" />
            </SelectTrigger>
            <SelectContent>
              {fundingSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fundingSource && <p className="text-sm text-red-500">{errors.fundingSource}</p>}
        </div>
      </div>

      {data.initialInvestment > 0 && data.expectedRevenue > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              مؤشرات مالية أولية
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 dark:text-blue-300">العائد على الاستثمار:</span>
                <span className="font-semibold mr-2">
                  {((data.expectedRevenue / data.initialInvestment - 1) * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300">نسبة الربح:</span>
                <span className="font-semibold mr-2">
                  {((data.expectedRevenue - data.initialInvestment) / data.expectedRevenue * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TimelineStep({ data, updateData, errors }: any) {
  const addMilestone = () => {
    const newMilestone = `معلم ${data.milestones.length + 1}`;
    updateData('milestones', [...data.milestones, newMilestone]);
  };

  const updateMilestone = (index: number, value: string) => {
    const updated = [...data.milestones];
    updated[index] = value;
    updateData('milestones', updated);
  };

  const removeMilestone = (index: number) => {
    const updated = data.milestones.filter((_: any, i: number) => i !== index);
    updateData('milestones', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          الجدول الزمني والمعالم
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          حدد التوقيت المتوقع للمشروع والمعالم المهمة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">تاريخ بداية المشروع *</Label>
          <Input
            id="startDate"
            type="date"
            value={data.startDate}
            onChange={(e) => updateData('startDate', e.target.value)}
            className={errors.startDate ? 'border-red-500' : ''}
          />
          {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedDuration">مدة المشروع (بالأشهر) *</Label>
          <Input
            id="expectedDuration"
            type="number"
            value={data.expectedDuration}
            onChange={(e) => updateData('expectedDuration', parseInt(e.target.value) || 12)}
            placeholder="12"
            className={errors.expectedDuration ? 'border-red-500' : ''}
          />
          {errors.expectedDuration && <p className="text-sm text-red-500">{errors.expectedDuration}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>المعالم والأهداف المرحلية</Label>
          <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
            إضافة معلم
          </Button>
        </div>
        
        {data.milestones.map((milestone: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={milestone}
              onChange={(e) => updateMilestone(index, e.target.value)}
              placeholder={`مثال: إطلاق موقع المشروع`}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => removeMilestone(index)}
              className="text-red-600 hover:text-red-700"
            >
              حذف
            </Button>
          </div>
        ))}
        
        {data.milestones.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            لم يتم إضافة معالم بعد. اضغط "إضافة معلم" لبدء تحديد المراحل المهمة
          </p>
        )}
      </div>
    </div>
  );
}

function TeamStep({ data, updateData, errors }: any) {
  const keyRoleOptions = [
    'مدير المشروع',
    'مدير مالي',
    'مدير تسويق',
    'مدير عمليات',
    'مطور تقني',
    'مصمم',
    'محاسب',
    'مستشار قانوني',
    'مدير مبيعات',
    'خدمة عملاء'
  ];

  const toggleRole = (role: string) => {
    const current = data.keyRoles;
    if (current.includes(role)) {
      updateData('keyRoles', current.filter((r: string) => r !== role));
    } else {
      updateData('keyRoles', [...current, role]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          الفريق والموارد البشرية
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          حدد احتياجات المشروع من الموارد البشرية والأدوار المطلوبة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="teamSize">حجم الفريق المتوقع</Label>
          <Input
            id="teamSize"
            type="number"
            value={data.teamSize}
            onChange={(e) => updateData('teamSize', parseInt(e.target.value) || 1)}
            placeholder="5"
            min="1"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="externalConsultants"
              checked={data.externalConsultants}
              onChange={(e) => updateData('externalConsultants', e.target.checked)}
            />
            <Label htmlFor="externalConsultants">
              هل تحتاج إلى استشاريين خارجيين؟
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>الأدوار والمناصب المطلوبة</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {keyRoleOptions.map((role) => (
            <div key={role} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={role}
                checked={data.keyRoles.includes(role)}
                onChange={() => toggleRole(role)}
              />
              <Label htmlFor={role} className="text-sm">
                {role}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {data.keyRoles.length > 0 && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              الأدوار المحددة ({data.keyRoles.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.keyRoles.map((role: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs rounded-full"
                >
                  {role}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ReviewStep({ data, updateData, errors }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          الاستراتيجية والمراجعة النهائية
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          راجع جميع المعلومات وأضف التفاصيل الاستراتيجية النهائية
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="marketSegment">الشريحة المستهدفة</Label>
          <Textarea
            id="marketSegment"
            value={data.marketSegment}
            onChange={(e) => updateData('marketSegment', e.target.value)}
            placeholder="اكتب عن العملاء المستهدفين والسوق الذي ستخدمه..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="competitiveAdvantage">الميزة التنافسية</Label>
          <Textarea
            id="competitiveAdvantage"
            value={data.competitiveAdvantage}
            onChange={(e) => updateData('competitiveAdvantage', e.target.value)}
            placeholder="ما الذي يميز مشروعك عن المنافسين؟"
            rows={3}
          />
        </div>

        {/* Project Summary */}
        <Card className="bg-gray-50 dark:bg-gray-900/50">
          <CardHeader>
            <CardTitle>ملخص المشروع</CardTitle>
            <CardDescription>
              مراجعة سريعة لجميع المعلومات المدخلة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>اسم المشروع:</strong> {data.name || 'غير محدد'}
              </div>
              <div>
                <strong>الفئة:</strong> {data.category || 'غير محدد'}
              </div>
              <div>
                <strong>الاستثمار المطلوب:</strong> {data.initialInvestment.toLocaleString()} ريال
              </div>
              <div>
                <strong>الإيرادات المتوقعة:</strong> {data.expectedRevenue.toLocaleString()} ريال
              </div>
              <div>
                <strong>مدة المشروع:</strong> {data.expectedDuration} شهر
              </div>
              <div>
                <strong>حجم الفريق:</strong> {data.teamSize} شخص
              </div>
            </div>
            
            {data.keyRoles.length > 0 && (
              <div>
                <strong>الأدوار المطلوبة:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.keyRoles.map((role: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
