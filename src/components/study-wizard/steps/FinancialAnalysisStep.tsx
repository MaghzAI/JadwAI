'use client';

import { useEffect, useState } from 'react';
import { useStudyWizard } from '@/contexts/StudyWizardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Calculator, TrendingUp, BarChart, AlertTriangle, PieChart } from 'lucide-react';

interface FinancialProjection {
  year: number;
  revenue: number;
  costs: number;
  grossProfit: number;
  netProfit: number;
}

interface ExpenseCategory {
  name: string;
  amount: number;
  type: 'fixed' | 'variable';
  description: string;
}

export default function FinancialAnalysisStep() {
  const { state, updateData, updateStepStatus, setError, clearError } = useStudyWizard();
  const [formData, setFormData] = useState({
    initialInvestment: 0,
    workingCapital: 0,
    projectedRevenue: [] as FinancialProjection[],
    expenseCategories: [] as ExpenseCategory[],
    revenueGrowthRate: 0,
    profitMargin: 0,
    breakEvenPoint: 0,
    returnOnInvestment: 0,
    paybackPeriod: 0,
    fundingSources: '',
    riskFactors: '',
    assumptions: '',
    sensitivityAnalysis: '',
  });

  const [newExpense, setNewExpense] = useState<ExpenseCategory>({
    name: '',
    amount: 0,
    type: 'fixed',
    description: '',
  });

  // تحميل البيانات من الحالة
  useEffect(() => {
    const existingData = state.data.financialAnalysis;
    if (existingData) {
      setFormData({
        initialInvestment: existingData.initialInvestment || 0,
        workingCapital: existingData.workingCapital || 0,
        projectedRevenue: existingData.projectedRevenue || generateInitialProjections(),
        expenseCategories: existingData.expenseCategories || [],
        revenueGrowthRate: existingData.revenueGrowthRate || 10,
        profitMargin: existingData.profitMargin || 20,
        breakEvenPoint: existingData.breakEvenPoint || 0,
        returnOnInvestment: existingData.returnOnInvestment || 0,
        paybackPeriod: existingData.paybackPeriod || 0,
        fundingSources: existingData.fundingSources || '',
        riskFactors: existingData.riskFactors || '',
        assumptions: existingData.assumptions || '',
        sensitivityAnalysis: existingData.sensitivityAnalysis || '',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        projectedRevenue: generateInitialProjections(),
      }));
    }
  }, [state.data.financialAnalysis]);

  // حساب تلقائي للمؤشرات المالية
  useEffect(() => {
    calculateFinancialMetrics();
  }, [formData.initialInvestment, formData.projectedRevenue, formData.expenseCategories]);

  // تحديث البيانات والتحقق من الصحة
  useEffect(() => {
    const isValid = validateForm();
    const isCompleted = isValid && formData.initialInvestment > 0 && formData.projectedRevenue.length > 0;
    
    updateData({
      financialAnalysis: formData,
    });
    
    updateStepStatus(2, isCompleted, isValid);
  }, [formData, updateData, updateStepStatus]);

  const generateInitialProjections = (): FinancialProjection[] => {
    return Array.from({ length: 5 }, (_, index) => ({
      year: index + 1,
      revenue: 0,
      costs: 0,
      grossProfit: 0,
      netProfit: 0,
    }));
  };

  const calculateFinancialMetrics = () => {
    const totalRevenue = formData.projectedRevenue.reduce((sum, p) => sum + p.revenue, 0);
    const totalProfit = formData.projectedRevenue.reduce((sum, p) => sum + p.netProfit, 0);
    
    if (formData.initialInvestment > 0) {
      const roi = ((totalProfit - formData.initialInvestment) / formData.initialInvestment) * 100;
      setFormData(prev => ({ ...prev, returnOnInvestment: Math.round(roi * 100) / 100 }));
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (formData.initialInvestment <= 0) {
      errors.push('الاستثمار الأولي مطلوب');
    }

    if (formData.projectedRevenue.every(p => p.revenue === 0)) {
      errors.push('يجب إدخال توقعات الإيرادات');
    }

    if (formData.expenseCategories.length === 0) {
      errors.push('يجب إضافة بند مصروفات واحد على الأقل');
    }

    if (errors.length > 0) {
      setError('financialAnalysis', errors.join('، '));
      return false;
    } else {
      clearError('financialAnalysis');
      return true;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateProjection = (year: number, field: keyof FinancialProjection, value: number) => {
    setFormData(prev => ({
      ...prev,
      projectedRevenue: prev.projectedRevenue.map(p => 
        p.year === year 
          ? { 
              ...p, 
              [field]: value,
              grossProfit: field === 'revenue' || field === 'costs' 
                ? (field === 'revenue' ? value : p.revenue) - (field === 'costs' ? value : p.costs)
                : p.grossProfit,
              netProfit: field === 'revenue' || field === 'costs'
                ? ((field === 'revenue' ? value : p.revenue) - (field === 'costs' ? value : p.costs)) * 0.8
                : p.netProfit
            }
          : p
      ),
    }));
  };

  const addExpenseCategory = () => {
    if (newExpense.name && newExpense.amount > 0) {
      setFormData(prev => ({
        ...prev,
        expenseCategories: [...prev.expenseCategories, { ...newExpense }],
      }));
      setNewExpense({ name: '', amount: 0, type: 'fixed', description: '' });
    }
  };

  const removeExpenseCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expenseCategories: prev.expenseCategories.filter((_, i) => i !== index),
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg mb-4">
          <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          التحليل المالي
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          ادرس الجوانب المالية للمشروع والعائد المتوقع
        </p>
      </div>

      {/* Initial Investment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              الاستثمار الأولي
            </CardTitle>
            <CardDescription>
              رأس المال المطلوب لبدء المشروع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="initialInvestment">الاستثمار الأولي (ريال) *</Label>
              <Input
                id="initialInvestment"
                type="number"
                value={formData.initialInvestment || ''}
                onChange={(e) => handleInputChange('initialInvestment', Number(e.target.value))}
                placeholder="1000000"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="workingCapital">رأس المال العامل (ريال)</Label>
              <Input
                id="workingCapital"
                type="number"
                value={formData.workingCapital || ''}
                onChange={(e) => handleInputChange('workingCapital', Number(e.target.value))}
                placeholder="500000"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              مصادر التمويل
            </CardTitle>
            <CardDescription>
              كيف ستحصل على رأس المال؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.fundingSources}
              onChange={(e) => handleInputChange('fundingSources', e.target.value)}
              placeholder="مثال: 60% تمويل ذاتي، 30% قرض بنكي، 10% مستثمر"
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Revenue Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            توقعات الإيرادات (5 سنوات)
          </CardTitle>
          <CardDescription>
            ادخل التوقعات المالية لكل سنة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">السنة</th>
                  <th className="text-right p-2">الإيرادات</th>
                  <th className="text-right p-2">التكاليف</th>
                  <th className="text-right p-2">الربح الإجمالي</th>
                  <th className="text-right p-2">الربح الصافي</th>
                </tr>
              </thead>
              <tbody>
                {formData.projectedRevenue.map((projection) => (
                  <tr key={projection.year} className="border-b">
                    <td className="p-2 font-medium">السنة {projection.year}</td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={projection.revenue || ''}
                        onChange={(e) => updateProjection(projection.year, 'revenue', Number(e.target.value))}
                        placeholder="0"
                        className="w-32"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={projection.costs || ''}
                        onChange={(e) => updateProjection(projection.year, 'costs', Number(e.target.value))}
                        placeholder="0"
                        className="w-32"
                      />
                    </td>
                    <td className="p-2 text-green-600">
                      {formatCurrency(projection.grossProfit)}
                    </td>
                    <td className="p-2 text-blue-600 font-medium">
                      {formatCurrency(projection.netProfit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle>بنود المصروفات</CardTitle>
          <CardDescription>
            صنف مصروفاتك إلى بنود رئيسية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Expense */}
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">إضافة بند مصروفات</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="expenseName">اسم البند</Label>
                <Input
                  id="expenseName"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: الرواتب"
                />
              </div>
              <div>
                <Label htmlFor="expenseAmount">المبلغ (ريال)</Label>
                <Input
                  id="expenseAmount"
                  type="number"
                  value={newExpense.amount || ''}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="expenseType">النوع</Label>
                <Select
                  value={newExpense.type}
                  onValueChange={(value: 'fixed' | 'variable') => setNewExpense(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">تكلفة ثابتة</SelectItem>
                    <SelectItem value="variable">تكلفة متغيرة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="expenseDescription">الوصف</Label>
              <Input
                id="expenseDescription"
                value={newExpense.description}
                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر للبند"
              />
            </div>
            <Button onClick={addExpenseCategory} className="w-full" variant="outline">
              إضافة البند
            </Button>
          </div>

          {/* Existing Expenses */}
          {formData.expenseCategories.map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{expense.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    expense.type === 'fixed' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {expense.type === 'fixed' ? 'ثابت' : 'متغير'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {expense.description} • {formatCurrency(expense.amount)}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExpenseCategory(index)}
                className="text-red-600 hover:text-red-700"
              >
                حذف
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            المؤشرات المالية
          </CardTitle>
          <CardDescription>
            النسب والمؤشرات المحسوبة تلقائياً
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formData.returnOnInvestment.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                العائد على الاستثمار
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formData.paybackPeriod || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                فترة الاسترداد (سنة)
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {formData.breakEvenPoint || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                نقطة التعادل (شهر)
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formData.profitMargin.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                هامش الربح
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis & Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              المخاطر المالية
            </CardTitle>
            <CardDescription>
              ما هي المخاطر التي قد تؤثر على النتائج المالية؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.riskFactors}
              onChange={(e) => handleInputChange('riskFactors', e.target.value)}
              placeholder="مثال: تقلبات أسعار المواد الخام، تغيير أسعار الفائدة، منافسة شديدة..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الافتراضات المالية</CardTitle>
            <CardDescription>
              ما هي الافتراضات التي بُنيت عليها التوقعات؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.assumptions}
              onChange={(e) => handleInputChange('assumptions', e.target.value)}
              placeholder="مثال: نمو السوق 10% سنوياً، استقرار أسعار الصرف، عدم تغيير القوانين..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Sensitivity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>تحليل الحساسية</CardTitle>
          <CardDescription>
            كيف ستتأثر النتائج المالية بتغيير العوامل الرئيسية؟
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.sensitivityAnalysis}
            onChange={(e) => handleInputChange('sensitivityAnalysis', e.target.value)}
            placeholder="مثال: انخفاض الإيرادات 20% يقلل الربح إلى... ، زيادة التكاليف 15% تؤدي إلى..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
