'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportExporter } from './ReportExporter';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart as RechartsBarChart, Bar } from 'recharts';
import { PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

interface FinancialData {
  projectId: string;
  projectName: string;
  revenue: number;
  expenses: number;
  profit: number;
  roi: number;
  cashFlow: number[];
  monthlyData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

interface FinancialReportsProps {
  data: FinancialData[];
}

export function FinancialReports({ data }: FinancialReportsProps) {
  const projects = data;
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'comparison'>('summary');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

  const filteredProjects = selectedProject === 'all' 
    ? projects 
    : projects.filter(p => p.projectId === selectedProject);

  const totalRevenue = filteredProjects.reduce((sum, p) => sum + p.revenue, 0);
  const totalExpenses = filteredProjects.reduce((sum, p) => sum + p.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgROI = filteredProjects.reduce((sum, p) => sum + p.roi, 0) / filteredProjects.length;

  // Prepare chart data
  const monthlyChartData = filteredProjects.length > 0 && filteredProjects[0].monthlyData 
    ? filteredProjects[0].monthlyData.map(month => ({
        ...month,
        profit: month.revenue - month.expenses
      }))
    : [];

  const projectComparisonData = filteredProjects.map(project => ({
    name: project.projectName,
    revenue: project.revenue,
    expenses: project.expenses,
    profit: project.profit,
    roi: project.roi
  }));

  const expenseCategories = filteredProjects.length > 0 && filteredProjects[0].categoryBreakdown
    ? filteredProjects[0].categoryBreakdown
    : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            التقارير المالية
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            تحليل مالي شامل للمشاريع والأداء
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختر المشروع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المشاريع</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.projectId} value={project.projectId}>
                  {project.projectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="نوع التقرير" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">ملخص عام</SelectItem>
              <SelectItem value="detailed">تقرير مفصل</SelectItem>
              <SelectItem value="comparison">مقارنة المشاريع</SelectItem>
              <SelectItem value="forecast">توقعات</SelectItem>
            </SelectContent>
          </Select>
          
        </div>
      </div>

      {/* Report Exporter */}
      <ReportExporter 
        reportType="financial" 
        data={data}
      />

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  إجمالي الإيرادات
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {totalRevenue.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-gray-500 mr-2">من الشهر الماضي</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  إجمالي المصروفات
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {totalExpenses.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-red-600">+8.2%</span>
              <span className="text-gray-500 mr-2">من الشهر الماضي</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  صافي الربح
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalProfit.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+18.7%</span>
              <span className="text-gray-500 mr-2">من الشهر الماضي</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  متوسط ROI
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {avgROI.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+4.1%</span>
              <span className="text-gray-500 mr-2">من الشهر الماضي</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Expenses Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>الإيرادات والمصروفات الشهرية</CardTitle>
                <CardDescription>
                  تتبع الأداء المالي على مدار الأشهر
                </CardDescription>
              </div>
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">خطي</SelectItem>
                  <SelectItem value="bar">أعمدة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'line' ? (
                <RechartsLineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" name="الإيرادات" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="المصروفات" />
                  <Line type="monotone" dataKey="profit" stroke="#3b82f6" name="الربح" />
                </RechartsLineChart>
              ) : (
                <RechartsBarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="الإيرادات" />
                  <Bar dataKey="expenses" fill="#ef4444" name="المصروفات" />
                </RechartsBarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع المصروفات</CardTitle>
            <CardDescription>
              تحليل المصروفات حسب الفئات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Project Comparison Table */}
      {reportType === 'comparison' && (
        <Card>
          <CardHeader>
            <CardTitle>مقارنة أداء المشاريع</CardTitle>
            <CardDescription>
              مقارنة الأداء المالي بين المشاريع المختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2 px-4">اسم المشروع</th>
                    <th className="text-right py-2 px-4">الإيرادات</th>
                    <th className="text-right py-2 px-4">المصروفات</th>
                    <th className="text-right py-2 px-4">صافي الربح</th>
                    <th className="text-right py-2 px-4">ROI</th>
                    <th className="text-right py-2 px-4">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {projectComparisonData.map((project, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 font-medium">{project.name}</td>
                      <td className="py-3 px-4 text-green-600">
                        {project.revenue.toLocaleString()} ريال
                      </td>
                      <td className="py-3 px-4 text-red-600">
                        {project.expenses.toLocaleString()} ريال
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <span className={project.profit > 0 ? 'text-green-600' : 'text-red-600'}>
                          {project.profit.toLocaleString()} ريال
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={project.roi > 20 ? 'default' : project.roi > 0 ? 'secondary' : 'destructive'}>
                          {project.roi.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={project.profit > 0 ? 'default' : 'destructive'}>
                          {project.profit > 0 ? 'مربح' : 'خاسر'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Financial Breakdown */}
      {reportType === 'detailed' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>تفصيل الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>مبيعات المنتجات</span>
                  <span className="font-semibold">450,000 ريال</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>الخدمات</span>
                  <span className="font-semibold">230,000 ريال</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>الاستشارات</span>
                  <span className="font-semibold">120,000 ريال</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b font-bold">
                  <span>إجمالي الإيرادات</span>
                  <span>{totalRevenue.toLocaleString()} ريال</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تفصيل المصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>الرواتب والأجور</span>
                  <span className="font-semibold">180,000 ريال</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>الإيجار والمرافق</span>
                  <span className="font-semibold">85,000 ريال</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>التسويق والإعلان</span>
                  <span className="font-semibold">45,000 ريال</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>مصروفات أخرى</span>
                  <span className="font-semibold">35,000 ريال</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b font-bold">
                  <span>إجمالي المصروفات</span>
                  <span>{totalExpenses.toLocaleString()} ريال</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
