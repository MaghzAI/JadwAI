import { UserRole } from '@prisma/client';

// تعريف الأذونات المختلفة في النظام
export enum Permission {
  // إدارة المشاريع
  CREATE_PROJECT = 'create_project',
  READ_PROJECT = 'read_project',
  UPDATE_PROJECT = 'update_project',
  DELETE_PROJECT = 'delete_project',
  
  // إدارة دراسات الجدوى
  CREATE_STUDY = 'create_study',
  READ_STUDY = 'read_study',
  UPDATE_STUDY = 'update_study',
  DELETE_STUDY = 'delete_study',
  GENERATE_STUDY = 'generate_study',
  
  // إدارة المستخدمين
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  MANAGE_ROLES = 'manage_roles',
  
  // إدارة النظام
  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_SETTINGS = 'manage_settings',
  EXPORT_DATA = 'export_data',
  
  // التعليقات والمراجعات
  CREATE_COMMENT = 'create_comment',
  UPDATE_COMMENT = 'update_comment',
  DELETE_COMMENT = 'delete_comment',
}

// خريطة الأذونات حسب الأدوار
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // المدير العام - جميع الأذونات
    Permission.CREATE_PROJECT,
    Permission.READ_PROJECT,
    Permission.UPDATE_PROJECT,
    Permission.DELETE_PROJECT,
    
    Permission.CREATE_STUDY,
    Permission.READ_STUDY,
    Permission.UPDATE_STUDY,
    Permission.DELETE_STUDY,
    Permission.GENERATE_STUDY,
    
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.MANAGE_ROLES,
    
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SETTINGS,
    Permission.EXPORT_DATA,
    
    Permission.CREATE_COMMENT,
    Permission.UPDATE_COMMENT,
    Permission.DELETE_COMMENT,
  ],
  
  [UserRole.MANAGER]: [
    // المدير - أذونات إدارية محدودة
    Permission.CREATE_PROJECT,
    Permission.READ_PROJECT,
    Permission.UPDATE_PROJECT,
    
    Permission.CREATE_STUDY,
    Permission.READ_STUDY,
    Permission.UPDATE_STUDY,
    Permission.GENERATE_STUDY,
    
    Permission.READ_USER,
    Permission.UPDATE_USER,
    
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    
    Permission.CREATE_COMMENT,
    Permission.UPDATE_COMMENT,
    Permission.DELETE_COMMENT,
  ],
  
  [UserRole.USER]: [
    // مستخدم عادي - أذونات أساسية
    Permission.CREATE_PROJECT,
    Permission.READ_PROJECT,
    Permission.UPDATE_PROJECT,
    
    Permission.CREATE_STUDY,
    Permission.READ_STUDY,
    Permission.UPDATE_STUDY,
    Permission.GENERATE_STUDY,
    
    Permission.VIEW_DASHBOARD,
    
    Permission.CREATE_COMMENT,
    Permission.UPDATE_COMMENT,
  ],
  
  [UserRole.VIEWER]: [
    // مشاهد - أذونات القراءة فقط
    Permission.READ_PROJECT,
    Permission.READ_STUDY,
    Permission.VIEW_DASHBOARD,
  ],
};

/**
 * التحقق من وجود إذن معين لدور المستخدم
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
}

/**
 * الحصول على جميع أذونات دور معين
 */
export function getRolePermissions(userRole: UserRole): Permission[] {
  return rolePermissions[userRole] || [];
}

/**
 * التحقق من أذونات متعددة
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * التحقق من جميع الأذونات المطلوبة
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * فلترة الأذونات المتاحة من قائمة أذونات
 */
export function filterAvailablePermissions(userRole: UserRole, permissions: Permission[]): Permission[] {
  return permissions.filter(permission => hasPermission(userRole, permission));
}

/**
 * التحقق من ملكية المورد
 */
export function canAccessResource(
  userRole: UserRole,
  userId: string,
  resourceOwnerId: string,
  requiredPermission: Permission
): boolean {
  // المدير العام يمكنه الوصول لكل شيء
  if (userRole === UserRole.ADMIN) {
    return true;
  }
  
  // التحقق من الإذن أولاً
  if (!hasPermission(userRole, requiredPermission)) {
    return false;
  }
  
  // إذا كان المستخدم هو صاحب المورد
  if (userId === resourceOwnerId) {
    return true;
  }
  
  // المدراء يمكنهم الوصول للموارد حسب أذوناتهم
  if (userRole === UserRole.MANAGER) {
    return hasPermission(userRole, requiredPermission);
  }
  
  return false;
}

/**
 * ترجمة أسماء الأذونات للعربية
 */
export const permissionLabels: Record<Permission, string> = {
  [Permission.CREATE_PROJECT]: 'إنشاء مشروع',
  [Permission.READ_PROJECT]: 'عرض المشاريع',
  [Permission.UPDATE_PROJECT]: 'تعديل المشروع',
  [Permission.DELETE_PROJECT]: 'حذف المشروع',
  
  [Permission.CREATE_STUDY]: 'إنشاء دراسة جدوى',
  [Permission.READ_STUDY]: 'عرض دراسات الجدوى',
  [Permission.UPDATE_STUDY]: 'تعديل دراسة الجدوى',
  [Permission.DELETE_STUDY]: 'حذف دراسة الجدوى',
  [Permission.GENERATE_STUDY]: 'توليد دراسة بالذكاء الاصطناعي',
  
  [Permission.CREATE_USER]: 'إنشاء مستخدم',
  [Permission.READ_USER]: 'عرض المستخدمين',
  [Permission.UPDATE_USER]: 'تعديل المستخدم',
  [Permission.DELETE_USER]: 'حذف المستخدم',
  [Permission.MANAGE_ROLES]: 'إدارة الأدوار',
  
  [Permission.VIEW_DASHBOARD]: 'عرض لوحة التحكم',
  [Permission.VIEW_ANALYTICS]: 'عرض التقارير والإحصائيات',
  [Permission.MANAGE_SETTINGS]: 'إدارة إعدادات النظام',
  [Permission.EXPORT_DATA]: 'تصدير البيانات',
  
  [Permission.CREATE_COMMENT]: 'إضافة تعليق',
  [Permission.UPDATE_COMMENT]: 'تعديل التعليق',
  [Permission.DELETE_COMMENT]: 'حذف التعليق',
};

/**
 * ترجمة أسماء الأدوار للعربية
 */
export const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'مدير عام',
  [UserRole.MANAGER]: 'مدير',
  [UserRole.USER]: 'مستخدم',
  [UserRole.VIEWER]: 'مشاهد',
};
