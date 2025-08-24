'use client';

import { useEffect, useState } from 'react';
import { useStudyWizard } from '@/contexts/StudyWizardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, FileText, Users, TrendingUp, DollarSign, Settings, AlertTriangle, Calendar, Download } from 'lucide-react';

export default function ReviewStep() {
  const { state, updateData, updateStepStatus, setError, clearError } = useStudyWizard();
  const [formData, setFormData] = useState({
    studyTitle: '',
    finalRecommendation: '',
    nextSteps: '',
    additionalNotes: '',
    isReady: false,
  });

  useEffect(() => {
    const existingData = state.data.review;
    if (existingData) {
      setFormData(existingData);
    }
  }, [state.data.review]);

  useEffect(() => {
    const isValid = validateForm();
    const isCompleted = isValid && formData.studyTitle.trim() && formData.finalRecommendation.trim();
    
    updateData({ review: formData });
    updateStepStatus(5, isCompleted, isValid);
  }, [formData, updateData, updateStepStatus]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.studyTitle.trim()) {
      errors.push('عنوان الدراسة مطلوب');
    }

    if (!formData.finalRecommendation.trim()) {
      errors.push('التوصية النهائية مطلوبة');
    }

    if (errors.length > 0) {
      setError('review', errors.join('، '));
      return false;
    } else {
      clearError('review');
      return true;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // حساب إجمالي المؤشرات المالية
  const getFinancialSummary = () => {
    const financial = state.data.financialAnalysis;
    if (!financial) return null;

    const totalRevenue = financial.projections?.reduce((sum, proj) => sum + (proj.revenue || 0), 0) || 0;
    const totalExpenses = financial.expenseCategories?.reduce((sum, cat) => sum + (cat.amount || 0), 0) || 0;
    const initialInvestment = financial.initialInvestment || 0;

    return {
      totalRevenue,
      totalExpenses,
      initialInvestment,
      netProfit: totalRevenue - totalExpenses,
      roi: initialInvestment > 0 ? ((totalRevenue - totalExpenses - initialInvestment) / initialInvestment * 100) : 0,
    };
  };

  const financialSummary = getFinancialSummary();

  // حساب عدد المخاطر حسب المستوى
  const getRiskSummary = () => {
    const risks = state.data.riskAssessment?.risks || [];
    return {
      total: risks.length,
      high: risks.filter(risk => {
        const probValue = risk.probability === 'low' ? 1 : risk.probability === 'medium' ? 2 : 3;
        const impactValue = risk.impact === 'low' ? 1 : risk.impact === 'medium' ? 2 : 3;
        return probValue * impactValue >= 6;
      }).length,
      medium: risks.filter(risk => {
        const probValue = risk.probability === 'low' ? 1 : risk.probability === 'medium' ? 2 : 3;
        const impactValue = risk.impact === 'low' ? 1 : risk.impact === 'medium' ? 2 : 3;
        const score = probValue * impactValue;
        return score >= 3 && score < 6;
      }).length,
      low: risks.filter(risk => {
        const probValue = risk.probability === 'low' ? 1 : risk.probability === 'medium' ? 2 : 3;
        const impactValue = risk.impact === 'low' ? 1 : risk.impact === 'medium' ? 2 : 3;
        return probValue * impactValue < 3;
      }).length,
    };
  };

  const riskSummary = getRiskSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          المراجعة النهائية
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          راجع جميع أقسام الدراسة وقدم التوصيات النهائية
        </p>
      </div>

      {/* Study Title */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الدراسة الأساسية *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="studyTitle">عنوان الدراسة *</Label>
            <Input
              id="studyTitle"
              value={formData.studyTitle}
              onChange={(e) => handleInputChange('studyTitle', e.target.value)}
              placeholder="أدخل عنوان الدراسة النهائي..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">تاريخ الإنشاء:</span> {new Date().toLocaleDateString('ar-SA')}
            </div>
            <div>
              <span className="font-medium">حالة الدراسة:</span>
              <Badge className="mr-2" variant="outline">
                {state.currentStep === 5 ? 'قيد المراجعة' : 'مكتملة'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary Review */}
      {state.data.executiveSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              الملخص التنفيذي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">فكرة المشروع</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {state.data.executiveSummary.projectIdea || 'غير محدد'}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">الأهداف</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {state.data.executiveSummary.objectives || 'غير محدد'}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">الجمهور المستهدف</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {state.data.executiveSummary.targetAudience || 'غير محدد'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Analysis Review */}
      {state.data.marketAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              تحليل السوق
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {state.data.marketAnalysis.marketSize || 'غير محدد'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">حجم السوق</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {state.data.marketAnalysis.growthRate || 'غير محدد'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">معدل النمو</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {state.data.marketAnalysis.customerSegments?.length || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">شرائح العملاء</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">المنافسون الرئيسيون</h4>
              <div className="flex flex-wrap gap-2">
                {state.data.marketAnalysis.competitors?.slice(0, 5).map((competitor, idx) => (
                  <Badge key={idx} variant="outline">
                    {competitor.name}
                  </Badge>
                )) || <span className="text-sm text-gray-500">لا يوجد منافسون محددون</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Analysis Review */}
      {financialSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              التحليل المالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {financialSummary.totalRevenue.toLocaleString()} ر.س
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">إجمالي الإيرادات</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {financialSummary.totalExpenses.toLocaleString()} ر.س
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">إجمالي المصروفات</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {financialSummary.netProfit.toLocaleString()} ر.س
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">صافي الربح</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {financialSummary.roi.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">عائد الاستثمار</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Analysis Review */}
      {state.data.technicalAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              التحليل التقني
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">المتطلبات التقنية</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {state.data.technicalAnalysis.technicalRequirements?.length || 0} متطلب تقني محدد
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">التقنيات المستخدمة</h4>
              <div className="flex flex-wrap gap-2">
                {state.data.technicalAnalysis.technologies?.slice(0, 6).map((tech, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tech.name}
                  </Badge>
                )) || <span className="text-sm text-gray-500">لا توجد تقنيات محددة</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            تقييم المخاطر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                {riskSummary.total}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">إجمالي المخاطر</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                {riskSummary.high}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">مخاطر عالية</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                {riskSummary.medium}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">مخاطر متوسطة</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {riskSummary.low}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">مخاطر منخفضة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            التوصية النهائية *
          </CardTitle>
          <CardDescription>
            بناءً على التحليل الشامل، ما هي توصيتك النهائية للمشروع؟
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.finalRecommendation}
            onChange={(e) => handleInputChange('finalRecommendation', e.target.value)}
            placeholder="اكتب التوصية النهائية: هل تنصح بالمضي قدماً في المشروع؟ ما هي الشروط والتعديلات المقترحة؟"
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            الخطوات التالية
          </CardTitle>
          <CardDescription>
            ما هي الخطوات العملية التالية لتنفيذ المشروع؟
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.nextSteps}
            onChange={(e) => handleInputChange('nextSteps', e.target.value)}
            placeholder="حدد الخطوات التالية: الحصول على تمويل، تشكيل الفريق، بدء التطوير، إطلاق تجريبي..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>ملاحظات إضافية</CardTitle>
          <CardDescription>
            أي ملاحظات أو توضيحات إضافية تود إضافتها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.additionalNotes}
            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
            placeholder="أضف أي ملاحظات أو توضيحات إضافية..."
            className="min-h-[80px]"
          />
        </CardContent>
      </Card>

      {/* Study Completion Status */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">حالة إكمال الدراسة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">مراحل الدراسة المكتملة:</span>
              <Badge variant="outline">
                {state.steps.filter(step => step.completed).length} / {state.steps.length}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ 
                  width: `${(state.steps.filter(step => step.completed).length / state.steps.length) * 100}%` 
                }}
              ></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {state.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle 
                    className={`h-4 w-4 ${
                      step.completed 
                        ? 'text-green-600' 
                        : step.valid 
                        ? 'text-yellow-600' 
                        : 'text-gray-400'
                    }`} 
                  />
                  <span className={step.completed ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
