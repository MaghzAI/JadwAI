'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission, hasPermission, hasAnyPermission, ROLE_PERMISSIONS } from '@/lib/auth/permissions';
import { AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requireAny?: boolean; // If true, user needs ANY of the permissions, otherwise ALL
  fallback?: React.ReactNode;
  redirect?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredPermissions = [],
  requireAny = false,
  fallback,
  redirect = '/auth/signin'
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session && redirect) {
      router.push(redirect);
    }
  }, [session, status, router, redirect]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Lock className="h-12 w-12 text-gray-400" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          مطلوب تسجيل الدخول
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          يجب تسجيل الدخول للوصول إلى هذه الصفحة
        </p>
        <Button asChild>
          <Link href="/auth/signin">
            تسجيل الدخول
          </Link>
        </Button>
      </div>
    );
  }

  // Check permissions if required
  if (requiredPermissions.length > 0) {
    const userRole = (session.user as any)?.role || 'VIEWER';
    const user = {
      id: session.user?.id || '',
      email: session.user?.email || '',
      name: session.user?.name || '',
      role: userRole,
      permissions: ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS]
    };

    const hasAccess = requireAny 
      ? hasAnyPermission(user, requiredPermissions)
      : requiredPermissions.every(permission => hasPermission(user, permission));

    if (!hasAccess) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            غير مصرح بالوصول
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              العودة للرئيسية
            </Link>
          </Button>
        </div>
      );
    }
  }

  return <>{children}</>;
}
