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
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Server, Users, Shield, Zap, Plus, Trash2 } from 'lucide-react';

interface TechnicalRequirement {
  category: string;
  requirement: string;
  priority: 'high' | 'medium' | 'low';
  status: 'required' | 'optional' | 'future';
}

interface Technology {
  name: string;
  category: string;
  purpose: string;
  alternatives: string[];
}

const REQUIREMENT_CATEGORIES = [
  'الأجهزة والبنية التحتية',
  'البرمجيات والتطبيقات',
  'الشبكات والاتصالات',
  'الأمان والحماية',
  'التخزين والنسخ الاحتياطي',
  'الصيانة والدعم',
];

const TECHNOLOGY_CATEGORIES = [
  'لغات البرمجة',
  'قواعد البيانات',
  'الخوادم والاستضافة',
  'أدوات التطوير',
  'أنظمة إدارة المحتوى',
  'منصات التجارة الإلكترونية',
];

export default function TechnicalAnalysisStep() {
  const { state, updateData, updateStepStatus, setError, clearError } = useStudyWizard();
  const [formData, setFormData] = useState({
    technicalRequirements: [] as TechnicalRequirement[],
    technologies: [] as Technology[],
    infrastructure: '',
    scalabilityPlan: '',
    securityMeasures: '',
    maintenancePlan: '',
    developmentTimeline: '',
    technicalRisks: '',
    qualityAssurance: '',
    documentationPlan: '',
    trainingPlan: '',
  });

  const [newRequirement, setNewRequirement] = useState<TechnicalRequirement>({
    category: '',
    requirement: '',
    priority: 'medium',
    status: 'required',
  });

  const [newTechnology, setNewTechnology] = useState<Technology>({
    name: '',
    category: '',
    purpose: '',
    alternatives: [],
  });

  const [newAlternative, setNewAlternative] = useState('');

  // تحميل البيانات من الحالة
  useEffect(() => {
    const existingData = state.data.technicalAnalysis;
    if (existingData) {
      setFormData({
        technicalRequirements: existingData.technicalRequirements || [],
        technologies: existingData.technologies || [],
        infrastructure: existingData.infrastructure || '',
        scalabilityPlan: existingData.scalabilityPlan || '',
        securityMeasures: existingData.securityMeasures || '',
        maintenancePlan: existingData.maintenancePlan || '',
        developmentTimeline: existingData.developmentTimeline || '',
        technicalRisks: existingData.technicalRisks || '',
        qualityAssurance: existingData.qualityAssurance || '',
        documentationPlan: existingData.documentationPlan || '',
        trainingPlan: existingData.trainingPlan || '',
      });
    }
  }, [state.data.technicalAnalysis]);

  // تحديث البيانات والتحقق من الصحة
  useEffect(() => {
    const isValid = validateForm();
    const isCompleted = isValid && formData.technicalRequirements.length > 0 && formData.infrastructure.trim();
    
    updateData({
      technicalAnalysis: formData,
    });
    
    updateStepStatus(3, Boolean(isCompleted), isValid);
  }, [formData, updateData, updateStepStatus]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (formData.technicalRequirements.length === 0) {
      errors.push('يجب إضافة متطلبات تقنية');
    }

    if (!formData.infrastructure.trim()) {
      errors.push('وصف البنية التحتية مطلوب');
    }

    if (!formData.securityMeasures.trim()) {
      errors.push('إجراءات الأمان مطلوبة');
    }

    if (errors.length > 0) {
      setError('technicalAnalysis', errors.join('، '));
      return false;
    } else {
      clearError('technicalAnalysis');
      return true;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // إدارة المتطلبات التقنية
  const addRequirement = () => {
    if (newRequirement.category && newRequirement.requirement.trim()) {
      setFormData(prev => ({
        ...prev,
        technicalRequirements: [...prev.technicalRequirements, { ...newRequirement }],
      }));
      setNewRequirement({
        category: '',
        requirement: '',
        priority: 'medium',
        status: 'required',
      });
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technicalRequirements: prev.technicalRequirements.filter((_, i) => i !== index),
    }));
  };

  // إدارة التقنيات
  const addTechnology = () => {
    if (newTechnology.name.trim() && newTechnology.category) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, { ...newTechnology }],
      }));
      setNewTechnology({
        name: '',
        category: '',
        purpose: '',
        alternatives: [],
      });
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const addAlternativeToTechnology = () => {
    if (newAlternative.trim()) {
      setNewTechnology(prev => ({
        ...prev,
        alternatives: [...prev.alternatives, newAlternative.trim()],
      }));
      setNewAlternative('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'required':
        return 'bg-blue-100 text-blue-800';
      case 'optional':
        return 'bg-gray-100 text-gray-800';
      case 'future':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4">
          <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          التحليل التقني
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          حدد المتطلبات التقنية والتقنيات المطلوبة للمشروع
        </p>
      </div>

      {/* Technical Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            المتطلبات التقنية *
          </CardTitle>
          <CardDescription>
            حدد المتطلبات التقنية اللازمة لتنفيذ المشروع
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Requirement */}
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">إضافة متطلب تقني</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="reqCategory">الفئة</Label>
                <Select
                  value={newRequirement.category}
                  onValueChange={(value) => setNewRequirement(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUIREMENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>الأولوية</Label>
                  <Select
                    value={newRequirement.priority}
                    onValueChange={(value: 'high' | 'medium' | 'low') => 
                      setNewRequirement(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">عالية</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="low">منخفضة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الحالة</Label>
                  <Select
                    value={newRequirement.status}
                    onValueChange={(value: 'required' | 'optional' | 'future') => 
                      setNewRequirement(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="required">مطلوب</SelectItem>
                      <SelectItem value="optional">اختياري</SelectItem>
                      <SelectItem value="future">مستقبلي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="reqDescription">وصف المتطلب</Label>
              <Textarea
                id="reqDescription"
                value={newRequirement.requirement}
                onChange={(e) => setNewRequirement(prev => ({ ...prev, requirement: e.target.value }))}
                placeholder="صف المتطلب التقني بالتفصيل..."
                className="min-h-[60px]"
              />
            </div>
            <Button onClick={addRequirement} className="w-full" variant="outline">
              <Plus className="h-4 w-4 ml-2" />
              إضافة المتطلب
            </Button>
          </div>

          {/* Existing Requirements */}
          {formData.technicalRequirements.map((req, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {req.category}
                    </h4>
                    <Badge className={getPriorityColor(req.priority)}>
                      أولوية {req.priority === 'high' ? 'عالية' : req.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                    </Badge>
                    <Badge className={getStatusColor(req.status)}>
                      {req.status === 'required' ? 'مطلوب' : req.status === 'optional' ? 'اختياري' : 'مستقبلي'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {req.requirement}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            التقنيات المستخدمة
          </CardTitle>
          <CardDescription>
            حدد التقنيات والأدوات التي ستستخدمها
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Technology */}
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">إضافة تقنية</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="techName">اسم التقنية</Label>
                <Input
                  id="techName"
                  value={newTechnology.name}
                  onChange={(e) => setNewTechnology(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: React.js"
                />
              </div>
              <div>
                <Label htmlFor="techCategory">الفئة</Label>
                <Select
                  value={newTechnology.category}
                  onValueChange={(value) => setNewTechnology(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {TECHNOLOGY_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="techPurpose">الغرض من الاستخدام</Label>
              <Input
                id="techPurpose"
                value={newTechnology.purpose}
                onChange={(e) => setNewTechnology(prev => ({ ...prev, purpose: e.target.value }))}
                placeholder="مثال: تطوير واجهة المستخدم"
              />
            </div>
            <div>
              <Label>البدائل المتاحة</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newAlternative}
                  onChange={(e) => setNewAlternative(e.target.value)}
                  placeholder="أضف بديل..."
                  onKeyPress={(e) => e.key === 'Enter' && addAlternativeToTechnology()}
                />
                <Button onClick={addAlternativeToTechnology} variant="outline" size="sm">
                  إضافة
                </Button>
              </div>
              {newTechnology.alternatives.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newTechnology.alternatives.map((alt, idx) => (
                    <Badge key={idx} variant="outline">
                      {alt}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={addTechnology} className="w-full" variant="outline">
              <Plus className="h-4 w-4 ml-2" />
              إضافة التقنية
            </Button>
          </div>

          {/* Existing Technologies */}
          {formData.technologies.map((tech, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {tech.name}
                    </h4>
                    <Badge variant="secondary">
                      {tech.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {tech.purpose}
                  </p>
                  {tech.alternatives.length > 0 && (
                    <div>
                      <span className="text-xs text-gray-500">البدائل: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tech.alternatives.map((alt, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {alt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTechnology(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Infrastructure & Architecture */}
      <Card>
        <CardHeader>
          <CardTitle>البنية التحتية والمعمارية *</CardTitle>
          <CardDescription>
            صف البنية التحتية والمعمارية للنظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.infrastructure}
            onChange={(e) => handleInputChange('infrastructure', e.target.value)}
            placeholder="صف البنية التحتية: الخوادم، قواعد البيانات، الشبكات، التخزين..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Security & Scalability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              إجراءات الأمان *
            </CardTitle>
            <CardDescription>
              كيف ستحمي النظام والبيانات؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.securityMeasures}
              onChange={(e) => handleInputChange('securityMeasures', e.target.value)}
              placeholder="مثال: تشفير البيانات، جدار حماية، مصادقة ثنائية..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>خطة التوسع والنمو</CardTitle>
            <CardDescription>
              كيف سيتعامل النظام مع النمو؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.scalabilityPlan}
              onChange={(e) => handleInputChange('scalabilityPlan', e.target.value)}
              placeholder="مثال: التوسع الأفقي، استخدام CDN، تحسين قاعدة البيانات..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Development & Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الجدول الزمني للتطوير</CardTitle>
            <CardDescription>
              ما هي مراحل التطوير والجدول الزمني؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.developmentTimeline}
              onChange={(e) => handleInputChange('developmentTimeline', e.target.value)}
              placeholder="مثال: المرحلة الأولى (3 أشهر): تطوير النواة، المرحلة الثانية..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>خطة الصيانة والدعم</CardTitle>
            <CardDescription>
              كيف ستحافظ على النظام وتدعمه؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.maintenancePlan}
              onChange={(e) => handleInputChange('maintenancePlan', e.target.value)}
              placeholder="مثال: صيانة دورية، مراقبة الأداء، نسخ احتياطية..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Quality & Documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ضمان الجودة والاختبار</CardTitle>
            <CardDescription>
              كيف ستضمن جودة النظام؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.qualityAssurance}
              onChange={(e) => handleInputChange('qualityAssurance', e.target.value)}
              placeholder="مثال: اختبارات آلية، مراجعة الكود، اختبارات الأداء..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>خطة التوثيق</CardTitle>
            <CardDescription>
              ما هي الوثائق التي ستحتاجها؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.documentationPlan}
              onChange={(e) => handleInputChange('documentationPlan', e.target.value)}
              placeholder="مثال: دليل المستخدم، وثائق API، دليل المطور..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Training & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              خطة التدريب
            </CardTitle>
            <CardDescription>
              كيف ستدرب الفريق والمستخدمين؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.trainingPlan}
              onChange={(e) => handleInputChange('trainingPlan', e.target.value)}
              placeholder="مثال: تدريب الفريق التقني، دورات للمستخدمين، مواد تعليمية..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المخاطر التقنية</CardTitle>
            <CardDescription>
              ما هي المخاطر التقنية المحتملة؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.technicalRisks}
              onChange={(e) => handleInputChange('technicalRisks', e.target.value)}
              placeholder="مثال: عدم توافق التقنيات، مشاكل الأداء، نقص المهارات..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
