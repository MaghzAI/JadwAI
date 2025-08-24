'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { ProjectStatsWidget } from '@/components/dashboard/widgets/ProjectStatsWidget';
import { FinancialOverviewWidget } from '@/components/dashboard/widgets/FinancialOverviewWidget';
import { RecentProjectsWidget } from '@/components/dashboard/widgets/RecentProjectsWidget';
import { QuickActionsWidget } from '@/components/dashboard/widgets/QuickActionsWidget';
import { 
  FolderOpen, 
  FileText, 
  Users, 
  TrendingUp, 
  Plus,
  BarChart3,
  Clock,
  CheckCircle2,
  LayoutGrid,
  Bot,
  Download,
  Share2,
  Settings
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
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="h-8 w-8" />
            لوحة التحكم المتقدمة
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            نظرة شاملة على أداء مشاريعك والإحصائيات المالية
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="w-4 h-4 ml-2" />
              مشروع جديد
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/studies/new">
              <FileText className="w-4 h-4 ml-2" />
              دراسة جدوى
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Access Cards for New Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/analytics">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">التحليلات</h3>
              <p className="text-sm text-gray-600">لوحة تحليلات شاملة</p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/ai-tools">
            <CardContent className="p-6 text-center">
              <Bot className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">أدوات AI</h3>
              <p className="text-sm text-gray-600">إدارة الذكاء الاصطناعي</p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/team">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">إدارة الفريق</h3>
              <p className="text-sm text-gray-600">الأعضاء والصلاحيات</p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/exports">
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">التصدير والمشاركة</h3>
              <p className="text-sm text-gray-600">تقارير ومشاركة</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* New Advanced Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Main Widgets */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Row - Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectStatsWidget />
            <FinancialOverviewWidget />
          </div>
          
          {/* Recent Projects */}
          <RecentProjectsWidget />
        </div>

        {/* Right Column - Quick Actions & Activity */}
        <div className="lg:col-span-4 space-y-6">
          <QuickActionsWidget />
          <RecentActivity activities={recentActivities} loading={loading} />
        </div>
      </div>

    </div>
  );
}
