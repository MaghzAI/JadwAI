'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load chart components for better performance
const ROIChart = lazy(() => import('@/components/charts/ROIChart'));
const CashFlowChart = lazy(() => import('@/components/charts/CashFlowChart'));
const RiskMatrix = lazy(() => import('@/components/charts/RiskMatrix'));
const MarketShareChart = lazy(() => import('@/components/charts/MarketShareChart'));
const SensitivityChart = lazy(() => import('@/components/charts/SensitivityChart'));
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
  Brain,
  Cpu,
  User,
  Globe,
  Zap,
  Shield,
  Settings,
  BookOpen,
  Calculator,
  LineChart,
  PiggyBank,
  Lightbulb,
  Award
} from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FeasibilityStudy {
  id: number;
  title: string;
  description: string;
  type: 'comprehensive' | 'economic' | 'technical';
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED';
  aiModel: 'gemini-pro' | 'gpt-4' | 'claude-3';
  language: string;
  currency: string;
  projectId: number;
  project: {
    id: number;
    name: string;
    type: string;
    industry: string;
  };
  executiveSummary: string | null;
  marketAnalysis: string | null;
  technicalAnalysis: string | null;
  financialAnalysis: string | null;
  riskAssessment: string | null;
  recommendations: string | null;
  assumptions: string | null;
  methodology: string | null;
  initialInvestment: number | null;
  projectedRevenue: number | null;
  breakEvenPoint: number | null;
  roi: number | null;
  npv: number | null;
  irr: number | null;
  paybackPeriod: number | null;
  sensitivityAnalysis: string | null;
  competitorAnalysis: string | null;
  swotAnalysis: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function StudyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [study, setStudy] = useState<FeasibilityStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const response = await fetch(`/api/studies/simple/${params.id}`);
        if (!response.ok) {
          throw new Error('فشل في جلب بيانات الدراسة');
        }
        const data = await response.json();
        setStudy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStudy();
    }
  }, [params.id]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return {
          label: 'مسودة',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
          icon: FileText,
        };
      case 'IN_PROGRESS':
        return {
          label: 'قيد التطوير',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          icon: Clock,
        };
      case 'COMPLETED':
        return {
          label: 'مكتملة',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          icon: CheckCircle,
        };
      case 'REVIEWED':
        return {
          label: 'تم المراجعة',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
          icon: Award,
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
          icon: FileText,
        };
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'comprehensive':
        return { label: 'دراسة شاملة', icon: BookOpen };
      case 'economic':
        return { label: 'دراسة اقتصادية', icon: Calculator };
      case 'technical':
        return { label: 'دراسة تقنية', icon: Settings };
      default:
        return { label: type, icon: BookOpen };
    }
  };

  const getAIModelInfo = (model: string) => {
    switch (model) {
      case 'gemini-pro':
        return { label: 'Google Gemini Pro', icon: Brain };
      case 'gpt-4':
        return { label: 'OpenAI GPT-4', icon: Cpu };
      case 'claude-3':
        return { label: 'Anthropic Claude 3', icon: User };
      default:
        return { label: model, icon: Brain };
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'غير محدد';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: study?.currency || 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number | null) => {
    if (!value) return 'غير محدد';
    return `${value.toFixed(1)}%`;
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذه الدراسة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      const response = await fetch(`/api/studies/simple/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('فشل في حذف الدراسة');
      }

      router.push('/studies');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء حذف الدراسة');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {error || 'الدراسة غير موجودة'}
        </h1>
        <Button asChild variant="outline">
          <Link href="/studies">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للدراسات
          </Link>
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(study.status);
  const typeInfo = getTypeInfo(study.type);
  const aiModelInfo = getAIModelInfo(study.aiModel);
  const StatusIcon = statusInfo.icon;
  const TypeIcon = typeInfo.icon;
  const AIIcon = aiModelInfo.icon;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/studies">
              <ArrowLeft className="h-4 w-4 ml-1" />
              العودة للدراسات
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {study.title}
              </h1>
              <Badge className={statusInfo.color}>
                <StatusIcon className="w-3 h-3 ml-1" />
                {statusInfo.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <Link href={`/projects/${study.project.id}`} className="hover:text-blue-600">
                  {study.project.name}
                </Link>
              </div>
              <div className="flex items-center gap-1">
                <TypeIcon className="h-4 w-4" />
                {typeInfo.label}
              </div>
              <div className="flex items-center gap-1">
                <AIIcon className="h-4 w-4" />
                {aiModelInfo.label}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {study.description}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/studies/${study.id}/edit`}>
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
                تحميل PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="ml-2 h-4 w-4" />
                تحميل Word
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600 dark:text-red-400">
                <Trash2 className="ml-2 h-4 w-4" />
                حذف الدراسة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الاستثمار المبدئي</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(study.initialInvestment)}
                </p>
              </div>
              <PiggyBank className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الإيرادات المتوقعة</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(study.projectedRevenue)}
                </p>
              </div>
              <LineChart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">العائد على الاستثمار</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatPercentage(study.roi)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">فترة الاسترداد</p>
                <p className="text-2xl font-bold text-orange-600">
                  {study.paybackPeriod ? `${study.paybackPeriod} سنة` : 'غير محدد'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="financial">التحليل المالي</TabsTrigger>
          <TabsTrigger value="market">السوق</TabsTrigger>
          <TabsTrigger value="technical">التقني</TabsTrigger>
          <TabsTrigger value="risks">المخاطر</TabsTrigger>
          <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  الملخص التنفيذي
                </CardTitle>
              </CardHeader>
              <CardContent>
                {study.executiveSummary ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{study.executiveSummary}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">لم يتم إضافة الملخص التنفيذي بعد</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  المنهجية والافتراضات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {study.methodology && (
                  <div>
                    <h4 className="font-medium mb-2">المنهجية المتبعة</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {study.methodology}
                    </p>
                  </div>
                )}
                {study.assumptions && (
                  <div>
                    <h4 className="font-medium mb-2">الافتراضات الأساسية</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {study.assumptions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Financial Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                المؤشرات المالية الإضافية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">صافي القيمة الحالية</label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(study.npv)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">معدل العائد الداخلي</label>
                  <p className="text-lg font-semibold">
                    {formatPercentage(study.irr)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">نقطة التعادل</label>
                  <p className="text-lg font-semibold">
                    {study.breakEvenPoint ? `${study.breakEvenPoint} شهر` : 'غير محدد'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">العملة</label>
                  <p className="text-lg font-semibold">
                    {study.currency}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                التحليل المالي التفصيلي
              </CardTitle>
            </CardHeader>
            <CardContent>
              {study.financialAnalysis ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{study.financialAnalysis}</div>
                </div>
              ) : (
                <p className="text-gray-500 italic">لم يتم إجراء التحليل المالي التفصيلي بعد</p>
              )}
            </CardContent>
          </Card>

          {/* ROI Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                تحليل العائد على الاستثمار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ROIChart 
                data={[
                  { year: 1, roi: 15, cumulativeROI: 15 },
                  { year: 2, roi: 22, cumulativeROI: 39 },
                  { year: 3, roi: 28, cumulativeROI: 78 },
                  { year: 4, roi: 25, cumulativeROI: 122 },
                  { year: 5, roi: 30, cumulativeROI: 189 }
                ]}
                title="العائد على الاستثمار عبر 5 سنوات"
              />
            </CardContent>
          </Card>

          {/* Cash Flow Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                التدفق النقدي المتوقع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CashFlowChart 
                data={[
                  { period: 'السنة 1', inflow: 800000, outflow: 600000, netFlow: 200000, cumulative: 200000 },
                  { period: 'السنة 2', inflow: 1200000, outflow: 700000, netFlow: 500000, cumulative: 700000 },
                  { period: 'السنة 3', inflow: 1500000, outflow: 800000, netFlow: 700000, cumulative: 1400000 },
                  { period: 'السنة 4', inflow: 1800000, outflow: 900000, netFlow: 900000, cumulative: 2300000 },
                  { period: 'السنة 5', inflow: 2200000, outflow: 1000000, netFlow: 1200000, cumulative: 3500000 }
                ]}
                currency={study.currency}
              />
            </CardContent>
          </Card>

          {study.sensitivityAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  تحليل الحساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{study.sensitivityAnalysis}</div>
                </div>
                <SensitivityChart 
                  data={[
                    { variable: 'سعر المنتج', change: 10, npvChange: 45, roiChange: 38 },
                    { variable: 'حجم المبيعات', change: 10, npvChange: 42, roiChange: 35 },
                    { variable: 'تكلفة التشغيل', change: 10, npvChange: -30, roiChange: -25 },
                    { variable: 'تكلفة المواد', change: 10, npvChange: -25, roiChange: -20 },
                    { variable: 'أسعار الفائدة', change: 10, npvChange: -15, roiChange: -12 }
                  ]}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Market Tab */}
        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                تحليل السوق
              </CardTitle>
            </CardHeader>
            <CardContent>
              {study.marketAnalysis ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{study.marketAnalysis}</div>
                </div>
              ) : (
                <p className="text-gray-500 italic">لم يتم إجراء تحليل السوق بعد</p>
              )}
            </CardContent>
          </Card>

          {/* Market Share Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                حصص السوق المتوقعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarketShareChart 
                data={[
                  { name: 'مشروعنا', value: 15, color: '#3b82f6' },
                  { name: 'المنافس الأول', value: 35, color: '#10b981' },
                  { name: 'المنافس الثاني', value: 25, color: '#f59e0b' },
                  { name: 'المنافس الثالث', value: 15, color: '#ef4444' },
                  { name: 'أخرى', value: 10, color: '#8b5cf6' }
                ]}
                title="توزيع حصص السوق"
              />
            </CardContent>
          </Card>

          {study.competitorAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  تحليل المنافسين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{study.competitorAnalysis}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {study.swotAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  تحليل SWOT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{study.swotAnalysis}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                التحليل التقني
              </CardTitle>
            </CardHeader>
            <CardContent>
              {study.technicalAnalysis ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{study.technicalAnalysis}</div>
                </div>
              ) : (
                <p className="text-gray-500 italic">لم يتم إجراء التحليل التقني بعد</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                تحليل المخاطر
              </CardTitle>
            </CardHeader>
            <CardContent>
              {study.riskAssessment ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{study.riskAssessment}</div>
                </div>
              ) : (
                <p className="text-gray-500 italic">لم يتم تقييم المخاطر بعد</p>
              )}
            </CardContent>
          </Card>

          {/* Risk Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                مصفوفة المخاطر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RiskMatrix 
                data={[
                  { id: '1', name: 'مخاطر السوق', probability: 3.5, impact: 4, category: 'market' },
                  { id: '2', name: 'مخاطر التمويل', probability: 2, impact: 4.5, category: 'financial' },
                  { id: '3', name: 'مخاطر تقنية', probability: 1.5, impact: 3, category: 'technical' },
                  { id: '4', name: 'مخاطر تنظيمية', probability: 2.5, impact: 3.5, category: 'regulatory' },
                  { id: '5', name: 'مخاطر بيئية', probability: 1, impact: 2.5, category: 'operational' },
                  { id: '6', name: 'مخاطر المنافسة', probability: 4, impact: 3, category: 'market' },
                  { id: '7', name: 'مخاطر الموردين', probability: 1.5, impact: 2, category: 'operational' },
                  { id: '8', name: 'مخاطر الموارد البشرية', probability: 2, impact: 2.5, category: 'operational' }
                ]}
                title="تصنيف المخاطر حسب الاحتمالية والتأثير"
              />
            </CardContent>
          </Card>

          {study.riskAssessment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  استراتيجيات التخفيف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{study.riskAssessment}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                التوصيات والخلاصة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {study.recommendations ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{study.recommendations}</div>
                </div>
              ) : (
                <p className="text-gray-500 italic">لم يتم إضافة التوصيات بعد</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Study Meta Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            معلومات الدراسة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="text-gray-600 dark:text-gray-400">تاريخ الإنشاء</label>
              <p className="font-medium">
                {new Date(study.createdAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <label className="text-gray-600 dark:text-gray-400">آخر تحديث</label>
              <p className="font-medium">
                {new Date(study.updatedAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <label className="text-gray-600 dark:text-gray-400">اللغة</label>
              <p className="font-medium">
                {study.language === 'ar' ? 'العربية' : 
                 study.language === 'en' ? 'English' : study.language}
              </p>
            </div>
            <div>
              <label className="text-gray-600 dark:text-gray-400">نموذج الذكاء الاصطناعي</label>
              <div className="flex items-center gap-1">
                <AIIcon className="h-4 w-4" />
                <span className="font-medium">{aiModelInfo.label}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
