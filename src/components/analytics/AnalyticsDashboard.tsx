'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Download,
  Eye,
  Share2,
  Calendar,
  Filter
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalProjects: number;
    totalStudies: number;
    totalUsers: number;
    activeProjects: number;
    completedStudies: number;
    pendingStudies: number;
  };
  trends: {
    projectsCreated: Array<{ month: string; count: number }>;
    studiesCompleted: Array<{ month: string; count: number }>;
    userGrowth: Array<{ month: string; users: number }>;
  };
  performance: {
    avgCompletionTime: number;
    studyQualityScore: number;
    userSatisfaction: number;
    exportCount: number;
    shareCount: number;
  };
  usage: {
    byIndustry: Array<{ industry: string; count: number; percentage: number }>;
    byRegion: Array<{ region: string; count: number }>;
    byFeature: Array<{ feature: string; usage: number }>;
  };
  financial: {
    totalRevenue: number;
    avgProjectValue: number;
    revenueByMonth: Array<{ month: string; revenue: number }>;
    topIndustries: Array<{ industry: string; revenue: number }>;
  };
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last_6_months');
  const [selectedMetric, setSelectedMetric] = useState('projects');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock analytics data
      const mockData: AnalyticsData = {
        overview: {
          totalProjects: 247,
          totalStudies: 189,
          totalUsers: 56,
          activeProjects: 34,
          completedStudies: 145,
          pendingStudies: 44
        },
        trends: {
          projectsCreated: [
            { month: 'يناير', count: 12 },
            { month: 'فبراير', count: 19 },
            { month: 'مارس', count: 15 },
            { month: 'أبريل', count: 28 },
            { month: 'مايو', count: 24 },
            { month: 'يونيو', count: 31 }
          ],
          studiesCompleted: [
            { month: 'يناير', count: 8 },
            { month: 'فبراير', count: 14 },
            { month: 'مارس', count: 11 },
            { month: 'أبريل', count: 22 },
            { month: 'مايو', count: 18 },
            { month: 'يونيو', count: 25 }
          ],
          userGrowth: [
            { month: 'يناير', users: 32 },
            { month: 'فبراير', users: 38 },
            { month: 'مارس', users: 41 },
            { month: 'أبريل', users: 47 },
            { month: 'مايو', users: 52 },
            { month: 'يونيو', users: 56 }
          ]
        },
        performance: {
          avgCompletionTime: 12.5,
          studyQualityScore: 8.4,
          userSatisfaction: 4.6,
          exportCount: 342,
          shareCount: 128
        },
        usage: {
          byIndustry: [
            { industry: 'التقنية', count: 45, percentage: 24 },
            { industry: 'التجارة الإلكترونية', count: 38, percentage: 20 },
            { industry: 'العقارات', count: 32, percentage: 17 },
            { industry: 'الصحة', count: 28, percentage: 15 },
            { industry: 'التعليم', count: 24, percentage: 13 },
            { industry: 'أخرى', count: 20, percentage: 11 }
          ],
          byRegion: [
            { region: 'الرياض', count: 89 },
            { region: 'جدة', count: 67 },
            { region: 'الدمام', count: 45 },
            { region: 'مكة المكرمة', count: 32 },
            { region: 'المدينة المنورة', count: 14 }
          ],
          byFeature: [
            { feature: 'مولد المحتوى بالذكاء الاصطناعي', usage: 85 },
            { feature: 'التحليل المالي', usage: 78 },
            { feature: 'تحليل السوق', usage: 72 },
            { feature: 'تقييم المخاطر', usage: 68 },
            { feature: 'التصدير إلى PDF', usage: 92 },
            { feature: 'المشاركة التعاونية', usage: 45 }
          ]
        },
        financial: {
          totalRevenue: 892500,
          avgProjectValue: 3615,
          revenueByMonth: [
            { month: 'يناير', revenue: 125000 },
            { month: 'فبراير', revenue: 138000 },
            { month: 'مارس', revenue: 142000 },
            { month: 'أبريل', revenue: 156000 },
            { month: 'مايو', revenue: 148000 },
            { month: 'يونيو', revenue: 183500 }
          ],
          topIndustries: [
            { industry: 'التقنية', revenue: 245000 },
            { industry: 'العقارات', revenue: 198000 },
            { industry: 'التجارة الإلكترونية', revenue: 167000 },
            { industry: 'الصحة', revenue: 142000 },
            { industry: 'التعليم', revenue: 140500 }
          ]
        }
      };

      setData(mockData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon,
    color = 'blue'
  }: {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: any;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 text-sm ${
                changeType === 'positive' ? 'text-green-600' : 
                changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {changeType === 'positive' && <TrendingUp className="h-4 w-4" />}
                {changeType === 'negative' && <TrendingDown className="h-4 w-4" />}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">جاري تحميل التحليلات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحليلات</h1>
          <p className="text-gray-600">تحليل شامل لأداء المنصة والمشاريع</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_30_days">آخر 30 يوم</SelectItem>
              <SelectItem value="last_3_months">آخر 3 أشهر</SelectItem>
              <SelectItem value="last_6_months">آخر 6 أشهر</SelectItem>
              <SelectItem value="last_year">آخر سنة</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المشاريع"
          value={data.overview.totalProjects}
          change="+12%"
          changeType="positive"
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="الدراسات المكتملة"
          value={data.overview.completedStudies}
          change="+8%"
          changeType="positive"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="المستخدمون النشطون"
          value={data.overview.totalUsers}
          change="+15%"
          changeType="positive"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="متوسط وقت الإنجاز"
          value={`${data.performance.avgCompletionTime} يوم`}
          change="-5%"
          changeType="positive"
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Trend */}
        <Card>
          <CardHeader>
            <CardTitle>اتجاه إنشاء المشاريع</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trends.projectsCreated}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="المشاريع الجديدة"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع المشاريع حسب القطاع</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.usage.byIndustry}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.usage.byIndustry.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              الإيرادات الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-2xl font-bold text-green-600">
                {data.financial.totalRevenue.toLocaleString()} ريال
              </p>
              <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.financial.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} ريال`, 'الإيرادات']} />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feature Usage */}
        <Card>
          <CardHeader>
            <CardTitle>استخدام الميزات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.usage.byFeature.map((feature, index) => (
                <div key={feature.feature} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{feature.feature}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${feature.usage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{feature.usage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>مؤشرات الأداء الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {data.performance.studyQualityScore}/10
              </div>
              <div className="text-sm text-gray-600">جودة الدراسات</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {data.performance.userSatisfaction}/5
              </div>
              <div className="text-sm text-gray-600">رضا المستخدمين</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {data.performance.exportCount}
              </div>
              <div className="text-sm text-gray-600">عمليات التصدير</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {data.performance.shareCount}
              </div>
              <div className="text-sm text-gray-600">المشاركات</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {data.financial.avgProjectValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">متوسط قيمة المشروع</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>التوزيع الجغرافي للمشاريع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {data.usage.byRegion.map((region, index) => (
              <div key={region.region} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {region.count}
                </div>
                <div className="text-sm text-gray-600">{region.region}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Industries by Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>أعلى القطاعات إيراداً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.financial.topIndustries.map((industry, index) => (
              <div key={industry.industry} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <span className="font-medium">{industry.industry}</span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {industry.revenue.toLocaleString()} ريال
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>تصدير البيانات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              تصدير إلى Excel
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              تصدير إلى PDF
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              مشاركة التقرير
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              جدولة التقارير
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
