'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FolderOpen,
  Calendar,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - سيتم استبدالها بـ API calls
  const projects = [
    {
      id: 1,
      name: 'مطعم الأصالة',
      description: 'مطعم تراثي يقدم الأكلات الشعبية السعودية',
      industry: 'مطاعم',
      status: 'active',
      createdAt: '2024-01-10',
      expectedInvestment: 500000,
      expectedRevenue: 1200000,
      roi: 25,
      studiesCount: 3,
      location: 'الرياض',
    },
    {
      id: 2,
      name: 'متجر الإلكترونيات الذكية',
      description: 'متجر إلكتروني متخصص في بيع الأجهزة الذكية',
      industry: 'تجارة إلكترونية',
      status: 'draft',
      createdAt: '2024-01-08',
      expectedInvestment: 200000,
      expectedRevenue: 800000,
      roi: 18,
      studiesCount: 1,
      location: 'جدة',
    },
    {
      id: 3,
      name: 'مركز التدريب التقني',
      description: 'مركز متخصص في التدريب التقني والمهني',
      industry: 'تعليم',
      status: 'completed',
      createdAt: '2024-01-05',
      expectedInvestment: 800000,
      expectedRevenue: 1500000,
      roi: 22,
      studiesCount: 5,
      location: 'الدمام',
    },
    {
      id: 4,
      name: 'مركز اللياقة البدنية',
      description: 'نادي رياضي شامل للرجال والنساء',
      industry: 'رياضة',
      status: 'active',
      createdAt: '2024-01-03',
      expectedInvestment: 300000,
      expectedRevenue: 600000,
      roi: 15,
      studiesCount: 2,
      location: 'الرياض',
    },
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'نشط',
          color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
        };
      case 'draft':
        return {
          label: 'مسودة',
          color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
        };
      case 'completed':
        return {
          label: 'مكتمل',
          color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
        };
      case 'archived':
        return {
          label: 'مؤرشف',
          color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20',
        };
      default:
        return {
          label: status,
          color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20',
        };
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            المشاريع
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة وتتبع مشاريعك ودراسات الجدوى
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="ml-2 h-4 w-4" />
            مشروع جديد
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في المشاريع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="draft">مسودة</option>
            <option value="completed">مكتمل</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => {
          const statusInfo = getStatusInfo(project.status);
          
          return (
            <Card key={project.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {project.industry}
                      </span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/projects/${project.id}`}>
                          <Eye className="ml-2 h-4 w-4" />
                          عرض التفاصيل
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/projects/${project.id}/edit`}>
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 dark:text-red-400">
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">الاستثمار المتوقع:</span>
                    <span className="font-medium">{formatCurrency(project.expectedInvestment)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">الإيرادات المتوقعة:</span>
                    <span className="font-medium">{formatCurrency(project.expectedRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">معدل العائد:</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="font-medium text-green-600">{project.roi}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FolderOpen className="h-3 w-3" />
                      <span>{project.studiesCount} دراسة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(project.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {project.location}
                  </span>
                </div>
                
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/projects/${project.id}`}>
                    عرض المشروع
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            لا توجد مشاريع
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'لم يتم العثور على مشاريع تطابق معايير البحث'
              : 'ابدأ بإنشاء مشروعك الأول'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="ml-2 h-4 w-4" />
                إنشاء مشروع جديد
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
