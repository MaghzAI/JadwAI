'use client';

import { AIProviderSelector } from '@/components/ai/AIProviderSelector';

export default function AIToolsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">أدوات الذكاء الاصطناعي</h1>
        <p className="text-gray-600">
          إدارة وتكوين مقدمي خدمات الذكاء الاصطناعي لتحسين جودة تحليل المشاريع
        </p>
      </div>

      <AIProviderSelector 
        onProviderChange={(provider, settings) => {
          console.log('Provider changed:', provider, settings);
        }}
      />
    </div>
  );
}
