'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Users,
  Calendar,
  Target,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';

interface StatsData {
  totalProjects: number;
  totalStudies: number;
  completedProjects: number;
  completedStudies: number;
  totalInvestment: number;
  totalRevenue: number;
  activeUsers: number;
  thisMonthProjects: number;
  thisMonthStudies: number;
  averageROI: number;
  currency: string;
}

interface StatsOverviewProps {
  data: StatsData;
  loading?: boolean;
}

export default function StatsOverview({ data, loading = false }: StatsOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: data.currency || 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'إجمالي المشاريع',
      value: formatNumber(data.totalProjects),
      description: `${formatNumber(data.thisMonthProjects)} هذا الشهر`,
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'دراسات الجدوى',
      value: formatNumber(data.totalStudies),
      description: `${formatNumber(data.thisMonthStudies)} هذا الشهر`,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'إجمالي الاستثمار',
      value: formatCurrency(data.totalInvestment),
      description: 'رأس المال المستثمر',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'الإيرادات المتوقعة',
      value: formatCurrency(data.totalRevenue),
      description: 'إجمالي الإيرادات',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'المشاريع المكتملة',
      value: formatNumber(data.completedProjects),
      description: `من ${formatNumber(data.totalProjects)} مشروع`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
      title: 'الدراسات المكتملة',
      value: formatNumber(data.completedStudies),
      description: `من ${formatNumber(data.totalStudies)} دراسة`,
      icon: Award,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/20',
    },
    {
      title: 'متوسط العائد',
      value: `${data.averageROI.toFixed(1)}%`,
      description: 'العائد على الاستثمار',
      icon: Target,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100 dark:bg-rose-900/20',
    },
    {
      title: 'المستخدمون النشطون',
      value: formatNumber(data.activeUsers),
      description: 'المستخدمون الحاليون',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>
            </CardContent>
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/30 dark:to-gray-900/30 pointer-events-none"></div>
          </Card>
        );
      })}
    </div>
  );
}
