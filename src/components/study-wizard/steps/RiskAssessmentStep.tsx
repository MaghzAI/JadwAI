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
import { AlertTriangle, Plus, Trash2, Shield, TrendingDown, Sparkles } from 'lucide-react';
import { ContentGenerator } from '@/components/ai/ContentGenerator';

interface Risk {
  category: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  contingency: string;
}

const RISK_CATEGORIES = [
  'مالية',
  'تقنية',
  'تشغيلية',
  'قانونية',
  'بيئية',
  'سوقية',
  'تنافسية',
  'موارد بشرية',
];

export default function RiskAssessmentStep() {
  const { state, updateData, updateStepStatus, setError, clearError } = useStudyWizard();
  const [formData, setFormData] = useState({
    risks: [] as Risk[],
    overallRiskLevel: 'medium' as 'low' | 'medium' | 'high',
    riskManagementStrategy: '',
    contingencyPlan: '',
    riskMonitoring: '',
    successFactors: '',
    assumptions: '',
  });

  const [newRisk, setNewRisk] = useState<Risk>({
    category: '',
    description: '',
    probability: 'medium',
    impact: 'medium',
    mitigation: '',
    contingency: '',
  });

  useEffect(() => {
    const existingData = state.data.riskAssessment;
    if (existingData) {
      setFormData({
        risks: existingData.risks || [],
        overallRiskLevel: existingData.overallRiskLevel || 'medium',
        riskManagementStrategy: existingData.riskManagementStrategy || existingData.mitigation?.join('\n') || '',
        contingencyPlan: existingData.contingencyPlan || '',
        riskMonitoring: existingData.riskMonitoring || existingData.monitoring || '',
        successFactors: existingData.successFactors || '',
        assumptions: existingData.assumptions || '',
      });
    }
  }, [state.data.riskAssessment]);

  useEffect(() => {
    const isValid = validateForm();
    const isCompleted = isValid && formData.risks.length > 0;
    
    updateData({ riskAssessment: formData });
    updateStepStatus(4, isCompleted, isValid);
  }, [formData, updateData, updateStepStatus]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (formData.risks.length === 0) {
      errors.push('يجب إضافة مخاطر');
    }

    if (!formData.riskManagementStrategy.trim()) {
      errors.push('استراتيجية إدارة المخاطر مطلوبة');
    }

    if (errors.length > 0) {
      setError('riskAssessment', errors.join('، '));
      return false;
    } else {
      clearError('riskAssessment');
      return true;
    }
  };

  const addRisk = () => {
    if (newRisk.category && newRisk.description.trim()) {
      setFormData(prev => ({
        ...prev,
        risks: [...prev.risks, { ...newRisk }],
      }));
      setNewRisk({
        category: '',
        description: '',
        probability: 'medium',
        impact: 'medium',
        mitigation: '',
        contingency: '',
      });
    }
  };

  const removeRisk = (index: number) => {
    setFormData(prev => ({
      ...prev,
      risks: prev.risks.filter((_, i) => i !== index),
    }));
  };

  const handleAIContentGenerated = (aiContent: any) => {
    if (Array.isArray(aiContent)) {
      const aiRisks: Risk[] = aiContent.map(risk => ({
        category: risk.category || 'عامة',
        description: risk.description || 'مخاطر غير محددة',
        probability: risk.probability || 'medium',
        impact: risk.impact || 'medium',
        mitigation: risk.mitigation || 'استراتيجية التخفيف',
        contingency: risk.contingency || 'خطة الطوارئ'
      }));
      
      setFormData(prev => ({
        ...prev,
        risks: [...prev.risks, ...aiRisks],
        overallRiskLevel: 'medium',
        riskManagementStrategy: 'استراتيجية شاملة لإدارة المخاطر المولدة بالذكاء الاصطناعي'
      }));
    }
  };

  const getRiskScore = (probability: string, impact: string): number => {
    const probValue = probability === 'low' ? 1 : probability === 'medium' ? 2 : 3;
    const impactValue = impact === 'low' ? 1 : impact === 'medium' ? 2 : 3;
    return probValue * impactValue;
  };

  const getRiskLevel = (score: number): string => {
    if (score <= 2) return 'منخفض';
    if (score <= 4) return 'متوسط';
    return 'عالي';
  };

  const getRiskColor = (score: number): string => {
    if (score <= 2) return 'bg-green-100 text-green-800';
    if (score <= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          تقييم المخاطر
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          حدد وقيّم المخاطر المحتملة ووضع استراتيجيات للتعامل معها
        </p>
      </div>

      {/* Risk Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>إضافة مخاطر جديدة *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>فئة المخاطرة</Label>
                <Select
                  value={newRisk.category}
                  onValueChange={(value) => setNewRisk(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>الاحتمالية</Label>
                  <Select
                    value={newRisk.probability}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setNewRisk(prev => ({ ...prev, probability: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفضة</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="high">عالية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>التأثير</Label>
                  <Select
                    value={newRisk.impact}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setNewRisk(prev => ({ ...prev, impact: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفض</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">عالي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <Label>وصف المخاطرة</Label>
              <Textarea
                value={newRisk.description}
                onChange={(e) => setNewRisk(prev => ({ ...prev, description: e.target.value }))}
                placeholder="صف المخاطرة بالتفصيل..."
                className="min-h-[60px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>استراتيجية التخفيف</Label>
                <Textarea
                  value={newRisk.mitigation}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, mitigation: e.target.value }))}
                  placeholder="كيف ستقلل من هذه المخاطرة؟"
                  className="min-h-[60px]"
                />
              </div>
              <div>
                <Label>الخطة البديلة</Label>
                <Textarea
                  value={newRisk.contingency}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, contingency: e.target.value }))}
                  placeholder="ماذا ستفعل إذا حدثت المخاطرة؟"
                  className="min-h-[60px]"
                />
              </div>
            </div>
            <Button onClick={addRisk} className="w-full" variant="outline">
              <Plus className="h-4 w-4 ml-2" />
              إضافة المخاطرة
            </Button>
          </div>

          {/* Existing Risks */}
          {formData.risks.map((risk, index) => {
            const riskScore = getRiskScore(risk.probability, risk.impact);
            const riskLevel = getRiskLevel(riskScore);
            const riskColor = getRiskColor(riskScore);

            return (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {risk.category}
                      </h4>
                      <Badge className={riskColor}>
                        {riskLevel} ({riskScore}/9)
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {risk.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">التخفيف:</span>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{risk.mitigation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">الخطة البديلة:</span>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{risk.contingency}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRisk(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Risk Management Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            استراتيجية إدارة المخاطر *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.riskManagementStrategy}
            onChange={(e) => setFormData(prev => ({ ...prev, riskManagementStrategy: e.target.value }))}
            placeholder="كيف ستدير المخاطر بشكل عام؟ ما هي الإجراءات والسياسات؟"
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Additional Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الخطة الطارئة</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.contingencyPlan}
              onChange={(e) => setFormData(prev => ({ ...prev, contingencyPlan: e.target.value }))}
              placeholder="ما هي الخطط الطارئة للمخاطر الحرجة؟"
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مراقبة المخاطر</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.riskMonitoring}
              onChange={(e) => setFormData(prev => ({ ...prev, riskMonitoring: e.target.value }))}
              placeholder="كيف ستراقب وتتابع المخاطر؟"
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Success Factors & Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              عوامل النجاح الحرجة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.successFactors}
              onChange={(e) => setFormData(prev => ({ ...prev, successFactors: e.target.value }))}
              placeholder="ما هي العوامل الأساسية لنجاح المشروع؟"
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الافتراضات الأساسية</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.assumptions}
              onChange={(e) => setFormData(prev => ({ ...prev, assumptions: e.target.value }))}
              placeholder="ما هي الافتراضات التي يعتمد عليها المشروع؟"
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Overall Risk Level */}
      <Card>
        <CardHeader>
          <CardTitle>مستوى المخاطر الإجمالي</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.overallRiskLevel}
            onValueChange={(value: 'low' | 'medium' | 'high') => 
              setFormData(prev => ({ ...prev, overallRiskLevel: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">منخفض</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="high">عالي</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* AI Content Generator */}
      <ContentGenerator 
        type="risk_assessment"
        projectData={{
          projectType: state.data.executiveSummary?.projectType || '',
          targetMarket: state.data.executiveSummary?.targetMarket || '',
          marketSize: state.data.marketAnalysis?.marketSize || '',
          investmentRange: state.data.executiveSummary?.investmentRange || ''
        }}
        onContentGenerated={handleAIContentGenerated}
        className="border-2 border-dashed border-orange-200 dark:border-orange-800"
      />
    </div>
  );
}
