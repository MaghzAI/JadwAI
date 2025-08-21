import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart3, FileText, Brain, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'العرض التوضيحي - منصة دراسات الجدوى',
  description: 'شاهد كيفية عمل منصة دراسات الجدوى الذكية وميزاتها المتقدمة',
};

export default function DemoPage() {
  const features = [
    {
      icon: Brain,
      title: 'ذكاء اصطناعي متقدم',
      description: 'تحليل شامل باستخدام نماذج الذكاء الاصطناعي الحديثة',
      demo: 'مثال: تحليل السوق التلقائي لمشروع مطعم',
    },
    {
      icon: BarChart3,
      title: 'تحليلات مالية دقيقة',
      description: 'حسابات معدل العائد والقيمة الحالية الصافية تلقائياً',
      demo: 'مثال: ROI 25% خلال 18 شهر',
    },
    {
      icon: FileText,
      title: 'تقارير احترافية',
      description: 'تصدير تقارير مفصلة بصيغ متعددة',
      demo: 'مثال: تقرير 50 صفحة PDF',
    },
    {
      icon: Shield,
      title: 'أمان متقدم',
      description: 'حماية البيانات وسرية المعلومات',
      demo: 'تشفير شامل ونسخ احتياطية',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            العرض التوضيحي
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            استكشف قوة منصة دراسات الجدوى الذكية وكيف يمكنها مساعدتك في اتخاذ قرارات استثمارية مدروسة
          </p>
        </div>

        {/* Demo Preview */}
        <div className="mb-12">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                🎬 فيديو العرض التوضيحي
              </CardTitle>
              <CardDescription className="text-center">
                شاهد المنصة في العمل (قريباً)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold">
                    فيديو العرض التوضيحي قيد الإعداد
                  </p>
                  <p className="text-sm opacity-90">
                    سيتم إضافة المحتوى التفاعلي قريباً
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Demo */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {feature.demo}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Demo Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              جرب المنصة تفاعلياً
            </CardTitle>
            <CardDescription className="text-center">
              ابدأ بإنشاء دراسة جدوى تجريبية
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">1. اختر نوع المشروع</div>
                <div className="text-gray-600 dark:text-gray-400">
                  مطعم، متجر إلكتروني، خدمات تقنية
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">2. أدخل البيانات الأساسية</div>
                <div className="text-gray-600 dark:text-gray-400">
                  الاستثمار المطلوب والإيرادات المتوقعة
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">3. احصل على التقرير</div>
                <div className="text-gray-600 dark:text-gray-400">
                  تحليل شامل وتوصيات مفصلة
                </div>
              </div>
            </div>
            
            <Button size="lg" disabled className="mx-auto">
              تجربة العرض التفاعلي (قيد التطوير)
            </Button>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">
                مستعد للبدء؟
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                انضم إلى منصة دراسات الجدوى الذكية وابدأ رحلتك نحو استثمارات أكثر ذكاءً
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/auth/signup">
                    ابدأ الآن
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/">
                    العودة للرئيسية
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
