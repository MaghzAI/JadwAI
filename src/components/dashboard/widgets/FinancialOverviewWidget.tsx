'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target,
  PieChart,
  BarChart3
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProjects } from '@/hooks/useProjects';
import { ProjectStatus } from '@prisma/client';

interface FinancialData {
  totalInvestment: number;
  expectedRevenue: number;
  actualRevenue: number;
  roi: number;
  profitMargin: number;
  monthlyGrowth: number;
  cashFlow: Array<{
    month: string;
    income: number;
    expenses: number;
    profit: number;
  }>;
  currency: string;
}

interface FinancialOverviewWidgetProps {
  className?: string;
}

export function FinancialOverviewWidget({ className = '' }: FinancialOverviewWidgetProps) {
  const { projects, loading, error } = useProjects();
  const [data, setData] = useState<FinancialData>({
    totalInvestment: 0,
    expectedRevenue: 0,
    actualRevenue: 0,
    roi: 0,
    profitMargin: 0,
    monthlyGrowth: 0,
    cashFlow: [],
    currency: 'SAR'
  });

  const calculateFinancialData = useCallback(() => {
    if (projects.length === 0) return;

    // Calculate basic metrics from project count (mock data until we have real financial data)
    const totalInvestment = projects.length * 100000; // Mock: SAR 100K per project
    
    // For completed projects, calculate mock revenue
    const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED);
    const totalRevenue = completedProjects.length * 150000; // Mock: SAR 150K per completed project

    // Expected revenue from all active projects
    const activeProjects = projects.filter(p => p.status === ProjectStatus.ACTIVE);
    const expectedRevenue = (completedProjects.length * 150000) + (activeProjects.length * 120000);

    // Calculate ROI (simplified)
    const roi = totalInvestment > 0 ? ((totalRevenue - totalInvestment) / totalInvestment) * 100 : 0;

    // Mock profit margin (would come from real financial data)
    const profitMargin = totalRevenue > 0 ? 25 : 0;

    // Mock monthly growth
    const monthlyGrowth = Math.random() * 10;

    // Generate mock cash flow based on project data
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    const cashFlow = months.map((month, index) => {
      const baseIncome = totalInvestment / 12;
      const variance = (Math.random() - 0.5) * 0.3;
      const income = Math.round(baseIncome * (1 + variance));
      const expenses = Math.round(income * 0.7);
      return {
        month,
        income,
        expenses,
        profit: income - expenses
      };
    });

    setData({
      totalInvestment,
      expectedRevenue,
      actualRevenue: totalRevenue,
      roi: Math.round(roi * 10) / 10,
      profitMargin,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      cashFlow,
      currency: 'SAR'
    });
  }, [projects]);

  useEffect(() => {
    if (projects.length > 0) {
      calculateFinancialData();
    }
  }, [projects, calculateFinancialData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: data.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            نظرة عامة مالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            نظرة عامة مالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            <TrendingDown className="h-12 w-12 mx-auto mb-3" />
            <p>خطأ في تحميل البيانات المالية</p>
            <p className="text-sm text-gray-500 mt-1">يرجى المحاولة مرة أخرى</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            نظرة عامة مالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد بيانات مالية متاحة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const revenueProgress = (data.actualRevenue / data.expectedRevenue) * 100;

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          نظرة عامة مالية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* الاستثمار والإيرادات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">إجمالي الاستثمار</span>
            </div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(data.totalInvestment)}
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">الإيرادات الفعلية</span>
            </div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(data.actualRevenue)}
            </div>
          </div>
        </div>

        {/* تقدم الإيرادات */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">تقدم الإيرادات المتوقعة</span>
            <span className="text-sm font-bold">{revenueProgress.toFixed(1)}%</span>
          </div>
          <Progress value={revenueProgress} className="h-3" />
          <div className="text-xs text-gray-600 dark:text-gray-400">
            المتوقع: {formatCurrency(data.expectedRevenue)}
          </div>
        </div>

        {/* المؤشرات الرئيسية */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 border dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs">ROI</span>
            </div>
            <div className="font-bold text-green-600 dark:text-green-400">
              {data.roi}%
            </div>
          </div>

          <div className="text-center p-3 border dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <PieChart className="h-4 w-4 text-blue-500" />
              <span className="text-xs">هامش الربح</span>
            </div>
            <div className="font-bold text-blue-600 dark:text-blue-400">
              {data.profitMargin}%
            </div>
          </div>

          <div className="text-center p-3 border dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              {data.monthlyGrowth >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-500" /> :
                <TrendingDown className="h-4 w-4 text-red-500" />
              }
              <span className="text-xs">النمو الشهري</span>
            </div>
            <div className={`font-bold ${data.monthlyGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {data.monthlyGrowth > 0 ? '+' : ''}{data.monthlyGrowth}%
            </div>
          </div>
        </div>

        {/* مخطط التدفق النقدي */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            التدفق النقدي (آخر 6 أشهر)
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.cashFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${formatNumber(value / 1000)}ك`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'profit' ? 'الربح' : name === 'income' ? 'الدخل' : 'المصروفات'
                  ]}
                  labelFormatter={(label) => `شهر ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ملخص الأداء */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">ملخص الأداء المالي</h4>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between mb-1">
              <span>إجمالي الأرباح:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(data.cashFlow.reduce((sum, item) => sum + item.profit, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>متوسط الربح الشهري:</span>
              <span className="font-semibold">
                {formatCurrency(data.cashFlow.reduce((sum, item) => sum + item.profit, 0) / data.cashFlow.length)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
