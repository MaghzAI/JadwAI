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

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  progress: number;
  startDate: string;
  endDate: string;
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  lastActivity: string;
  budget: number;
  currency: string;
}

interface RecentProjectsWidgetProps {
  className?: string;
  limit?: number;
}

export function RecentProjectsWidget({ className = '', limit = 5 }: RecentProjectsWidgetProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentProjects();
  }, []);

  const fetchRecentProjects = async () => {
    try {
      // Mock data - سيتم استبداله بـ API call حقيقي
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProjects([
        {
          id: '1',
          title: 'مطعم الأصالة العربية',
          description: 'مشروع مطعم تراثي في حي الملك فهد',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          progress: 75,
          startDate: '2024-01-15',
          endDate: '2024-03-30',
          teamMembers: [
            { id: '1', name: 'أحمد محمد', role: 'مدير المشروع' },
            { id: '2', name: 'فاطمة علي', role: 'محلل مالي' }
          ],
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          budget: 850000,
          currency: 'SAR'
        },
        {
          id: '2',
          title: 'متجر إلكتروني للأزياء',
          description: 'منصة تجارة إلكترونية للملابس النسائية',
          status: 'PLANNING',
          priority: 'MEDIUM',
          progress: 25,
          startDate: '2024-02-01',
          endDate: '2024-05-15',
          teamMembers: [
            { id: '3', name: 'سارة أحمد', role: 'مطور واجهات' },
            { id: '4', name: 'محمد خالد', role: 'مطور خلفي' }
          ],
          lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          budget: 420000,
          currency: 'SAR'
        },
        {
          id: '3',
          title: 'عيادة طب الأسنان',
          description: 'عيادة متخصصة في طب وتجميل الأسنان',
          status: 'COMPLETED',
          priority: 'LOW',
          progress: 100,
          startDate: '2023-10-01',
          endDate: '2024-01-15',
          teamMembers: [
            { id: '5', name: 'د. عبدالله سالم', role: 'استشاري طبي' }
          ],
          lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          budget: 1200000,
          currency: 'SAR'
        },
        {
          id: '4',
          title: 'مركز تدريب تقني',
          description: 'مركز لتدريب الشباب على التقنيات الحديثة',
          status: 'ON_HOLD',
          priority: 'URGENT',
          progress: 40,
          startDate: '2024-01-01',
          endDate: '2024-06-30',
          teamMembers: [
            { id: '6', name: 'خالد العمري', role: 'مدرب تقني' },
            { id: '7', name: 'نورا السالم', role: 'منسق تدريب' }
          ],
          lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          budget: 750000,
          currency: 'SAR'
        },
        {
          id: '5',
          title: 'تطبيق توصيل طعام',
          description: 'تطبيق جوال لتوصيل الطعام في المدينة',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          progress: 60,
          startDate: '2024-01-20',
          endDate: '2024-04-20',
          teamMembers: [
            { id: '8', name: 'علي حسن', role: 'مطور تطبيقات' },
            { id: '9', name: 'مريم أحمد', role: 'مصمم UX/UI' }
          ],
          lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          budget: 650000,
          currency: 'SAR'
        }
      ].slice(0, limit));
    } catch (error) {
      console.error('Error fetching recent projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: Project['status']) => {
    switch (status) {
      case 'PLANNING':
        return { 
          label: 'تخطيط', 
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          icon: Clock 
        };
      case 'IN_PROGRESS':
        return { 
          label: 'قيد التنفيذ', 
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          icon: Clock 
        };
      case 'COMPLETED':
        return { 
          label: 'مكتمل', 
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          icon: CheckCircle2 
        };
      case 'ON_HOLD':
        return { 
          label: 'متوقف', 
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

  const getPriorityConfig = (priority: Project['priority']) => {
    switch (priority) {
      case 'LOW':
        return { label: 'منخفضة', color: 'text-green-600 dark:text-green-400' };
      case 'MEDIUM':
        return { label: 'متوسطة', color: 'text-yellow-600 dark:text-yellow-400' };
      case 'HIGH':
        return { label: 'عالية', color: 'text-orange-600 dark:text-orange-400' };
      case 'URGENT':
        return { label: 'عاجلة', color: 'text-red-600 dark:text-red-400' };
      default:
        return { label: 'غير محدد', color: 'text-gray-600 dark:text-gray-400' };
    }
  };

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
        {projects.map((project) => {
          const statusConfig = getStatusConfig(project.status);
          const priorityConfig = getPriorityConfig(project.priority);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={project.id} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Link href={`/projects/${project.id}`}>
                    <h4 className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {project.title}
                    </h4>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {project.description}
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
                  <span>الأولوية:</span>
                  <span className={`font-medium ${priorityConfig.color}`}>
                    {priorityConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{project.teamMembers.length} أعضاء</span>
                </div>
              </div>

              {/* شريط التقدم */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>التقدم</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  آخر نشاط: {formatDistanceToNow(new Date(project.lastActivity), { 
                    addSuffix: true, 
                    locale: ar 
                  })}
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(project.budget, project.currency)}
                </div>
              </div>

              {/* أعضاء الفريق */}
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
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
