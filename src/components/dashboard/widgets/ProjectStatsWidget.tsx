'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FolderOpen, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
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
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    overdue: 0,
    thisMonth: 0,
    completionRate: 0,
    avgDuration: 0,
    upcomingDeadlines: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectStats();
  }, []);

  const fetchProjectStats = async () => {
    try {
      // سيتم استبدال هذا بـ API call حقيقي
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalProjects: 24,
        activeProjects: 16,
        completedProjects: 8,
        overdue: 3,
        thisMonth: 5,
        completionRate: 75,
        avgDuration: 45,
        upcomingDeadlines: 7
      });
    } catch (error) {
      console.error('Error fetching project stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <FolderOpen className="h-5 w-5" />
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

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
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
              <Clock className="h-4 w-4 text-blue-500" />
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
              <AlertTriangle className="h-4 w-4 text-red-500" />
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
