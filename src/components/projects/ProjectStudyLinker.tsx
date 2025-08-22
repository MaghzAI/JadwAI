'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Plus, 
  Link, 
  Search, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Unlink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface FeasibilityStudy {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  financialSummary: {
    initialInvestment: number;
    expectedRevenue: number;
    roi: number;
    paybackPeriod: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: 'proceed' | 'proceed_with_caution' | 'not_recommended';
  linkedProjectId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  linkedStudies: string[];
}

interface ProjectStudyLinkerProps {
  project: Project;
  availableStudies: FeasibilityStudy[];
  linkedStudies: FeasibilityStudy[];
  onLinkStudy: (projectId: string, studyId: string) => void;
  onUnlinkStudy: (projectId: string, studyId: string) => void;
  onCreateNewStudy: (projectId: string, studyData: Partial<FeasibilityStudy>) => void;
}

export function ProjectStudyLinker({
  project,
  availableStudies,
  linkedStudies,
  onLinkStudy,
  onUnlinkStudy,
  onCreateNewStudy
}: ProjectStudyLinkerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newStudyData, setNewStudyData] = useState({
    title: `دراسة جدوى - ${project.name}`,
    description: project.description,
    category: project.category
  });

  const getStatusColor = (status: FeasibilityStudy['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: FeasibilityStudy['status']) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'in_progress': return 'قيد المراجعة';
      case 'completed': return 'مكتملة';
      case 'approved': return 'معتمدة';
      case 'rejected': return 'مرفوضة';
      default: return status;
    }
  };

  const getRiskColor = (risk: FeasibilityStudy['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRecommendationIcon = (recommendation: FeasibilityStudy['recommendation']) => {
    switch (recommendation) {
      case 'proceed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'proceed_with_caution':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'not_recommended':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getRecommendationText = (recommendation: FeasibilityStudy['recommendation']) => {
    switch (recommendation) {
      case 'proceed': return 'موصى بالتنفيذ';
      case 'proceed_with_caution': return 'التنفيذ بحذر';
      case 'not_recommended': return 'غير موصى بالتنفيذ';
    }
  };

  const filteredStudies = availableStudies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || study.status === statusFilter;
    const isNotLinked = !project.linkedStudies.includes(study.id);
    
    return matchesSearch && matchesStatus && isNotLinked;
  });

  const handleCreateStudy = () => {
    onCreateNewStudy(project.id, newStudyData);
    setIsCreateDialogOpen(false);
    setNewStudyData({
      title: `دراسة جدوى - ${project.name}`,
      description: project.description,
      category: project.category
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ربط دراسات الجدوى
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            اربط مشروع "{project.name}" بدراسات الجدوى ذات الصلة
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إنشاء دراسة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إنشاء دراسة جدوى جديدة</DialogTitle>
              <DialogDescription>
                إنشاء دراسة جدوى مرتبطة بمشروع "{project.name}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الدراسة</Label>
                <Input
                  id="title"
                  value={newStudyData.title}
                  onChange={(e) => setNewStudyData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="عنوان دراسة الجدوى"
                />
              </div>
              <div>
                <Label htmlFor="description">وصف الدراسة</Label>
                <textarea
                  id="description"
                  value={newStudyData.description}
                  onChange={(e) => setNewStudyData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف مفصل لدراسة الجدوى"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select 
                  value={newStudyData.category} 
                  onValueChange={(value) => setNewStudyData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مطاعم ومقاهي">مطاعم ومقاهي</SelectItem>
                    <SelectItem value="تجارة إلكترونية">تجارة إلكترونية</SelectItem>
                    <SelectItem value="تقنية ومعلومات">تقنية ومعلومات</SelectItem>
                    <SelectItem value="تعليم وتدريب">تعليم وتدريب</SelectItem>
                    <SelectItem value="صحة وطب">صحة وطب</SelectItem>
                    <SelectItem value="سياحة وضيافة">سياحة وضيافة</SelectItem>
                    <SelectItem value="أخرى">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateStudy}>
                  إنشاء الدراسة
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Linked Studies */}
      {linkedStudies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              الدراسات المرتبطة ({linkedStudies.length})
            </CardTitle>
            <CardDescription>
              دراسات الجدوى المرتبطة بهذا المشروع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {linkedStudies.map((study) => (
                <div key={study.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{study.title}</h4>
                      <Badge className={getStatusColor(study.status)}>
                        {getStatusText(study.status)}
                      </Badge>
                      {study.recommendation && (
                        <div className="flex items-center gap-1">
                          {getRecommendationIcon(study.recommendation)}
                          <span className="text-sm">
                            {getRecommendationText(study.recommendation)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {study.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(study.updatedAt, 'dd/MM/yyyy', { locale: ar })}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ROI: {study.financialSummary.roi}%
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className={getRiskColor(study.riskLevel)}>
                          {study.riskLevel === 'low' ? 'مخاطر منخفضة' :
                           study.riskLevel === 'medium' ? 'مخاطر متوسطة' : 'مخاطر عالية'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      عرض
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onUnlinkStudy(project.id, study.id)}
                    >
                      <Unlink className="h-4 w-4 mr-1" />
                      إلغاء الربط
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Studies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            دراسات الجدوى المتاحة
          </CardTitle>
          <CardDescription>
            اختر دراسات الجدوى لربطها بهذا المشروع
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في دراسات الجدوى..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="in_progress">قيد المراجعة</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="approved">معتمدة</SelectItem>
                <SelectItem value="rejected">مرفوضة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Studies List */}
          {filteredStudies.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                لا توجد دراسات متاحة
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                لم يتم العثور على دراسات جدوى متاحة للربط
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredStudies.map((study) => (
                <div key={study.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{study.title}</h4>
                      <Badge className={getStatusColor(study.status)}>
                        {getStatusText(study.status)}
                      </Badge>
                      {study.recommendation && (
                        <div className="flex items-center gap-1">
                          {getRecommendationIcon(study.recommendation)}
                          <span className="text-sm">
                            {getRecommendationText(study.recommendation)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {study.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(study.updatedAt, 'dd/MM/yyyy', { locale: ar })}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        الاستثمار: {study.financialSummary.initialInvestment.toLocaleString()} ريال
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        ROI: {study.financialSummary.roi}%
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={getRiskColor(study.riskLevel)}>
                          {study.riskLevel === 'low' ? 'مخاطر منخفضة' :
                           study.riskLevel === 'medium' ? 'مخاطر متوسطة' : 'مخاطر عالية'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      بواسطة {study.author.name} • {study.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      معاينة
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => onLinkStudy(project.id, study.id)}
                    >
                      <Link className="h-4 w-4 mr-1" />
                      ربط
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Study Analysis Summary */}
      {linkedStudies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>تحليل الدراسات المرتبطة</CardTitle>
            <CardDescription>
              ملخص تحليلي للدراسات المرتبطة بالمشروع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  الدراسات الموصى بها
                </h4>
                <div className="text-2xl font-bold text-green-600">
                  {linkedStudies.filter(s => s.recommendation === 'proceed').length}
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  التنفيذ بحذر
                </h4>
                <div className="text-2xl font-bold text-yellow-600">
                  {linkedStudies.filter(s => s.recommendation === 'proceed_with_caution').length}
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                  غير موصى بالتنفيذ
                </h4>
                <div className="text-2xl font-bold text-red-600">
                  {linkedStudies.filter(s => s.recommendation === 'not_recommended').length}
                </div>
              </div>
            </div>
            
            {linkedStudies.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-4">متوسط المؤشرات المالية</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">متوسط ROI</p>
                    <p className="text-lg font-semibold">
                      {Math.round(linkedStudies.reduce((sum, s) => sum + s.financialSummary.roi, 0) / linkedStudies.length)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">متوسط الاستثمار</p>
                    <p className="text-lg font-semibold">
                      {Math.round(linkedStudies.reduce((sum, s) => sum + s.financialSummary.initialInvestment, 0) / linkedStudies.length).toLocaleString()} ريال
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">متوسط الإيرادات</p>
                    <p className="text-lg font-semibold">
                      {Math.round(linkedStudies.reduce((sum, s) => sum + s.financialSummary.expectedRevenue, 0) / linkedStudies.length).toLocaleString()} ريال
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">متوسط فترة الاسترداد</p>
                    <p className="text-lg font-semibold">
                      {Math.round(linkedStudies.reduce((sum, s) => sum + s.financialSummary.paybackPeriod, 0) / linkedStudies.length)} شهر
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
