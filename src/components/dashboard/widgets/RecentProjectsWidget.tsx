'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  FolderOpen, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useProjects } from '@/hooks/useProjects';
import { ProjectStatus } from '@prisma/client';

interface ProjectWithTeam {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  industry: string | null;
  location: string | null;
  currency: string;
  userId: string;
  updatedAt: Date;
  createdAt: Date;
  teamMembers?: Array<{
    id: string;
    name: string;
    role?: string;
    avatar?: string;
  }>;
}

interface RecentProjectsWidgetProps {
  className?: string;
  limit?: number;
}

export function RecentProjectsWidget({ className = '', limit = 5 }: RecentProjectsWidgetProps) {
  const { projects: allProjects, loading, error } = useProjects();
  const [recentProjects, setRecentProjects] = useState<ProjectWithTeam[]>([]);

  useEffect(() => {
    if (allProjects.length > 0) {
      // Sort by updatedAt and take the most recent projects
      const sortedByDate = [...allProjects]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit);
      const projectsWithTeam = sortedByDate.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        industry: project.industry,
        location: project.location,
        currency: project.currency,
        userId: project.userId,
        updatedAt: project.updatedAt,
        createdAt: project.createdAt,
        teamMembers: [] // Will be populated when we have team data
      }));
      setRecentProjects(projectsWithTeam);
    }
  }, [allProjects, limit]);


  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.DRAFT:
        return { 
          label: 'مسودة', 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
          icon: Clock 
        };
      case ProjectStatus.ACTIVE:
        return { 
          label: 'نشط', 
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          icon: Clock 
        };
      case ProjectStatus.COMPLETED:
        return { 
          label: 'مكتمل', 
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          icon: CheckCircle2 
        };
      case ProjectStatus.ARCHIVED:
        return { 
          label: 'مؤرشف', 
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          icon: AlertTriangle 
        };
      default:
        return { 
          label: 'غير محدد', 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
          icon: Clock 
        };
    }
  };

  // Remove priority config since ProjectPriority doesn't exist in the schema

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            المشاريع الأخيرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-4 border rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
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
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            المشاريع الأخيرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3" />
            <p>خطأ في تحميل المشاريع</p>
            <p className="text-sm text-gray-500 mt-1">يرجى المحاولة مرة أخرى</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          المشاريع الأخيرة
        </CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/projects" className="flex items-center gap-1">
            عرض الكل
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentProjects.map((project) => {
          const statusConfig = getStatusConfig(project.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={project.id} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Link href={`/projects/${project.id}`}>
                    <h4 className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {project.name}
                    </h4>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {project.description || 'لا يوجد وصف'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={statusConfig.color}>
                    <StatusIcon className="h-3 w-3 ml-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>الصناعة:</span>
                  <span className="font-medium">
                    {project.industry || 'غير محدد'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{project.teamMembers?.length || 0} أعضاء</span>
                </div>
              </div>


              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  آخر تحديث: {formatDistanceToNow(new Date(project.updatedAt), { 
                    addSuffix: true, 
                    locale: ar 
                  })}
                </div>
                <div className="text-sm font-medium">
                  {project.currency}
                </div>
              </div>

              {/* أعضاء الفريق */}
              {project.teamMembers && project.teamMembers.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">الفريق:</span>
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map((member, index) => (
                      <Avatar key={member.id} className="w-6 h-6 border-2 border-white dark:border-gray-800">
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          +{project.teamMembers.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {recentProjects.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد مشاريع حالياً</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
