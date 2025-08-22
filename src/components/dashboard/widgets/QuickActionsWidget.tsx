'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  FileText,
  BarChart3,
  Users,
  Settings,
  Download,
  Upload,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
  permission?: string;
}

interface QuickActionsWidgetProps {
  className?: string;
}

export function QuickActionsWidget({ className }: QuickActionsWidgetProps) {
  const { checkPermission } = usePermissions();

  const quickActions: QuickAction[] = [
    {
      id: 'new-project',
      title: 'مشروع جديد',
      description: 'إنشاء مشروع جديد',
      icon: Plus,
      href: '/projects/new',
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300',
      permission: 'CREATE_PROJECTS'
    },
    {
      id: 'new-study',
      title: 'دراسة جدوى',
      description: 'إنشاء دراسة جدوى جديدة',
      icon: FileText,
      href: '/studies/new',
      color: 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300',
      permission: 'CREATE_STUDIES'
    },
    {
      id: 'reports',
      title: 'التقارير',
      description: 'عرض وإنشاء التقارير',
      icon: BarChart3,
      href: '/reports',
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300',
      permission: 'READ_REPORTS'
    },
    {
      id: 'manage-users',
      title: 'إدارة المستخدمين',
      description: 'إدارة المستخدمين والأذونات',
      icon: Users,
      href: '/admin/users',
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300',
      permission: 'MANAGE_USERS'
    },
    {
      id: 'settings',
      title: 'الإعدادات',
      description: 'إعدادات الحساب والنظام',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300'
    },
    {
      id: 'export-data',
      title: 'تصدير البيانات',
      description: 'تصدير المشاريع والبيانات',
      icon: Download,
      href: '/export',
      color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300',
      permission: 'EXPORT_DATA'
    },
    {
      id: 'import-data',
      title: 'استيراد البيانات',
      description: 'استيراد مشاريع ودراسات',
      icon: Upload,
      href: '/import',
      color: 'bg-teal-100 text-teal-600 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-300',
      permission: 'IMPORT_DATA'
    },
    {
      id: 'search',
      title: 'البحث المتقدم',
      description: 'البحث في المشاريع والدراسات',
      icon: Search,
      href: '/search',
      color: 'bg-pink-100 text-pink-600 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-300'
    }
  ];

  // تصفية الإجراءات حسب الصلاحيات
  const availableActions = quickActions.filter(action => 
    !action.permission || checkPermission(action.permission as any)
  );

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          إجراءات سريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableActions.map((action) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={action.id}
                asChild
                variant="ghost"
                className={`h-auto p-4 flex flex-col items-center justify-center gap-2 ${action.color} transition-all duration-200 hover:scale-105`}
              >
                <Link href={action.href}>
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{action.title}</div>
                    <div className="text-xs opacity-80 mt-1">{action.description}</div>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>

        {/* إجراءات إضافية مخفية عند الحاجة */}
        {availableActions.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Plus className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد إجراءات متاحة</p>
            <p className="text-sm">تحقق من صلاحياتك أو تواصل مع المدير</p>
          </div>
        )}

        {/* إحصائيات سريعة */}
        <div className="mt-6 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>الإجراءات المتاحة:</span>
            <span className="font-semibold">{availableActions.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
