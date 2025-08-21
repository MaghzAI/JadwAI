'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  FileText, 
  Edit,
  Plus,
  User,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'project' | 'study' | 'user';
  action: 'created' | 'updated' | 'completed' | 'deleted';
  title: string;
  description?: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  status?: 'COMPLETED' | 'IN_PROGRESS' | 'DRAFT' | 'ON_HOLD';
  link?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  loading?: boolean;
}

export default function RecentActivity({ activities, loading = false }: RecentActivityProps) {
  const getActivityIcon = (type: string, action: string) => {
    switch (type) {
      case 'project':
        return action === 'created' ? Plus : action === 'updated' ? Edit : Building;
      case 'study':
        return action === 'created' ? Plus : action === 'updated' ? Edit : FileText;
      case 'user':
        return User;
      default:
        return FileText;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'updated':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'completed':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'deleted':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getActionText = (action: string, type: string) => {
    const actions = {
      created: type === 'project' ? 'أنشأ مشروع' : type === 'study' ? 'أنشأ دراسة' : 'انضم',
      updated: type === 'project' ? 'حدث مشروع' : type === 'study' ? 'حدث دراسة' : 'حدث',
      completed: type === 'project' ? 'أكمل مشروع' : type === 'study' ? 'أكمل دراسة' : 'أكمل',
      deleted: type === 'project' ? 'حذف مشروع' : type === 'study' ? 'حذف دراسة' : 'حذف',
    };
    return actions[action as keyof typeof actions] || action;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      COMPLETED: { label: 'مكتمل', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      IN_PROGRESS: { label: 'قيد التطوير', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      DRAFT: { label: 'مسودة', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
      ON_HOLD: { label: 'متوقف', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <Badge variant="outline" className={`text-xs ${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
    
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>النشاط الأخير</CardTitle>
              <CardDescription>آخر التحديثات والأنشطة</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>النشاط الأخير</CardTitle>
            <CardDescription>آخر التحديثات والأنشطة</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/activity">
              عرض الكل
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                لا يوجد نشاط
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                لم يتم تسجيل أي نشاط مؤخراً
              </p>
            </div>
          ) : (
            activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type, activity.action);
              const colorClass = getActivityColor(activity.action);
              
              return (
                <div key={activity.id} className="flex items-start space-x-4 group">
                  <div className={`p-2 rounded-full ${colorClass} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.user.name}
                      </p>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getActionText(activity.action, activity.type)}
                      </span>
                      {getStatusBadge(activity.status)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {activity.link ? (
                          <Link 
                            href={activity.link}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {activity.title}
                          </Link>
                        ) : (
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </p>
                        )}
                        
                        {activity.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {activity.description}
                          </p>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/activity">
                عرض جميع الأنشطة
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
