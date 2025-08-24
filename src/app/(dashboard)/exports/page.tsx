import { Metadata } from 'next';
import { ExportManager } from '@/components/exports/ExportManager';
import { ProjectSharing } from '@/components/sharing/ProjectSharing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'التصدير والمشاركة | منصة دراسات الجدوى',
  description: 'تصدير التقارير ومشاركة المشاريع مع الفرق',
};

export default function ExportsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">التصدير والمشاركة</h1>
        <p className="text-gray-600">
          تصدير التقارير بصيغ مختلفة ومشاركة المشاريع مع أعضاء الفريق
        </p>
      </div>

      <Tabs defaultValue="exports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exports">إدارة التصدير</TabsTrigger>
          <TabsTrigger value="sharing">مشاركة المشاريع</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exports">
          <ExportManager />
        </TabsContent>
        
        <TabsContent value="sharing">
          <ProjectSharing />
        </TabsContent>
      </Tabs>
    </div>
  );
}
