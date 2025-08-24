import { Metadata } from 'next';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { UsageAnalytics } from '@/components/analytics/UsageAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'التحليلات | منصة دراسات الجدوى',
  description: 'لوحة التحليلات المتقدمة وإحصائيات استخدام المنصة',
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">التحليلات</h1>
        <p className="text-gray-600">
          تحليل شامل لأداء المنصة والمشاريع مع إحصائيات مفصلة عن الاستخدام
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">لوحة التحليلات</TabsTrigger>
          <TabsTrigger value="usage">إحصائيات الاستخدام</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="usage">
          <UsageAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
