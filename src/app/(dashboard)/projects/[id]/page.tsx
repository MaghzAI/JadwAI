'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load chart components for better performance
const ROIChart = lazy(() => import('@/components/charts/ROIChart'));
const CashFlowChart = lazy(() => import('@/components/charts/CashFlowChart'));
const RiskMatrix = lazy(() => import('@/components/charts/RiskMatrix'));
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Share,
  Download,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  Target,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Briefcase,
  BarChart3,
  PieChart,
  LineChart,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Project {
  id: number;
  name: string;
  description: string;
  type: string;
  industry: string;
  location: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  currency: string;
  initialInvestment: number | null;
  expectedRevenue: number | null;
  targetMarket: string | null;
  projectDuration: number | null;
  teamSize: number | null;
  businessModel: string | null;
  competitiveAdvantage: string | null;
  risks: string | null;
  successMetrics: string | null;
  createdAt: string;
  updatedAt: string;
  feasibilityStudies: Array<{
    id: number;
    title: string;
    type: string;
    status: string;
    createdAt: string;
  }>;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error('فشل في جلب بيانات المشروع');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return {
          label: 'في التخطيط',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          icon: Clock,
        };
      case 'IN_PROGRESS':
        return {
          label: 'قيد التنفيذ',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          icon: TrendingUp,
        };
      case 'COMPLETED':
        return {
          label: 'مكتمل',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          icon: CheckCircle,
        };
      case 'ON_HOLD':
        return {
          label: 'متوقف مؤقتاً',
          color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
          icon: AlertTriangle,
        };
      case 'CANCELLED':
        return {
          label: 'ملغي',
          color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          icon: AlertTriangle,
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
          icon: Clock,
        };
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'STARTUP':
        return { label: 'شركة ناشئة', icon: TrendingUp };
      case 'EXPANSION':
        return { label: 'توسع', icon: BarChart3 };
      case 'NEW_PRODUCT':
        return { label: 'منتج جديد', icon: Plus };
      case 'ACQUISITION':
        return { label: 'استحواذ', icon: Building };
      case 'FRANCHISE':
        return { label: 'امتياز', icon: Briefcase };
      default:
        return { label: type, icon: Building };
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'غير محدد';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: project?.currency || 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('فشل في حذف المشروع');
      }

      router.push('/projects');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء حذف المشروع');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {error || 'المشروع غير موجود'}
        </h1>
        <Button asChild variant="outline">
          <Link href="/projects">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للمشاريع
          </Link>
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(project.status);
  const typeInfo = getTypeInfo(project.type);
  const StatusIcon = statusInfo.icon;
  const TypeIcon = typeInfo.icon;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 ml-1" />
              العودة للمشاريع
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h1>
              <Badge className={statusInfo.color}>
                <StatusIcon className="w-3 h-3 ml-1" />
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {project.description}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/projects/${project.id}/edit`}>
              <Edit className="ml-2 h-4 w-4" />
              تعديل
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">المزيد</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share className="ml-2 h-4 w-4" />
                مشاركة
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="ml-2 h-4 w-4" />
                تحميل التقرير
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600 dark:text-red-400">
                <Trash2 className="ml-2 h-4 w-4" />
                حذف المشروع
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Project Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              نظرة عامة على المشروع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">نوع المشروع</label>
                <div className="flex items-center gap-2 mt-1">
                  <TypeIcon className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{typeInfo.label}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">القطاع</label>
                <p className="font-medium">{project.industry}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الموقع</label>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{project.location}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">مدة المشروع</label>
                <p className="font-medium">
                  {project.projectDuration ? `${project.projectDuration} شهر` : 'غير محددة'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">حجم الفريق</label>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {project.teamSize ? `${project.teamSize} شخص` : 'غير محدد'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">العملة</label>
                <p className="font-medium">{project.currency}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              الملخص المالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">رأس المال المطلوب</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {project.initialInvestment?.toLocaleString('ar-SA')} {project.currency}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">العائد المتوقع</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {project.expectedRevenue?.toLocaleString('ar-SA')} {project.currency}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">فترة الاسترداد</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {project.projectDuration} سنة
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">العائد على الاستثمار</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {((project.expectedRevenue && project.initialInvestment) ? ((project.expectedRevenue - project.initialInvestment) / project.initialInvestment * 100).toFixed(1) : '0')}%
                </p>
              </div>
            </div>

            {/* Financial Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  العائد على الاستثمار المتوقع
                </h4>
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <ROIChart 
                    data={[
                      { year: 1, roi: 12, cumulativeROI: 12 },
                      { year: 2, roi: 18, cumulativeROI: 30 },
                      { year: 3, roi: 25, cumulativeROI: 55 },
                      { year: 4, roi: 28, cumulativeROI: 83 },
                      { year: 5, roi: 30, cumulativeROI: 113 }
                    ]}
                    title="توقعات العائد لـ 5 سنوات"
                  />
                </Suspense>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  التدفق النقدي المتوقع
                </h4>
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <CashFlowChart 
                    data={[
                      { period: 'السنة 1', inflow: 600000, outflow: 400000, netFlow: 200000, cumulative: 200000 },
                      { period: 'السنة 2', inflow: 800000, outflow: 320000, netFlow: 480000, cumulative: 680000 },
                      { period: 'السنة 3', inflow: 1000000, outflow: 240000, netFlow: 760000, cumulative: 1440000 },
                      { period: 'السنة 4', inflow: 1200000, outflow: 200000, netFlow: 1000000, cumulative: 2440000 },
                      { period: 'السنة 5', inflow: 1400000, outflow: 160000, netFlow: 1240000, cumulative: 3680000 }
                    ]}
                    currency={project.currency}
                  />
                </Suspense>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Business Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              تفاصيل الأعمال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.targetMarket && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">السوق المستهدف</label>
                <p className="mt-1 text-gray-900 dark:text-white">{project.targetMarket}</p>
              </div>
            )}
            {project.businessModel && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">نموذج الأعمال</label>
                <p className="mt-1 text-gray-900 dark:text-white">{project.businessModel}</p>
              </div>
            )}
            {project.competitiveAdvantage && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الميزة التنافسية</label>
                <p className="mt-1 text-gray-900 dark:text-white">{project.competitiveAdvantage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        {(project.risks || project.successMetrics) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                التحليل والمقاييس
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.risks && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">المخاطر المحتملة</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{project.risks}</p>
                </div>
              )}
              {project.successMetrics && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">مقاييس النجاح</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{project.successMetrics}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Feasibility Studies */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            دراسات الجدوى ({project.feasibilityStudies.length})
          </CardTitle>
          <Button asChild>
            <Link href={`/studies/new?projectId=${project.id}`}>
              <Plus className="ml-2 h-4 w-4" />
              إنشاء دراسة جديدة
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {project.feasibilityStudies.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                لا توجد دراسات جدوى
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                ابدأ بإنشاء دراسة الجدوى الأولى لهذا المشروع
              </p>
              <Button asChild>
                <Link href={`/studies/new?projectId=${project.id}`}>
                  <Plus className="ml-2 h-4 w-4" />
                  إنشاء دراسة الجدوى
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {project.feasibilityStudies.map((study) => (
                <Card key={study.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm font-medium">{study.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {study.type === 'comprehensive' ? 'شاملة' :
                           study.type === 'economic' ? 'اقتصادية' :
                           study.type === 'technical' ? 'تقنية' : study.type}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {study.status === 'COMPLETED' ? 'مكتملة' :
                         study.status === 'IN_PROGRESS' ? 'قيد التطوير' :
                         study.status === 'DRAFT' ? 'مسودة' : study.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(study.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/studies/${study.id}`}>
                          عرض
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            معلومات زمنية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-gray-600 dark:text-gray-400">تاريخ الإنشاء</label>
              <p className="font-medium">
                {new Date(project.createdAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <label className="text-gray-600 dark:text-gray-400">آخر تحديث</label>
              <p className="font-medium">
                {new Date(project.updatedAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
