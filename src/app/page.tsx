import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Brain, Shield, Globe, FileText, BarChart3, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {

  const features = [
    {
      icon: Brain,
      title: 'توليد ذكي للدراسات',
      description: 'استخدام الذكاء الاصطناعي لإنشاء دراسات شاملة ومخصصة',
    },
    {
      icon: Shield,
      title: 'أمان محكم',
      description: 'حماية وعزل كامل لبيانات المستخدمين ومشاريعهم',
    },
    {
      icon: Globe,
      title: 'متعدد اللغات',
      description: 'دعم العربية والإنجليزية مع إمكانية إضافة المزيد',
    },
    {
      icon: FileText,
      title: 'تصدير متعدد الصيغ',
      description: 'PDF، Word، Excel مع تصاميم احترافية',
    },
    {
      icon: BarChart3,
      title: 'تحليلات متقدمة',
      description: 'رسوم بيانية وتقارير مالية تفصيلية',
    },
    {
      icon: Users,
      title: 'التعاون',
      description: 'إمكانية مشاركة الدراسات والعمل التعاوني',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              منصة دراسات الجدوى{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                الذكية
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              منصة احترافية وذكية لمساعدة أصحاب المشاريع والشركات في بناء دراسات الجدوى والتمويل الاحترافية 
              بخطوات بسيطة وأدوات ذكية معتمدة على الذكاء الاصطناعي
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/auth/signup">
                  ابدأ مجاناً
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/demo">
                  مشاهدة العرض التوضيحي
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              لماذا تختار منصتنا؟
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              نوفر لك جميع الأدوات اللازمة لإنشاء دراسات جدوى احترافية ومقنعة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              جاهز للبدء؟
            </h2>
            <p className="text-xl mb-8 opacity-90">
              انضم إلى آلاف رواد الأعمال الذين يثقون بمنصتنا لإنشاء دراسات الجدوى
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/auth/signup">
                إنشاء حساب جديد
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
