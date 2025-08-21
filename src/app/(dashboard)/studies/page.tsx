'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Trash2,
  Download,
  Share
} from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function StudiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - سيتم استبدالها بـ API calls
  const studies = [
    {
      id: 1,
      title: 'دراسة جدوى مطعم الأصالة',
      type: 'comprehensive',
      status: 'completed',
      projectName: 'مطعم الأصالة',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-18',
      roi: 25,
      npv: 450000,
      paybackPeriod: 18,
      language: 'ar',
      aiModel: 'gemini',
      progress: 100,
    },
    {
      id: 2,
      title: 'التحليل المالي للمتجر الإلكتروني',
      type: 'economic',
      status: 'in_progress',
      projectName: 'متجر الإلكترونيات الذكية',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-16',
      roi: 18,
      npv: 320000,
      paybackPeriod: 24,
      language: 'ar',
      aiModel: 'openai',
      progress: 75,
    },
    {
      id: 3,
      title: 'دراسة جدوى تقنية للمركز التدريبي',
      type: 'technical',
      status: 'draft',
      projectName: 'مركز التدريب التقني',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-14',
      roi: 22,
      npv: 380000,
      paybackPeriod: 20,
      language: 'ar',
      aiModel: 'gemini',
      progress: 30,
    },
    {
      id: 4,
      title: 'التحليل التشغيلي لمركز اللياقة',
      type: 'operational',
      status: 'reviewed',
      projectName: 'مركز اللياقة البدنية',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12',
      roi: 15,
      npv: 280000,
      paybackPeriod: 30,
      language: 'ar',
      aiModel: 'openai',
      progress: 100,
    },
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'مكتملة',
          color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
        };
      case 'in_progress':
        return {
          label: 'قيد التطوير',
          color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
        };
      case 'reviewed':
        return {
          label: 'تمت المراجعة',
          color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
        };
      case 'draft':
        return {
          label: 'مسودة',
          color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
        };
      default:
        return {
          label: status,
          color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20',
        };
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'comprehensive':
        return 'شاملة';
      case 'economic':
        return 'اقتصادية';
      case 'technical':
        return 'تقنية';
      case 'operational':
        return 'تشغيلية';
      case 'legal':
        return 'قانونية';
      default:
        return type;
    }
  };

  const filteredStudies = studies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || study.status === filterStatus;
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
            دراسات الجدوى
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة وتتبع دراسات الجدوى الخاصة بمشاريعك
          </p>
        </div>
        <Button asChild>
          <Link href="/studies/new">
            <Plus className="ml-2 h-4 w-4" />
            دراسة جديدة
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في الدراسات..."
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
            <option value="completed">مكتملة</option>
            <option value="in_progress">قيد التطوير</option>
            <option value="reviewed">تمت المراجعة</option>
            <option value="draft">مسودة</option>
          </select>
        </div>
      </div>

      {/* Studies Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudies.map((study) => {
          const statusInfo = getStatusInfo(study.status);
          
          return (
            <Card key={study.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {study.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                        {getTypeInfo(study.type)}
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
                        <Link href={`/studies/${study.id}`}>
                          <Eye className="ml-2 h-4 w-4" />
                          عرض الدراسة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/studies/${study.id}/edit`}>
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Download className="ml-2 h-4 w-4" />
                        تحميل PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="ml-2 h-4 w-4" />
                        مشاركة
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
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">المشروع:</span> {study.projectName}
                </div>
                
                {/* Progress Bar */}
                {study.status === 'in_progress' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>التقدم</span>
                      <span>{study.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${study.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">معدل العائد:</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="font-medium text-green-600">{study.roi}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">القيمة الحالية الصافية:</span>
                    <span className="font-medium">{formatCurrency(study.npv)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">فترة الاسترداد:</span>
                    <span className="font-medium">{study.paybackPeriod} شهر</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(study.updatedAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {study.aiModel === 'gemini' ? 'Gemini AI' : 'OpenAI'}
                  </div>
                </div>
                
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/studies/${study.id}`}>
                    عرض الدراسة
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredStudies.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            لا توجد دراسات جدوى
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'لم يتم العثور على دراسات تطابق معايير البحث'
              : 'ابدأ بإنشاء دراسة الجدوى الأولى'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button asChild>
              <Link href="/studies/new">
                <Plus className="ml-2 h-4 w-4" />
                إنشاء دراسة جديدة
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
