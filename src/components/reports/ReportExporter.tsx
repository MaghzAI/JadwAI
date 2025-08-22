'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage,
  Settings,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ReportExporterProps {
  projectId?: string;
  reportType?: 'project' | 'financial' | 'roi' | 'timeline' | 'custom';
  data?: any;
}

interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv' | 'png';
  sections: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  includeSummary: boolean;
  includeCharts: boolean;
  includeDetails: boolean;
  customTitle?: string;
  customNotes?: string;
}

interface ExportJob {
  id: string;
  name: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  size?: string;
}

export function ReportExporter({ projectId, reportType = 'project', data }: ReportExporterProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [config, setConfig] = useState<ExportConfig>({
    format: 'pdf',
    sections: ['overview', 'financial', 'timeline'],
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    },
    includeSummary: true,
    includeCharts: true,
    includeDetails: true,
  });

  const formatOptions = [
    { 
      value: 'pdf', 
      label: 'PDF', 
      icon: FileText, 
      description: 'ملف PDF قابل للطباعة مع التنسيق الكامل',
      size: '~2-5 ميجابايت'
    },
    { 
      value: 'excel', 
      label: 'Excel', 
      icon: FileSpreadsheet, 
      description: 'جدول بيانات Excel قابل للتحرير',
      size: '~1-3 ميجابايت'
    },
    { 
      value: 'csv', 
      label: 'CSV', 
      icon: FileText, 
      description: 'ملف CSV للبيانات الخام',
      size: '~100-500 كيلوبايت'
    },
    { 
      value: 'png', 
      label: 'صورة', 
      icon: FileImage, 
      description: 'صورة عالية الجودة للتقرير',
      size: '~1-2 ميجابايت'
    }
  ];

  const sectionOptions = [
    { id: 'overview', label: 'نظرة عامة', description: 'معلومات المشروع الأساسية' },
    { id: 'financial', label: 'التحليل المالي', description: 'الإيرادات والمصروفات والربحية' },
    { id: 'roi', label: 'تحليل العائد', description: 'ROI وتحليل المخاطر' },
    { id: 'timeline', label: 'الجدول الزمني', description: 'مراحل المشروع والمعالم' },
    { id: 'feasibility', label: 'دراسات الجدوى', description: 'الدراسات المرتبطة' },
    { id: 'team', label: 'الفريق', description: 'أعضاء الفريق والأدوار' },
    { id: 'risks', label: 'المخاطر', description: 'تحليل وإدارة المخاطر' },
    { id: 'documents', label: 'المرفقات', description: 'الملفات والوثائق' }
  ];

  const handleExport = async () => {
    const jobId = `export_${Date.now()}`;
    const newJob: ExportJob = {
      id: jobId,
      name: `${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}`,
      format: config.format,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    setExportJobs(prev => [newJob, ...prev]);
    setIsDialogOpen(false);

    // Simulate export process
    simulateExport(jobId);
  };

  const simulateExport = async (jobId: string) => {
    const updateJob = (updates: Partial<ExportJob>) => {
      setExportJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      ));
    };

    // Start processing
    updateJob({ status: 'processing', progress: 10 });

    // Simulate progress
    for (let progress = 20; progress <= 90; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateJob({ progress });
    }

    // Complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateJob({
      status: 'completed',
      progress: 100,
      completedAt: new Date(),
      downloadUrl: `/api/exports/${jobId}`,
      size: config.format === 'csv' ? '256 كيلوبايت' : 
            config.format === 'excel' ? '2.1 ميجابايت' : 
            config.format === 'png' ? '1.8 ميجابايت' : '3.4 ميجابايت'
    });
  };

  const handleDownload = (job: ExportJob) => {
    // In a real app, this would download the file
    const link = document.createElement('a');
    link.href = job.downloadUrl || '#';
    link.download = `${job.name}.${job.format}`;
    link.click();
  };

  const deleteJob = (jobId: string) => {
    setExportJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const getStatusColor = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return Clock;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                تصدير التقارير
              </CardTitle>
              <CardDescription>
                إنشاء وتصدير التقارير بصيغ مختلفة
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  تصدير جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>إعدادات التصدير</DialogTitle>
                  <DialogDescription>
                    اختر تنسيق التصدير والأقسام المطلوبة
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Format Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">تنسيق الملف</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {formatOptions.map((format) => {
                        const Icon = format.icon;
                        return (
                          <div
                            key={format.value}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              config.format === format.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setConfig(prev => ({ ...prev, format: format.value as any }))}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="h-5 w-5 text-blue-600" />
                              <span className="font-medium">{format.label}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {format.description}
                            </p>
                            <p className="text-xs text-gray-500">{format.size}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">أقسام التقرير</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {sectionOptions.map((section) => (
                        <div key={section.id} className="flex items-start space-x-3 space-x-reverse">
                          <Checkbox
                            id={section.id}
                            checked={config.sections.includes(section.id)}
                            onCheckedChange={(checked) => {
                              setConfig(prev => ({
                                ...prev,
                                sections: checked
                                  ? [...prev.sections, section.id]
                                  : prev.sections.filter(s => s !== section.id)
                              }));
                            }}
                          />
                          <div className="flex-1">
                            <Label htmlFor={section.id} className="font-medium cursor-pointer">
                              {section.label}
                            </Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {section.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">خيارات إضافية</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id="includeSummary"
                          checked={config.includeSummary}
                          onCheckedChange={(checked) => 
                            setConfig(prev => ({ ...prev, includeSummary: !!checked }))
                          }
                        />
                        <Label htmlFor="includeSummary" className="cursor-pointer">
                          تضمين الملخص التنفيذي
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id="includeCharts"
                          checked={config.includeCharts}
                          onCheckedChange={(checked) => 
                            setConfig(prev => ({ ...prev, includeCharts: !!checked }))
                          }
                        />
                        <Label htmlFor="includeCharts" className="cursor-pointer">
                          تضمين الرسوم البيانية
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id="includeDetails"
                          checked={config.includeDetails}
                          onCheckedChange={(checked) => 
                            setConfig(prev => ({ ...prev, includeDetails: !!checked }))
                          }
                        />
                        <Label htmlFor="includeDetails" className="cursor-pointer">
                          تضمين التفاصيل الكاملة
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Custom Fields */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">إعدادات مخصصة</Label>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="customTitle">عنوان مخصص</Label>
                        <Input
                          id="customTitle"
                          placeholder="عنوان التقرير (اختياري)"
                          value={config.customTitle || ''}
                          onChange={(e) => setConfig(prev => ({ ...prev, customTitle: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="customNotes">ملاحظات إضافية</Label>
                        <Textarea
                          id="customNotes"
                          placeholder="ملاحظات أو تعليقات إضافية..."
                          value={config.customNotes || ''}
                          onChange={(e) => setConfig(prev => ({ ...prev, customNotes: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={handleExport} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    بدء التصدير
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Export Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>سجل التصدير</CardTitle>
          <CardDescription>
            عمليات التصدير الحالية والسابقة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {exportJobs.length === 0 ? (
            <div className="text-center py-8">
              <Download className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                لا توجد عمليات تصدير
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                ابدأ بإنشاء تقرير جديد لتصديره
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {exportJobs.map((job) => {
                const StatusIcon = getStatusIcon(job.status);
                return (
                  <div key={job.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full ${getStatusColor(job.status)} text-white`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{job.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {job.format.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>
                          {format(job.createdAt, 'PPp', { locale: ar })}
                        </span>
                        {job.size && <span>{job.size}</span>}
                      </div>
                      {job.status === 'processing' && (
                        <Progress value={job.progress} className="mt-2" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      {job.status === 'completed' && job.downloadUrl && (
                        <Button size="sm" onClick={() => handleDownload(job)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteJob(job.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
