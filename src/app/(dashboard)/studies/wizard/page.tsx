'use client';

import { StudyWizardProvider } from '@/contexts/StudyWizardContext';
import StudyWizard from '@/components/study-wizard/StudyWizard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StudyWizardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/studies">
                <ArrowLeft className="h-4 w-4 ml-1" />
                العودة للدراسات
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                معالج دراسة الجدوى التفاعلي
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                أنشئ دراسة جدوى شاملة خطوة بخطوة
              </p>
            </div>
          </div>
          
          {/* Info Card */}
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    المعالج التفاعلي
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    سيرشدك هذا المعالج عبر جميع خطوات إنشاء دراسة جدوى مفصلة. 
                    يمكنك حفظ تقدمك في أي وقت والعودة لاحقاً لإكمال الدراسة.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wizard Container */}
        <StudyWizardProvider projectId="1">
          <div className="max-w-5xl mx-auto">
            <StudyWizard />
          </div>
        </StudyWizardProvider>
      </div>
    </div>
  );
}
