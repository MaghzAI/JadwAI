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
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      // Mock data - سيتم استبداله بـ API call حقيقي
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setData({
        totalInvestment: 2500000,
        expectedRevenue: 4200000,
        actualRevenue: 3800000,
        roi: 24.5,
        profitMargin: 31.2,
        monthlyGrowth: 8.7,
        cashFlow: [
          { month: 'يناير', income: 350000, expenses: 240000, profit: 110000 },
          { month: 'فبراير', income: 420000, expenses: 280000, profit: 140000 },
          { month: 'مارس', income: 380000, expenses: 260000, profit: 120000 },
          { month: 'أبريل', income: 510000, expenses: 320000, profit: 190000 },
          { month: 'مايو', income: 480000, expenses: 310000, profit: 170000 },
          { month: 'يونيو', income: 550000, expenses: 340000, profit: 210000 },
        ],
        currency: 'SAR'
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

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
