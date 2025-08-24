'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Activity,
  Users,
  Clock,
  MousePointer,
  Download,
  Share2,
  Eye,
  FileText,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface UsageData {
  daily: Array<{ date: string; pageViews: number; uniqueUsers: number; sessionDuration: number }>;
  realTime: {
    activeUsers: number;
    pagesPerSession: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  userBehavior: {
    topPages: Array<{ page: string; views: number; avgTime: number }>;
    userFlow: Array<{ from: string; to: string; count: number }>;
    exitPages: Array<{ page: string; exitRate: number }>;
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browsers: Array<{ name: string; usage: number; color: string }>;
  locations: Array<{ country: string; city: string; users: number }>;
  features: Array<{ feature: string; usage: number; trend: number }>;
  performance: {
    pageLoadTime: number;
    serverResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

export function UsageAnalytics() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last_7_days');
  const [refreshInterval, setRefreshInterval] = useState(30);

  useEffect(() => {
    loadUsageData();
    const interval = setInterval(loadUsageData, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [timeRange, refreshInterval]);

  const loadUsageData = async () => {
    try {
      // Mock usage data
      const mockData: UsageData = {
        daily: [
          { date: '2024-01-15', pageViews: 2450, uniqueUsers: 186, sessionDuration: 245 },
          { date: '2024-01-16', pageViews: 2890, uniqueUsers: 203, sessionDuration: 267 },
          { date: '2024-01-17', pageViews: 3120, uniqueUsers: 195, sessionDuration: 289 },
          { date: '2024-01-18', pageViews: 2756, uniqueUsers: 178, sessionDuration: 234 },
          { date: '2024-01-19', pageViews: 3567, uniqueUsers: 224, sessionDuration: 312 },
          { date: '2024-01-20', pageViews: 3890, uniqueUsers: 245, sessionDuration: 298 },
          { date: '2024-01-21', pageViews: 4123, uniqueUsers: 267, sessionDuration: 324 }
        ],
        realTime: {
          activeUsers: 47,
          pagesPerSession: 4.2,
          bounceRate: 32.8,
          avgSessionDuration: 4.5
        },
        userBehavior: {
          topPages: [
            { page: '/dashboard', views: 15678, avgTime: 145 },
            { page: '/projects/create', views: 8934, avgTime: 267 },
            { page: '/studies/wizard', views: 7245, avgTime: 423 },
            { page: '/analytics', views: 5678, avgTime: 198 },
            { page: '/settings', views: 3456, avgTime: 89 },
            { page: '/team', views: 2345, avgTime: 134 }
          ],
          userFlow: [
            { from: '/dashboard', to: '/projects/create', count: 145 },
            { from: '/projects/create', to: '/studies/wizard', count: 98 },
            { from: '/studies/wizard', to: '/analytics', count: 67 },
            { from: '/dashboard', to: '/analytics', count: 89 },
            { from: '/analytics', to: '/settings', count: 45 }
          ],
          exitPages: [
            { page: '/login', exitRate: 45.2 },
            { page: '/pricing', exitRate: 38.7 },
            { page: '/help', exitRate: 34.5 },
            { page: '/contact', exitRate: 42.1 }
          ]
        },
        devices: {
          desktop: 67.3,
          mobile: 24.8,
          tablet: 7.9
        },
        browsers: [
          { name: 'Chrome', usage: 58.4, color: '#4285F4' },
          { name: 'Safari', usage: 23.7, color: '#000000' },
          { name: 'Firefox', usage: 12.3, color: '#FF7139' },
          { name: 'Edge', usage: 4.2, color: '#0078D4' },
          { name: 'أخرى', usage: 1.4, color: '#9CA3AF' }
        ],
        locations: [
          { country: 'السعودية', city: 'الرياض', users: 1245 },
          { country: 'السعودية', city: 'جدة', users: 987 },
          { country: 'الإمارات', city: 'دبي', users: 567 },
          { country: 'السعودية', city: 'الدمام', users: 445 },
          { country: 'الكويت', city: 'الكويت', users: 234 },
          { country: 'قطر', city: 'الدوحة', users: 189 }
        ],
        features: [
          { feature: 'إنشاء المشاريع', usage: 89.5, trend: 5.2 },
          { feature: 'معالج دراسة الجدوى', usage: 78.3, trend: 12.1 },
          { feature: 'مولد المحتوى بالذكاء الاصطناعي', usage: 67.8, trend: 24.5 },
          { feature: 'التصدير إلى PDF', usage: 92.1, trend: 3.4 },
          { feature: 'المشاركة التعاونية', usage: 45.6, trend: -2.1 },
          { feature: 'لوحة التحليلات', usage: 34.2, trend: 18.7 },
          { feature: 'إدارة الفريق', usage: 28.9, trend: 8.3 }
        ],
        performance: {
          pageLoadTime: 1.84,
          serverResponseTime: 0.32,
          errorRate: 0.12,
          uptime: 99.97
        }
      };

      setData(mockData);
    } catch (error) {
      console.error('Failed to load usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    icon: Icon, 
    color = 'blue',
    trend 
  }: {
    title: string;
    value: number | string;
    unit?: string;
    icon: any;
    color?: string;
    trend?: number;
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-xl font-bold">
              {value}{unit}
            </p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-xs ${
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                <TrendingUp className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading || !data) {
    return (
      <div className="text-center py-12">
        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600">جاري تحميل إحصائيات الاستخدام...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إحصائيات الاستخدام</h2>
          <p className="text-gray-600">تحليل مفصل لسلوك المستخدمين وأداء المنصة</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_24_hours">آخر 24 ساعة</SelectItem>
              <SelectItem value="last_7_days">آخر 7 أيام</SelectItem>
              <SelectItem value="last_30_days">آخر 30 يوم</SelectItem>
              <SelectItem value="last_90_days">آخر 3 أشهر</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="animate-pulse">
            مباشر - {data.realTime.activeUsers} مستخدم
          </Badge>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="المستخدمون النشطون"
          value={data.realTime.activeUsers}
          icon={Users}
          color="green"
        />
        <MetricCard
          title="الصفحات لكل جلسة"
          value={data.realTime.pagesPerSession}
          icon={MousePointer}
          color="blue"
        />
        <MetricCard
          title="معدل الارتداد"
          value={data.realTime.bounceRate}
          unit="%"
          icon={Activity}
          color="orange"
        />
        <MetricCard
          title="متوسط مدة الجلسة"
          value={data.realTime.avgSessionDuration}
          unit=" دقيقة"
          icon={Clock}
          color="purple"
        />
      </div>

      <Tabs defaultValue="traffic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="traffic">حركة المرور</TabsTrigger>
          <TabsTrigger value="behavior">سلوك المستخدمين</TabsTrigger>
          <TabsTrigger value="devices">الأجهزة والمتصفحات</TabsTrigger>
          <TabsTrigger value="features">استخدام الميزات</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          {/* Traffic Overview */}
          <Card>
            <CardHeader>
              <CardTitle>نظرة عامة على حركة المرور</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.daily}>
                  <defs>
                    <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorPageViews)"
                    name="مشاهدات الصفحة"
                  />
                  <Area
                    type="monotone"
                    dataKey="uniqueUsers"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    name="المستخدمون الفريدون"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                التوزيع الجغرافي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.locations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{location.city}, {location.country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(location.users / Math.max(...data.locations.map(l => l.users))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12">{location.users}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>الصفحات الأكثر زيارة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.userBehavior.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{page.page}</span>
                      <p className="text-sm text-gray-600">متوسط الوقت: {page.avgTime} ثانية</p>
                    </div>
                    <Badge variant="outline">{page.views.toLocaleString()} مشاهدة</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Flow */}
          <Card>
            <CardHeader>
              <CardTitle>مسار المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.userBehavior.userFlow.map((flow, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <span className="text-sm">{flow.from}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${(flow.count / Math.max(...data.userBehavior.userFlow.map(f => f.count))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{flow.to}</span>
                    <Badge variant="secondary">{flow.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          {/* Device Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع الأجهزة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span>أجهزة الحاسوب</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={data.devices.desktop} className="w-24" />
                      <span className="text-sm w-12">{data.devices.desktop}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>الهواتف المحمولة</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={data.devices.mobile} className="w-24" />
                      <span className="text-sm w-12">{data.devices.mobile}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tablet className="h-4 w-4" />
                      <span>الأجهزة اللوحية</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={data.devices.tablet} className="w-24" />
                      <span className="text-sm w-12">{data.devices.tablet}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع المتصفحات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data.browsers}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="usage"
                    >
                      {data.browsers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'الاستخدام']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {data.browsers.map((browser) => (
                    <div key={browser.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: browser.color }}
                      />
                      <span className="text-sm">{browser.name}: {browser.usage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Feature Usage */}
          <Card>
            <CardHeader>
              <CardTitle>استخدام الميزات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{feature.feature}</span>
                        <Badge
                          variant={feature.trend > 0 ? "default" : feature.trend < 0 ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {feature.trend > 0 ? '+' : ''}{feature.trend}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={feature.usage} className="flex-1" />
                        <span className="text-sm text-gray-600 w-12">{feature.usage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="زمن تحميل الصفحة"
              value={data.performance.pageLoadTime}
              unit=" ثانية"
              icon={Clock}
              color="blue"
            />
            <MetricCard
              title="زمن استجابة الخادم"
              value={data.performance.serverResponseTime}
              unit=" ثانية"
              icon={Activity}
              color="green"
            />
            <MetricCard
              title="معدل الأخطاء"
              value={data.performance.errorRate}
              unit="%"
              icon={FileText}
              color="red"
            />
            <MetricCard
              title="وقت التشغيل"
              value={data.performance.uptime}
              unit="%"
              icon={TrendingUp}
              color="green"
            />
          </div>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle>نصائح تحسين الأداء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">أداء ممتاز</span>
                  </div>
                  <p className="text-sm text-green-800">
                    المنصة تعمل بأداء ممتاز مع وقت تشغيل عالي ومعدل أخطاء منخفض
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">نقاط التحسين</span>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• تحسين صور الواجهة لتقليل زمن التحميل</li>
                    <li>• تفعيل ضغط البيانات للصفحات الثقيلة</li>
                    <li>• استخدام CDN لتوزيع المحتوى عالمياً</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
