import { NextAuthOptions, getServerSession } from 'next-auth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'ANALYST' | 'VIEWER';

export type Permission = 
  | 'projects:create'
  | 'projects:read'
  | 'projects:update'
  | 'projects:delete'
  | 'studies:create'
  | 'studies:read' 
  | 'studies:update'
  | 'studies:delete'
  | 'users:manage'
  | 'settings:manage';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'projects:create', 'projects:read', 'projects:update', 'projects:delete',
    'studies:create', 'studies:read', 'studies:update', 'studies:delete',
    'users:manage', 'settings:manage'
  ],
  MANAGER: [
    'projects:create', 'projects:read', 'projects:update', 'projects:delete',
    'studies:create', 'studies:read', 'studies:update', 'studies:delete'
  ],
  ANALYST: [
    'projects:read', 'projects:update',
    'studies:create', 'studies:read', 'studies:update'
  ],
  VIEWER: [
    'projects:read',
    'studies:read'
  ]
};

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return user.permissions?.includes(permission) || false;
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some(permission => hasPermission(user, permission));
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every(permission => hasPermission(user, permission));
}

export function canAccessProject(user: User | null, projectOwnerId: string): boolean {
  if (!user) return false;
  
  // Admin can access all projects
  if (user.role === 'ADMIN') return true;
  
  // Owner can always access their projects
  if (user.id === projectOwnerId) return true;
  
  // Manager can access all projects
  if (user.role === 'MANAGER') return true;
  
  // Others need explicit read permission
  return hasPermission(user, 'projects:read');
}

export function canModifyProject(user: User | null, projectOwnerId: string): boolean {
  if (!user) return false;
  
  // Admin can modify all projects
  if (user.role === 'ADMIN') return true;
  
  // Owner can modify their projects if they have update permission
  if (user.id === projectOwnerId && hasPermission(user, 'projects:update')) {
    return true;
  }
  
  // Manager can modify all projects
  if (user.role === 'MANAGER' && hasPermission(user, 'projects:update')) {
    return true;
  }
  
  return false;
}

export function canDeleteProject(user: User | null, projectOwnerId: string): boolean {
  if (!user) return false;
  
  // Only admin and owners with delete permission can delete projects
  if (user.role === 'ADMIN') return true;
  
  if (user.id === projectOwnerId && hasPermission(user, 'projects:delete')) {
    return true;
  }
  
  // Managers with delete permission can delete projects
  if (user.role === 'MANAGER' && hasPermission(user, 'projects:delete')) {
    return true;
  }
  
  return false;
}

export function canAccessStudy(user: User | null, studyOwnerId: string): boolean {
  if (!user) return false;
  
  // Admin can access all studies
  if (user.role === 'ADMIN') return true;
  
  // Owner can always access their studies
  if (user.id === studyOwnerId) return true;
  
  // Manager can access all studies
  if (user.role === 'MANAGER') return true;
  
  // Others need explicit read permission
  return hasPermission(user, 'studies:read');
}

export function canModifyStudy(user: User | null, studyOwnerId: string): boolean {
  if (!user) return false;
  
  // Admin can modify all studies
  if (user.role === 'ADMIN') return true;
  
  // Owner can modify their studies if they have update permission
  if (user.id === studyOwnerId && hasPermission(user, 'studies:update')) {
    return true;
  }
  
  // Manager can modify all studies
  if (user.role === 'MANAGER' && hasPermission(user, 'studies:update')) {
    return true;
  }
  
  return false;
}

export function canDeleteStudy(user: User | null, studyOwnerId: string): boolean {
  if (!user) return false;
  
  // Only admin and owners with delete permission can delete studies
  if (user.role === 'ADMIN') return true;
  
  if (user.id === studyOwnerId && hasPermission(user, 'studies:delete')) {
    return true;
  }
  
  // Managers with delete permission can delete studies
  if (user.role === 'MANAGER' && hasPermission(user, 'studies:delete')) {
    return true;
  }
  
  return false;
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return null;
  }
  
  // In a real app, you'd fetch this from your database
  // For now, we'll return a mock user with permissions based on role
  const mockUser: User = {
    id: session.user.id || 'mock-user-id',
    email: session.user.email,
    name: session.user.name || 'User',
    role: 'MANAGER', // Default role - in real app, fetch from DB
    permissions: ROLE_PERMISSIONS.MANAGER
  };
  
  return mockUser;
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames = {
    ADMIN: 'مدير النظام',
    MANAGER: 'مدير',
    ANALYST: 'محلل',
    VIEWER: 'مشاهد'
  };
  
  return roleNames[role];
}

export function getPermissionDisplayName(permission: Permission): string {
  const permissionNames = {
    'projects:create': 'إنشاء المشاريع',
    'projects:read': 'عرض المشاريع',
    'projects:update': 'تحديث المشاريع',
    'projects:delete': 'حذف المشاريع',
    'studies:create': 'إنشاء الدراسات',
    'studies:read': 'عرض الدراسات',
    'studies:update': 'تحديث الدراسات',
    'studies:delete': 'حذف الدراسات',
    'users:manage': 'إدارة المستخدمين',
    'settings:manage': 'إدارة الإعدادات'
  };
  
  return permissionNames[permission];
}
