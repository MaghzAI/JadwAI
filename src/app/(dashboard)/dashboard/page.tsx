'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export default function DashboardPage() {
  // Mock data - في المستقبل سيتم جلبها من API
  const stats = [
    {
      title: 'إجمالي المشاريع',
      value: '12',
      description: '+2 هذا الشهر',
      icon: FolderOpen,
      trend: '+15%',
    },
    {
      title: 'الدراسات المكتملة',
      value: '8',
      description: '+3 هذا الأسبوع',
      icon: FileText,
      trend: '+25%',
    },
    {
      title: 'قيد المراجعة',
      value: '3',
      description: 'منتظرة الموافقة',
      icon: Clock,
      trend: '0%',
    },
    {
      title: 'معدل النجاح',
      value: '85%',
      description: 'من الدراسات المعتمدة',
      icon: TrendingUp,
      trend: '+5%',
    },
  ];

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            لوحة التحكم
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            مرحباً بك في منصة دراسات الجدوى الذكية
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="ml-2 h-4 w-4" />
              مشروع جديد
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/studies/new">
              <FileText className="ml-2 h-4 w-4" />
              دراسة جديدة
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <TrendingUp className="h-3 w-3 ml-1" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>المشاريع الأخيرة</CardTitle>
            <CardDescription>
              آخر المشاريع التي تم العمل عليها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{project.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>{project.type}</span>
                      <span>•</span>
                      <span>ROI: {project.roi}</span>
                    </div>
                  </div>
                  <div className="text-left space-y-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(project.lastUpdated).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/projects">
                  عرض جميع المشاريع
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

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
