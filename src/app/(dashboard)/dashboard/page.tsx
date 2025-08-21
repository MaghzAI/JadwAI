'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { 
  FolderOpen, 
  FileText, 
  Users, 
  TrendingUp, 
  Plus,
  BarChart3,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  
  // Mock data - في المستقبل سيتم جلبها من API
  const statsData = {
    totalProjects: 15,
    totalStudies: 23,
    completedProjects: 12,
    completedStudies: 18,
    totalInvestment: 2500000,
    totalRevenue: 4200000,
    activeUsers: 8,
    thisMonthProjects: 3,
    thisMonthStudies: 5,
    averageROI: 24.5,
    currency: 'SAR'
  };

  const recentActivities = [
    {
      id: '1',
      type: 'project' as const,
      action: 'created' as const,
      title: 'مطعم الأصالة العربية',
      description: 'مشروع مطعم في حي الملك فهد',
      user: { name: 'أحمد محمد', avatar: '' },
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'IN_PROGRESS' as const,
      link: '/projects/1'
    },
    {
      id: '2',
      type: 'study' as const,
      action: 'completed' as const,
      title: 'دراسة جدوى متجر إلكتروني',
      description: 'دراسة شاملة لمتجر الملابس الرجالية',
      user: { name: 'فاطمة أحمد', avatar: '' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'COMPLETED' as const,
      link: '/studies/2'
    },
    {
      id: '3',
      type: 'project' as const,
      action: 'updated' as const,
      title: 'مركز التدريب التقني',
      description: 'تحديث الميزانية والجدول الزمني',
      user: { name: 'محمد عبدالله', avatar: '' },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'IN_PROGRESS' as const,
      link: '/projects/3'
    },
    {
      id: '4',
      type: 'study' as const,
      action: 'created' as const,
      title: 'دراسة سوق التطبيقات الذكية',
      description: 'تحليل فرص الاستثمار في التطبيقات',
      user: { name: 'سارة خالد', avatar: '' },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: 'DRAFT' as const,
      link: '/studies/4'
    },
    {
      id: '5',
      type: 'project' as const,
      action: 'completed' as const,
      title: 'مشروع الطاقة الشمسية',
      description: 'محطة طاقة شمسية للمباني التجارية',
      user: { name: 'علي حسن', avatar: '' },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'COMPLETED' as const,
      link: '/projects/5'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const recentProjects = [
    {
      id: 1,
      name: 'مطعم الأصالة',
      type: 'مطعم',
      status: 'مكتمل',
      lastUpdated: '2024-01-15',
      roi: '25%',
    },
    {
      id: 2,
      name: 'متجر الإلكترونيات',
      type: 'تجارة إلكترونية',
      status: 'قيد التطوير',
      lastUpdated: '2024-01-14',
      roi: '18%',
    },
    {
      id: 3,
      name: 'مركز التدريب التقني',
      type: 'تعليم',
      status: 'مراجعة',
      lastUpdated: '2024-01-13',
      roi: '22%',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'قيد التطوير':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'مراجعة':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">مرحباً بك في منصة دراسات الجدوى</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/projects/new">
              <Plus className="ml-2 h-4 w-4" />
              مشروع جديد
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/studies/new">
              <FileText className="ml-2 h-4 w-4" />
              دراسة جديدة
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview data={statsData} loading={loading} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} loading={loading} />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            <CardDescription>
              الأدوات والميزات الأكثر استخداماً
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button asChild variant="outline" className="justify-start h-auto p-4">
                <Link href="/projects/new">
                  <FolderOpen className="ml-3 h-5 w-5" />
                  <div className="text-right">
                    <div className="font-medium">إنشاء مشروع جديد</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      ابدأ مشروعك وحدد أهدافك
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="justify-start h-auto p-4">
                <Link href="/studies/new">
                  <FileText className="ml-3 h-5 w-5" />
                  <div className="text-right">
                    <div className="font-medium">دراسة جدوى جديدة</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      استخدم الذكاء الاصطناعي للتحليل
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="justify-start h-auto p-4">
                <Link href="/reports">
                  <BarChart3 className="ml-3 h-5 w-5" />
                  <div className="text-right">
                    <div className="font-medium">التقارير والتحليلات</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      عرض الإحصائيات والنتائج
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="justify-start h-auto p-4">
                <Link href="/templates">
                  <CheckCircle2 className="ml-3 h-5 w-5" />
                  <div className="text-right">
                    <div className="font-medium">القوالب الجاهزة</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      قوالب معدة مسبقاً لقطاعات مختلفة
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
