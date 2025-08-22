import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions, canAccessResource } from '@/lib/permissions';

/**
 * Hook للتحقق من أذونات المستخدم الحالي
 */
export function usePermissions() {
  const { data: session } = useSession();
  
  const userRole = (session?.user?.role as UserRole) || UserRole.VIEWER;
  const userId = session?.user?.id || '';

  /**
   * التحقق من إذن واحد
   */
  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(userRole, permission);
  };

  /**
   * التحقق من أي إذن من قائمة أذونات
   */
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    return hasAnyPermission(userRole, permissions);
  };

  /**
   * التحقق من جميع الأذونات المطلوبة
   */
  const checkAllPermissions = (permissions: Permission[]): boolean => {
    return hasAllPermissions(userRole, permissions);
  };

  /**
   * التحقق من إمكانية الوصول لمورد معين
   */
  const checkResourceAccess = (
    resourceOwnerId: string,
    requiredPermission: Permission
  ): boolean => {
    return canAccessResource(userRole, userId, resourceOwnerId, requiredPermission);
  };

  /**
   * التحقق من كون المستخدم مدير عام
   */
  const isAdmin = (): boolean => {
    return userRole === UserRole.ADMIN;
  };

  /**
   * التحقق من كون المستخدم مدير
   */
  const isManager = (): boolean => {
    return userRole === UserRole.MANAGER || userRole === UserRole.ADMIN;
  };

  /**
   * التحقق من كون المستخدم مشاهد فقط
   */
  const isViewer = (): boolean => {
    return userRole === UserRole.VIEWER;
  };

  return {
    userRole,
    userId,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    checkResourceAccess,
    isAdmin,
    isManager,
    isViewer,
    isAuthenticated: !!session?.user,
  };
}
