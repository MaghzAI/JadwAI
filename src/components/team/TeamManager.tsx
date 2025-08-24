'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  Edit2, 
  Trash2,
  Search,
  Crown,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  lastActive: string;
  permissions: string[];
}

interface TeamManagerProps {
  teamId?: string;
  currentUserId: string;
  currentUserRole: TeamMember['role'];
}

export function TeamManager({ teamId, currentUserId, currentUserRole }: TeamManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('viewer');

  useEffect(() => {
    loadTeamMembers();
  }, [teamId]);

  const loadTeamMembers = async () => {
    setLoading(true);
    try {
      // Mock data for development
      const mockMembers: TeamMember[] = [
        {
          id: '1',
          name: 'أحمد المحمد',
          email: 'ahmed@example.com',
          role: 'owner',
          status: 'active',
          joinedAt: '2024-01-15',
          lastActive: '2024-01-20',
          permissions: ['all']
        },
        {
          id: '2',
          name: 'فاطمة السعد',
          email: 'fatima@example.com',
          role: 'admin',
          status: 'active',
          joinedAt: '2024-01-16',
          lastActive: '2024-01-19',
          permissions: ['manage_studies', 'manage_team', 'export']
        },
        {
          id: '3',
          name: 'محمد العلي',
          email: 'mohammed@example.com',
          role: 'editor',
          status: 'active',
          joinedAt: '2024-01-17',
          lastActive: '2024-01-18',
          permissions: ['edit_studies', 'view_studies', 'export']
        },
        {
          id: '4',
          name: 'سارة الخالد',
          email: 'sara@example.com',
          role: 'viewer',
          status: 'pending',
          joinedAt: '2024-01-18',
          lastActive: '',
          permissions: ['view_studies']
        }
      ];
      setMembers(mockMembers);
    } catch (error) {
      console.error('Failed to load team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    try {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
        joinedAt: new Date().toISOString(),
        lastActive: '',
        permissions: getPermissionsByRole(inviteRole)
      };

      setMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      setInviteRole('viewer');
      setShowInviteDialog(false);

      // In production, send actual invitation
      console.log('Invitation sent to:', inviteEmail);
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: TeamMember['role']) => {
    try {
      setMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, role: newRole, permissions: getPermissionsByRole(newRole) }
          : member
      ));
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      setMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const getPermissionsByRole = (role: TeamMember['role']): string[] => {
    const permissions = {
      owner: ['all'],
      admin: ['manage_studies', 'manage_team', 'export', 'analytics'],
      editor: ['edit_studies', 'view_studies', 'export'],
      viewer: ['view_studies']
    };
    return permissions[role] || [];
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'editor':
        return <Edit2 className="h-4 w-4 text-green-600" />;
      default:
        return <UserCheck className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleName = (role: TeamMember['role']) => {
    const names = {
      owner: 'مالك',
      admin: 'مدير',
      editor: 'محرر',
      viewer: 'مشاهد'
    };
    return names[role];
  };

  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-600">نشط</Badge>;
      case 'pending':
        return <Badge variant="secondary">معلق</Badge>;
      case 'inactive':
        return <Badge variant="outline">غير نشط</Badge>;
      default:
        return null;
    }
  };

  const canManageRole = (memberRole: TeamMember['role']) => {
    const hierarchy = { owner: 4, admin: 3, editor: 2, viewer: 1 };
    return hierarchy[currentUserRole] > hierarchy[memberRole];
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              إدارة الفريق ({members.length} أعضاء)
            </CardTitle>
            
            {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    دعوة عضو
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>دعوة عضو جديد</DialogTitle>
                    <DialogDescription>
                      أدخل البريد الإلكتروني للعضو الجديد واختر صلاحياته
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invite-email">البريد الإلكتروني</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="example@domain.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invite-role">الصلاحية</Label>
                      <Select value={inviteRole} onValueChange={(value: TeamMember['role']) => setInviteRole(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currentUserRole === 'owner' && (
                            <SelectItem value="admin">مدير - يمكنه إدارة الفريق والدراسات</SelectItem>
                          )}
                          <SelectItem value="editor">محرر - يمكنه تحرير الدراسات</SelectItem>
                          <SelectItem value="viewer">مشاهد - يمكنه عرض الدراسات فقط</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                      إلغاء
                    </Button>
                    <Button 
                      onClick={handleInviteMember}
                      disabled={!inviteEmail}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      إرسال الدعوة
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث عن الأعضاء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-500">جاري تحميل الأعضاء...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'لم يتم العثور على أعضاء' : 'لا توجد أعضاء في الفريق'}
              </div>
            ) : (
              filteredMembers.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{member.name}</h3>
                          {member.id === currentUserId && (
                            <Badge variant="outline" className="text-xs">أنت</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {getRoleIcon(member.role)}
                            <span className="text-sm">{getRoleName(member.role)}</span>
                          </div>
                          {getStatusBadge(member.status)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm text-gray-500">
                        <p>انضم: {new Date(member.joinedAt).toLocaleDateString('ar-SA')}</p>
                        {member.lastActive && (
                          <p>آخر نشاط: {new Date(member.lastActive).toLocaleDateString('ar-SA')}</p>
                        )}
                      </div>

                      {/* Actions */}
                      {canManageRole(member.role) && member.id !== currentUserId && (
                        <div className="flex items-center gap-1">
                          {/* Change Role */}
                          <Select 
                            value={member.role} 
                            onValueChange={(value: TeamMember['role']) => handleUpdateRole(member.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currentUserRole === 'owner' && member.role !== 'owner' && (
                                <SelectItem value="admin">مدير</SelectItem>
                              )}
                              <SelectItem value="editor">محرر</SelectItem>
                              <SelectItem value="viewer">مشاهد</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Remove Member */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-gray-700">الصلاحيات:</span>
                      {member.permissions.includes('all') ? (
                        <Badge variant="secondary">جميع الصلاحيات</Badge>
                      ) : (
                        member.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {getPermissionName(permission)}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Team Settings */}
          {currentUserRole === 'owner' && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  إعدادات الفريق
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">السماح للأعضاء بدعوة آخرين</h4>
                    <p className="text-sm text-gray-600">يمكن للمديرين والمحررين دعوة أعضاء جدد</p>
                  </div>
                  <Button variant="outline" size="sm">تفعيل</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">المشاركة العامة للدراسات</h4>
                    <p className="text-sm text-gray-600">السماح بمشاركة الدراسات مع أشخاص خارج الفريق</p>
                  </div>
                  <Button variant="outline" size="sm">إعدادات</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getPermissionName(permission: string): string {
  const names = {
    manage_studies: 'إدارة الدراسات',
    edit_studies: 'تحرير الدراسات',
    view_studies: 'عرض الدراسات',
    manage_team: 'إدارة الفريق',
    export: 'التصدير',
    analytics: 'التحليلات'
  };
  return names[permission as keyof typeof names] || permission;
}
