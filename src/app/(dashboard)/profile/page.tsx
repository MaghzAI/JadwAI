'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Edit,
  Save,
  X,
  Settings,
  Shield,
  Bell,
  Palette,
  Globe
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  location?: string;
  bio?: string;
  role: string;
  createdAt: string;
  avatar?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الملف الشخصي');
      }
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        company: data.company || '',
        location: data.location || '',
        bio: data.bio || ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ التغييرات');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setEditing(false);
      setSuccess('تم حفظ التغييرات بنجاح');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      company: profile?.company || '',
      location: profile?.location || '',
      bio: profile?.bio || ''
    });
    setEditing(false);
    setError('');
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { label: 'مدير النظام', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
      MANAGER: { label: 'مدير', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      USER: { label: 'مستخدم', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      VIEWER: { label: 'مشاهد', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Alert variant="destructive">
          <AlertDescription>فشل في تحميل بيانات الملف الشخصي</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {profile.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
              {getRoleBadge(profile.role)}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!editing ? (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 ml-2" />
              تعديل الملف الشخصي
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 ml-2" />
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 ml-2" />
                إلغاء
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">المعلومات الشخصية</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  المعلومات الأساسية
                </CardTitle>
                <CardDescription>
                  معلوماتك الشخصية الأساسية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input value={profile.email} disabled />
                  <p className="text-xs text-gray-500">لا يمكن تغيير البريد الإلكتروني</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!editing}
                    placeholder="مثال: +966501234567"
                    dir="ltr"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  المعلومات المهنية
                </CardTitle>
                <CardDescription>
                  معلومات العمل والشركة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">الشركة/المنظمة</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    disabled={!editing}
                    placeholder="اسم الشركة أو المنظمة"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">الموقع</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!editing}
                    placeholder="المدينة، البلد"
                  />
                </div>

                <div className="space-y-2">
                  <Label>الدور</Label>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {getRoleBadge(profile.role)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle>نبذة شخصية</CardTitle>
              <CardDescription>
                أضف وصفاً قصيراً عن نفسك ومجال عملك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                disabled={!editing}
                placeholder="أكتب نبذة مختصرة عن نفسك وخبراتك..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                معلومات الحساب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">تاريخ إنشاء الحساب</Label>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">معرف المستخدم</Label>
                  <p className="font-medium font-mono text-xs">{profile.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات التطبيق
              </CardTitle>
              <CardDescription>
                خصص تجربتك في استخدام المنصة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5" />
                  <div>
                    <p className="font-medium">اللغة</p>
                    <p className="text-sm text-gray-500">اختر لغة واجهة التطبيق</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">العربية</Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5" />
                  <div>
                    <p className="font-medium">المظهر</p>
                    <p className="text-sm text-gray-500">اختر بين المظهر الفاتح والداكن</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">النظام</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                الأمان والخصوصية
              </CardTitle>
              <CardDescription>
                إدارة إعدادات الأمان وكلمة المرور
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                تغيير كلمة المرور
              </Button>
              <Button variant="outline" className="w-full justify-start">
                المصادقة الثنائية
              </Button>
              <Button variant="outline" className="w-full justify-start">
                عرض الجلسات النشطة
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>
                اختر الإشعارات التي تريد استلامها
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                ستتم إضافة إعدادات الإشعارات قريباً
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
