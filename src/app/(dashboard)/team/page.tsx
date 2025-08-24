import { Metadata } from 'next';
import { TeamManager } from '@/components/team/TeamManager';

export const metadata: Metadata = {
  title: 'إدارة الفريق | منصة دراسات الجدوى',
  description: 'إدارة أعضاء الفريق والأدوار والصلاحيات',
};

export default function TeamPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الفريق</h1>
        <p className="text-gray-600">
          إدارة أعضاء الفريق وتوزيع الأدوار والصلاحيات لتحسين التعاون
        </p>
      </div>

      <TeamManager />
    </div>
  );
}
