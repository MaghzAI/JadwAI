'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/permissions';

interface PermissionGuardProps {
  children: ReactNode;
  permissions: Permission | Permission[];
  requireAll?: boolean; // إذا كان true، يتطلب جميع الأذونات، وإلا أي إذن واحد
  fallback?: ReactNode;
  resourceOwnerId?: string; // للتحقق من ملكية المورد
}

/**
 * مكون لحماية المحتوى بناءً على الأذونات
 */
export function PermissionGuard({
  children,
  permissions,
  requireAll = false,
  fallback = null,
  resourceOwnerId
}: PermissionGuardProps) {
  const {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    checkResourceAccess,
    isAuthenticated
  } = usePermissions();

  // إذا لم يكن المستخدم مسجل دخول
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // تحويل permissions إلى مصفوفة إذا لم تكن كذلك
  const permissionList = Array.isArray(permissions) ? permissions : [permissions];

  let hasAccess = false;

  // إذا كان هناك resourceOwnerId، استخدم checkResourceAccess
  if (resourceOwnerId && permissionList.length === 1) {
    hasAccess = checkResourceAccess(resourceOwnerId, permissionList[0]);
  } else {
    // استخدم منطق الأذونات العادي
    if (requireAll) {
      hasAccess = checkAllPermissions(permissionList);
    } else {
      hasAccess = permissionList.length === 1 
        ? checkPermission(permissionList[0])
        : checkAnyPermission(permissionList);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
