'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  Share2, 
  Link, 
  Copy, 
  Eye, 
  Edit, 
  Lock,
  Globe,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ShareLink {
  id: string;
  url: string;
  title: string;
  permissions: 'view' | 'comment' | 'edit';
  expiresAt?: string;
  password?: boolean;
  accessCount: number;
  maxAccess?: number;
  isActive: boolean;
  createdAt: string;
}

interface SharePermission {
  id: string;
  email: string;
  name?: string;
  permissions: 'view' | 'comment' | 'edit';
  grantedAt: string;
  lastAccessed?: string;
}

interface ProjectSharingProps {
  projectId: string;
  projectTitle: string;
  isOwner: boolean;
}

export function ProjectSharing({ projectId, projectTitle, isOwner }: ProjectSharingProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [sharePermissions, setSharePermissions] = useState<SharePermission[]>([]);
  const [showCreateLinkDialog, setShowCreateLinkDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [publicSharing, setPublicSharing] = useState(false);
  const [loading, setLoading] = useState(true);

  // New link form
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkPermissions, setNewLinkPermissions] = useState<'view' | 'comment' | 'edit'>('view');
  const [newLinkExpiry, setNewLinkExpiry] = useState('');
  const [newLinkPassword, setNewLinkPassword] = useState('');
  const [newLinkMaxAccess, setNewLinkMaxAccess] = useState('');

  // Direct share form
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermissions, setSharePermissionsValue] = useState<'view' | 'comment' | 'edit'>('view');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    loadSharingData();
  }, [projectId]);

  const loadSharingData = async () => {
    setLoading(true);
    try {
      // Mock data for development
      const mockLinks: ShareLink[] = [
        {
          id: '1',
          url: `https://platform.com/shared/abc123`,
          title: 'رابط المشاهدة العامة',
          permissions: 'view',
          expiresAt: '2024-02-15',
          password: false,
          accessCount: 23,
          maxAccess: 100,
          isActive: true,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          url: `https://platform.com/shared/def456`,
          title: 'رابط للمراجعين',
          permissions: 'comment',
          expiresAt: '2024-01-30',
          password: true,
          accessCount: 7,
          isActive: true,
          createdAt: '2024-01-18'
        }
      ];

      const mockPermissions: SharePermission[] = [
        {
          id: '1',
          email: 'reviewer@company.com',
          name: 'مراجع خارجي',
          permissions: 'comment',
          grantedAt: '2024-01-16',
          lastAccessed: '2024-01-19'
        },
        {
          id: '2',
          email: 'partner@firm.com',
          name: 'شريك تجاري',
          permissions: 'view',
          grantedAt: '2024-01-17'
        }
      ];

      setShareLinks(mockLinks);
      setSharePermissions(mockPermissions);
    } catch (error) {
      console.error('Failed to load sharing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async () => {
    try {
      const newLink: ShareLink = {
        id: Date.now().toString(),
        url: `https://platform.com/shared/${Math.random().toString(36).substr(2, 9)}`,
        title: newLinkTitle || `رابط ${getPermissionName(newLinkPermissions)}`,
        permissions: newLinkPermissions,
        expiresAt: newLinkExpiry || undefined,
        password: !!newLinkPassword,
        accessCount: 0,
        maxAccess: newLinkMaxAccess ? parseInt(newLinkMaxAccess) : undefined,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      setShareLinks(prev => [...prev, newLink]);
      
      // Reset form
      setNewLinkTitle('');
      setNewLinkPermissions('view');
      setNewLinkExpiry('');
      setNewLinkPassword('');
      setNewLinkMaxAccess('');
      setShowCreateLinkDialog(false);
    } catch (error) {
      console.error('Failed to create share link:', error);
    }
  };

  const handleDirectShare = async () => {
    try {
      const newPermission: SharePermission = {
        id: Date.now().toString(),
        email: shareEmail,
        permissions: sharePermissions,
        grantedAt: new Date().toISOString()
      };

      setSharePermissions(prev => [...prev, newPermission]);
      
      // Reset form
      setShareEmail('');
      setSharePermissionsValue('view');
      setShareMessage('');
      setShowShareDialog(false);

      // In production, send email notification
      console.log('Share invitation sent to:', shareEmail);
    } catch (error) {
      console.error('Failed to share directly:', error);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    // Show toast notification
    console.log('Link copied:', url);
  };

  const handleToggleLinkStatus = (linkId: string) => {
    setShareLinks(prev => prev.map(link => 
      link.id === linkId 
        ? { ...link, isActive: !link.isActive }
        : link
    ));
  };

  const handleDeleteLink = (linkId: string) => {
    setShareLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const handleRevokePermission = (permissionId: string) => {
    setSharePermissions(prev => prev.filter(perm => perm.id !== permissionId));
  };

  const getPermissionName = (permission: string) => {
    const names = {
      view: 'المشاهدة',
      comment: 'التعليق',
      edit: 'التحرير'
    };
    return names[permission as keyof typeof names] || permission;
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'comment':
        return <Users className="h-4 w-4" />;
      case 'edit':
        return <Edit className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  if (!isOwner) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">غير مخول للمشاركة</h3>
          <p className="text-gray-600">يمكن لمالك المشروع فقط إدارة إعدادات المشاركة</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Public Sharing Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            المشاركة العامة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">تفعيل المشاركة العامة</h4>
              <p className="text-sm text-gray-600">
                السماح لأي شخص لديه الرابط بالوصول للمشروع
              </p>
            </div>
            <Switch
              checked={publicSharing}
              onCheckedChange={setPublicSharing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Share Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              مشاركة سريعة
            </div>
            <div className="flex gap-2">
              <Dialog open={showCreateLinkDialog} onOpenChange={setShowCreateLinkDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Link className="h-4 w-4 mr-2" />
                    إنشاء رابط
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إنشاء رابط مشاركة</DialogTitle>
                    <DialogDescription>
                      أنشئ رابط مشاركة مخصص مع صلاحيات وقيود محددة
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>عنوان الرابط (اختياري)</Label>
                      <Input
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="مثال: رابط للمراجعين"
                      />
                    </div>
                    <div>
                      <Label>الصلاحيات</Label>
                      <Select value={newLinkPermissions} onValueChange={(value: any) => setNewLinkPermissions(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">مشاهدة فقط</SelectItem>
                          <SelectItem value="comment">مشاهدة وتعليق</SelectItem>
                          <SelectItem value="edit">مشاهدة وتحرير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>تاريخ الانتهاء (اختياري)</Label>
                      <Input
                        type="date"
                        value={newLinkExpiry}
                        onChange={(e) => setNewLinkExpiry(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>كلمة مرور (اختياري)</Label>
                      <Input
                        type="password"
                        value={newLinkPassword}
                        onChange={(e) => setNewLinkPassword(e.target.value)}
                        placeholder="أدخل كلمة مرور للحماية"
                      />
                    </div>
                    <div>
                      <Label>الحد الأقصى للوصول (اختياري)</Label>
                      <Input
                        type="number"
                        value={newLinkMaxAccess}
                        onChange={(e) => setNewLinkMaxAccess(e.target.value)}
                        placeholder="مثال: 100"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateLinkDialog(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleCreateLink}>
                      إنشاء الرابط
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    مشاركة مباشرة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>مشاركة مباشرة</DialogTitle>
                    <DialogDescription>
                      شارك المشروع مباشرة مع أشخاص محددين عبر البريد الإلكتروني
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>البريد الإلكتروني</Label>
                      <Input
                        type="email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <Label>الصلاحيات</Label>
                      <Select value={sharePermissions} onValueChange={(value: any) => setSharePermissionsValue(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">مشاهدة فقط</SelectItem>
                          <SelectItem value="comment">مشاهدة وتعليق</SelectItem>
                          <SelectItem value="edit">مشاهدة وتحرير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>رسالة (اختياري)</Label>
                      <Textarea
                        value={shareMessage}
                        onChange={(e) => setShareMessage(e.target.value)}
                        placeholder="أضف رسالة شخصية..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleDirectShare} disabled={!shareEmail}>
                      إرسال الدعوة
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Share Links */}
      <Card>
        <CardHeader>
          <CardTitle>روابط المشاركة ({shareLinks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {shareLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد روابط مشاركة. أنشئ رابط جديد للبدء.
            </div>
          ) : (
            <div className="space-y-4">
              {shareLinks.map((link) => (
                <div key={link.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{link.title}</h4>
                        <div className="flex items-center gap-1">
                          {getPermissionIcon(link.permissions)}
                          <span className="text-sm text-gray-600">
                            {getPermissionName(link.permissions)}
                          </span>
                        </div>
                        {link.isActive ? (
                          <Badge variant="default" className="bg-green-600">نشط</Badge>
                        ) : (
                          <Badge variant="secondary">متوقف</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>تم إنشاؤه: {new Date(link.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                        {link.expiresAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>ينتهي: {new Date(link.expiresAt).toLocaleDateString('ar-SA')}</span>
                          </div>
                        )}
                        <div>
                          الوصول: {link.accessCount}
                          {link.maxAccess && ` / ${link.maxAccess}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(link.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleLinkStatus(link.id)}
                      >
                        {link.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-2 font-mono text-sm break-all">
                    {link.url}
                  </div>

                  {link.password && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        محمي بكلمة مرور
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Direct Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>الصلاحيات المباشرة ({sharePermissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sharePermissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد صلاحيات مباشرة. شارك المشروع مع أشخاص محددين.
            </div>
          ) : (
            <div className="space-y-3">
              {sharePermissions.map((permission) => (
                <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">
                        {permission.name || permission.email}
                      </h4>
                      <div className="flex items-center gap-1">
                        {getPermissionIcon(permission.permissions)}
                        <span className="text-sm text-gray-600">
                          {getPermissionName(permission.permissions)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>تم المنح: {new Date(permission.grantedAt).toLocaleDateString('ar-SA')}</span>
                      {permission.lastAccessed && (
                        <span>آخر دخول: {new Date(permission.lastAccessed).toLocaleDateString('ar-SA')}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokePermission(permission.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    إلغاء الصلاحية
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
