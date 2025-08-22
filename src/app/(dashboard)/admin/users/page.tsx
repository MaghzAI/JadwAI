'use client';

import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PermissionGuard } from '@/components/ui/permission-guard';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield,
  UserCheck,
  UserX,
  Crown,
  RefreshCcw
} from 'lucide-react';
import { UserRole } from '@prisma/client';
import { roleLabels } from '@/lib/permissions';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  _count: {
    projects: number;
    studies: number;
  };
}

export default function UsersManagementPage() {
  const { checkPermission, isAdmin } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        alert('تم تغيير الدور بنجاح');
      } else {
        throw new Error('فشل في تغيير الدور');
      }
    } catch (error) {
      console.error('Error changing role:', error);
      alert('حدث خطأ أثناء تغيير الدور');
    }
  };

  const handleStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, isActive } : user
        ));
        alert(`تم ${isActive ? 'تفعيل' : 'إلغاء تفعيل'} المستخدم بنجاح`);
      } else {
        throw new Error('فشل في تغيير الحالة');
      }
    } catch (error) {
      console.error('Error changing status:', error);
      alert('حدث خطأ أثناء تغيير الحالة');
    }
  };

  // تصفية المستخدمين
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'destructive';
      case UserRole.MANAGER:
        return 'default';
      case UserRole.USER:
        return 'secondary';
      case UserRole.VIEWER:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Crown className="h-3 w-3" />;
      case UserRole.MANAGER:
        return <Shield className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6" dir="rtl">
        <div className="flex items-center justify-center h-64">
          <RefreshCcw className="h-8 w-8 animate-spin" />
          <span className="ml-2">جاري تحميل المستخدمين...</span>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard 
      permissions={Permission.READ_USER}
      fallback={
        <div className="container mx-auto p-6" dir="rtl">
          <div className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">غير مصرح بالوصول</h2>
            <p className="text-gray-600">ليس لديك الصلاحية لعرض هذه الصفحة</p>
          </div>
        </div>
      }
    >
      <div className="container mx-auto p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              إدارة المستخدمين
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              إدارة حسابات المستخدمين وأدوارهم وصلاحياتهم
            </p>
          </div>

          <PermissionGuard permissions={Permission.CREATE_USER}>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مستخدم جديد
            </Button>
          </PermissionGuard>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">تصفية وبحث</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">البحث</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="البحث بالاسم أو البريد الإلكتروني..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>الدور</Label>
                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأدوار</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>مدير عام</SelectItem>
                    <SelectItem value={UserRole.MANAGER}>مدير</SelectItem>
                    <SelectItem value={UserRole.USER}>مستخدم</SelectItem>
                    <SelectItem value={UserRole.VIEWER}>مشاهد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={loadUsers} className="w-full">
                  <RefreshCcw className="ml-2 h-4 w-4" />
                  تحديث
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>المستخدمون ({filteredUsers.length})</CardTitle>
            <CardDescription>
              قائمة بجميع المستخدمين المسجلين في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">لا توجد نتائج مطابقة للبحث</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {user.firstName} {user.lastName}
                          </h3>
                          {!user.isActive && (
                            <Badge variant="outline" className="text-red-600">
                              معطل
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{user._count.projects} مشروع</span>
                          <span>•</span>
                          <span>{user._count.studies} دراسة</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        {roleLabels[user.role]}
                      </Badge>

                      <PermissionGuard permissions={Permission.UPDATE_USER}>
                        <div className="flex items-center gap-2">
                          <Select 
                            value={user.role} 
                            onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                            disabled={!isAdmin()}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={UserRole.VIEWER}>مشاهد</SelectItem>
                              <SelectItem value={UserRole.USER}>مستخدم</SelectItem>
                              <SelectItem value={UserRole.MANAGER}>مدير</SelectItem>
                              {isAdmin() && (
                                <SelectItem value={UserRole.ADMIN}>مدير عام</SelectItem>
                              )}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusToggle(user.id, !user.isActive)}
                          >
                            {user.isActive ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </PermissionGuard>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
