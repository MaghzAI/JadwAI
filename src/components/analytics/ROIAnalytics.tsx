'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportExporter } from '../reports/ReportExporter';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Target,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  LineChart
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

interface CashFlowData {
  month: string;
  inflow: number;
  outflow: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
}

interface ROIData {
  projectId: string;
  projectName: string;
  initialInvestment: number;
  currentValue: number;
  totalReturns: number;
  roi: number;
  roiCategory: 'excellent' | 'good' | 'average' | 'poor';
  paybackPeriod: number;
  npv: number;
  irr: number;
  cashFlowData: CashFlowData[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface ROIAnalyticsProps {
  projects?: ROIData[];
  data?: ROIData[];
  selectedPeriod?: string;
}

export function ROIAnalytics({ projects, data, selectedPeriod }: ROIAnalyticsProps) {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparison'>('overview');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');

  const projectsData = projects || data || [];
  const filteredProjects = selectedProject === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.projectId === selectedProject);

  const getROIColor = (roi: number) => {
    if (roi >= 30) return 'text-green-600';
    if (roi >= 15) return 'text-blue-600';
    if (roi >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROIBadgeVariant = (category: ROIData['roiCategory']) => {
    switch (category) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'average': return 'outline';
      case 'poor': return 'destructive';
    }
  };

  const getRiskColor = (risk: ROIData['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
    }
  };

  // Calculate aggregate metrics
  const totalInvestment = filteredProjects.reduce((sum, p) => sum + p.initialInvestment, 0);
  const totalCurrentValue = filteredProjects.reduce((sum, p) => sum + p.currentValue, 0);
  const totalReturns = filteredProjects.reduce((sum, p) => sum + p.totalReturns, 0);
  const averageROI = filteredProjects.length > 0 
    ? filteredProjects.reduce((sum, p) => sum + p.roi, 0) / filteredProjects.length 
    : 0;
  
  const averagePayback = filteredProjects.length > 0
    ? filteredProjects.reduce((sum, p) => sum + p.paybackPeriod, 0) / filteredProjects.length
    : 0;

  // Prepare cash flow chart data
  const consolidatedCashFlow = selectedProject === 'all' && projects && projects.length > 0
    ? projects[0].cashFlowData.map((monthData, index) => ({
        month: monthData.month,
        totalInflow: projects.reduce((sum, p) => sum + (p.cashFlowData[index]?.inflow || 0), 0),
        totalOutflow: projects.reduce((sum, p) => sum + (p.cashFlowData[index]?.outflow || 0), 0),
        netCashFlow: projects.reduce((sum, p) => sum + (p.cashFlowData[index]?.netCashFlow || 0), 0),
        cumulativeCashFlow: projects.reduce((sum, p) => sum + (p.cashFlowData[index]?.cumulativeCashFlow || 0), 0)
      }))
    : filteredProjects.length > 0 ? filteredProjects[0].cashFlowData : [];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            تحليلات العائد على الاستثمار
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            تحليل شامل للعائد على الاستثمار والتدفق النقدي
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختر المشروع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المشاريع</SelectItem>
              {projects?.map(project => (
                <SelectItem key={project.projectId} value={project.projectId}>
                  {project.projectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">نظرة عامة</SelectItem>
              <SelectItem value="detailed">تفصيلي</SelectItem>
              <SelectItem value="comparison">مقارنة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  متوسط ROI
                </p>
                <p className={`text-2xl font-bold ${getROIColor(averageROI)}`}>
                  {averageROI.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={averageROI > 15 ? 'text-green-600' : 'text-yellow-600'}>
                {averageROI > 15 ? 'أداء ممتاز' : 'أداء جيد'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  إجمالي الاستثمار
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalInvestment.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  إجمالي العوائد
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {totalReturns.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">
                +{((totalReturns / totalInvestment - 1) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  متوسط فترة الاسترداد
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {averagePayback.toFixed(1)} شهر
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>تحليل التدفق النقدي</CardTitle>
              <CardDescription>
                تتبع التدفقات النقدية الداخلة والخارجة مع التدفق التراكمي
              </CardDescription>
            </div>
            <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">مساحة</SelectItem>
                <SelectItem value="line">خطي</SelectItem>
                <SelectItem value="bar">أعمدة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'area' ? (
              <AreaChart data={consolidatedCashFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="totalInflow" 
                  stackId="1" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="التدفق الداخل"
                />
                <Area 
                  type="monotone" 
                  dataKey="totalOutflow" 
                  stackId="2" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                  name="التدفق الخارج"
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeCashFlow" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="التدفق التراكمي"
                />
              </AreaChart>
            ) : chartType === 'line' ? (
              <RechartsLineChart data={consolidatedCashFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalInflow" stroke="#10b981" name="التدفق الداخل" />
                <Line type="monotone" dataKey="totalOutflow" stroke="#ef4444" name="التدفق الخارج" />
                <Line type="monotone" dataKey="netCashFlow" stroke="#3b82f6" name="صافي التدفق" />
                <Line type="monotone" dataKey="cumulativeCashFlow" stroke="#8b5cf6" name="التدفق التراكمي" />
              </RechartsLineChart>
            ) : (
              <BarChart data={consolidatedCashFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalInflow" fill="#10b981" name="التدفق الداخل" />
                <Bar dataKey="totalOutflow" fill="#ef4444" name="التدفق الخارج" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Projects ROI Comparison */}
      {viewMode === 'comparison' && (
        <Card>
          <CardHeader>
            <CardTitle>مقارنة العائد على الاستثمار</CardTitle>
            <CardDescription>
              مقارنة أداء المشاريع من حيث ROI والمؤشرات المالية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">المشروع</th>
                    <th className="text-right py-3 px-4">الاستثمار الأولي</th>
                    <th className="text-right py-3 px-4">القيمة الحالية</th>
                    <th className="text-right py-3 px-4">ROI</th>
                    <th className="text-right py-3 px-4">NPV</th>
                    <th className="text-right py-3 px-4">فترة الاسترداد</th>
                    <th className="text-right py-3 px-4">مستوى المخاطر</th>
                    <th className="text-right py-3 px-4">التقييم</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.projectId} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 font-medium">{project.projectName}</td>
                      <td className="py-3 px-4">{project.initialInvestment.toLocaleString()} ريال</td>
                      <td className="py-3 px-4">{project.currentValue.toLocaleString()} ريال</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${getROIColor(project.roi)}`}>
                          {project.roi.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={project.npv > 0 ? 'text-green-600' : 'text-red-600'}>
                          {project.npv.toLocaleString()} ريال
                        </span>
                      </td>
                      <td className="py-3 px-4">{project.paybackPeriod} شهر</td>
                      <td className="py-3 px-4">
                        <span className={getRiskColor(project.riskLevel)}>
                          {project.riskLevel === 'low' ? 'منخفض' : 
                           project.riskLevel === 'medium' ? 'متوسط' : 'عالي'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getROIBadgeVariant(project.roiCategory)}>
                          {project.roiCategory === 'excellent' ? 'ممتاز' :
                           project.roiCategory === 'good' ? 'جيد' :
                           project.roiCategory === 'average' ? 'متوسط' : 'ضعيف'}
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

      {/* Detailed Project Analysis */}
      {viewMode === 'detailed' && selectedProject !== 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>تحليل الأداء المالي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredProjects.map((project) => (
                <div key={project.projectId} className="space-y-4">
                  <div className="flex justify-between">
                    <span>الاستثمار الأولي:</span>
                    <span className="font-semibold">{project.initialInvestment.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span>القيمة الحالية:</span>
                    <span className="font-semibold">{project.currentValue.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span>إجمالي العوائد:</span>
                    <span className="font-semibold text-green-600">{project.totalReturns.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span>صافي القيمة الحالية (NPV):</span>
                    <span className={`font-semibold ${project.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {project.npv.toLocaleString()} ريال
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل العائد الداخلي (IRR):</span>
                    <span className="font-semibold">{project.irr.toFixed(1)}%</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span>تقدم فترة الاسترداد:</span>
                      <span className="text-sm text-gray-600">
                        {project.paybackPeriod} شهر
                      </span>
                    </div>
                    <Progress value={(12 / project.paybackPeriod) * 100} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تقييم المخاطر والتوصيات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredProjects.map((project) => (
                <div key={project.projectId} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span>مستوى المخاطر:</span>
                    <Badge variant={project.riskLevel === 'low' ? 'secondary' : 
                                  project.riskLevel === 'medium' ? 'outline' : 'destructive'}>
                      {project.riskLevel === 'low' ? 'منخفض' : 
                       project.riskLevel === 'medium' ? 'متوسط' : 'عالي'}
                    </Badge>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      التوصيات
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      {project.roi > 30 && (
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          استثمار ممتاز - يُنصح بزيادة الاستثمار
                        </li>
                      )}
                      {project.roi >= 15 && project.roi <= 30 && (
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          أداء جيد - استمر في المراقبة
                        </li>
                      )}
                      {project.roi < 15 && (
                        <li className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          يحتاج إلى تحسين الأداء
                        </li>
                      )}
                      {project.paybackPeriod > 24 && (
                        <li className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          فترة الاسترداد طويلة - راجع الاستراتيجية
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Portfolio Summary */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>توزيع المحفظة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>مشاريع ممتازة ({projects?.filter(p => p.roiCategory === 'excellent').length || 0})</span>
                  <span className="text-green-600 font-semibold">
                    {projects && projects.length > 0 ? ((projects.filter(p => p.roiCategory === 'excellent').length / projects.length) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <Progress value={projects && projects.length > 0 ? (projects.filter(p => p.roiCategory === 'excellent').length / projects.length) * 100 : 0} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أفضل الأداءات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projects
                  ?.sort((a, b) => b.roi - a.roi)
                  .slice(0, 5)
                  .map((project, index) => (
                    <div key={project.projectId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className="text-sm">{project.projectName}</span>
                      </div>
                      <Badge variant="secondary">{project.roi.toFixed(1)}%</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>التحذيرات والتنبيهات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projects?.filter(p => p.roi < 10).map((project) => (
                  <div key={project.projectId} className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{project.projectName}</p>
                      <p className="text-xs text-red-600">ROI منخفض: {project.roi.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
                
                {projects?.filter(p => p.paybackPeriod > 24).map((project) => (
                  <div key={`payback-${project.projectId}`} className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{project.projectName}</p>
                      <p className="text-xs text-yellow-600">فترة استرداد طويلة: {project.paybackPeriod} شهر</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
