'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  CheckCircle2,
  Folder,
  Timer,
  AlertCircle
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectStatus } from '@prisma/client';

import { useEffect, useState, useCallback } from 'react';

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  overdue: number;
  thisMonth: number;
  completionRate: number;
  avgDuration: number;
  upcomingDeadlines: number;
}

interface ProjectStatsWidgetProps {
  className?: string;
}

export function ProjectStatsWidget({ className = '' }: ProjectStatsWidgetProps) {
  const { projects, loading, error } = useProjects();
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    onHoldProjects: 0,
    overdue: 0,
    thisMonth: 0,
    completionRate: 0,
    avgDuration: 0,
    upcomingDeadlines: 0
  });

  const calculateStats = useCallback(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === ProjectStatus.ACTIVE).length;
    const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
    const onHoldProjects = projects.filter(p => p.status === ProjectStatus.ARCHIVED).length;
    
    // Projects created this month
    const thisMonthProjects = projects.filter(p => {
      const createdDate = new Date(p.createdAt);
      return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
    }).length;

    // Mock overdue projects (would come from real milestone/task data)
    const overdue = Math.floor(activeProjects * 0.1); // Mock: 10% of active projects are overdue
    
    // Mock upcoming deadlines (would come from real milestone/task data)
    const upcomingDeadlines = Math.floor(activeProjects * 0.2); // Mock: 20% have upcoming deadlines

    // Calculate completion rate
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // Mock average duration for completed projects (would come from real project data)
    const totalDuration = completedProjects > 0 ? 45 * completedProjects : 0; // Mock: 45 days average

    setStats({
      totalProjects,
      activeProjects,
      completedProjects,
      onHoldProjects,
      overdue,
      thisMonth: thisMonthProjects,
      completionRate,
      avgDuration: totalProjects > 0 ? Math.round(totalDuration / totalProjects) : 0,
      upcomingDeadlines
    });
  }, [projects]);

  useEffect(() => {
    if (projects.length > 0) {
      calculateStats();
    }
  }, [projects, calculateStats]);

  const formatDuration = () => {
    // TO DO: implement formatDuration function
  }

  const getStatusColor = (status: 'active' | 'completed' | 'overdue') => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            إحصائيات المشاريع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
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
            <Folder className="h-5 w-5" />
            إحصائيات المشاريع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            <AlertCircle className="h-12 w-12 mx-auto mb-3" />
            <p>خطأ في تحميل الإحصائيات</p>
            <p className="text-sm text-gray-500 mt-1">يرجى المحاولة مرة أخرى</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          إحصائيات المشاريع
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* إجمالي المشاريع */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalProjects}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              إجمالي المشاريع
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.thisMonth}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              هذا الشهر
            </div>
          </div>
        </div>

        {/* حالة المشاريع */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            حالة المشاريع
          </h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="text-sm">نشطة</span>
            </div>
            <Badge className={getStatusColor('active')}>
              {stats.activeProjects}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">مكتملة</span>
            </div>
            <Badge className={getStatusColor('completed')}>
              {stats.completedProjects}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm">متأخرة</span>
            </div>
            <Badge className={getStatusColor('overdue')}>
              {stats.overdue}
            </Badge>
          </div>
        </div>

        {/* معدل الإنجاز */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">معدل الإنجاز</span>
            </div>
            <span className="text-sm font-bold">{stats.completionRate}%</span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
        </div>

        {/* المواعيد النهائية القادمة */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium">مواعيد نهائية قادمة</span>
          </div>
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            {stats.upcomingDeadlines}
          </Badge>
        </div>

        {/* متوسط مدة المشروع */}
        <div className="text-center p-2 border-t dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            متوسط مدة المشروع
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {stats.avgDuration} يوم
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
