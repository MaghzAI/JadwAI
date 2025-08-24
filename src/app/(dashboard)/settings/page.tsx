'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { 
  User,
  Settings,
  Bell,
  Globe,
  Palette,
  Shield,
  Database,
  Key,
  Mail,
  Phone,
  MapPin,
  Building,
  Camera,
  Save,
  RefreshCcw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface UserSettings {
  // Profile
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  location: string;
  bio: string;
  avatar: string;
  
  // Preferences
  language: string;
  theme: string;
  currency: string;
  dateFormat: string;
  timezone: string;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  projectUpdates: boolean;
  studyAlerts: boolean;
  weeklyReports: boolean;
  
  // Privacy & Security
  profileVisibility: string;
  dataSharing: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<UserSettings>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    location: '',
    bio: '',
    avatar: '',
    
    language: 'ar',
    theme: 'system',
    currency: 'SAR',
    dateFormat: 'dd/MM/yyyy',
    timezone: 'Asia/Riyadh',
    
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    studyAlerts: true,
    weeklyReports: false,
    
    profileVisibility: 'team',
    dataSharing: false,
    twoFactorAuth: false,
    sessionTimeout: 60
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Load user settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          // Map API shape -> UI shape safely
          const fullName: string = data.name || '';
          const nameParts = fullName.split(' ').filter(Boolean);
          const first = nameParts[0] || '';
          const last = nameParts.slice(1).join(' ') || '';

          setSettings((prev) => ({
            ...prev,
            firstName: first,
            lastName: last,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            company: data.company || prev.company,
            location: data.location || prev.location,
            bio: data.bio || prev.bio,
            avatar: data.image || prev.avatar,
            language: data.language || prev.language,
            theme: data.theme || prev.theme,
          }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadSettings();
  }, [session]);

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) {
      // Handle avatar removal
      setUploadingAvatar(true);
      try {
        const response = await fetch('/api/upload/avatar', {
          method: 'DELETE',
        });

        if (response.ok) {
          setSettings(prev => ({ ...prev, avatar: '' }));
        } else {
          alert('حدث خطأ أثناء حذف الصورة');
        }
      } catch (error) {
        console.error('Error removing avatar:', error);
        alert('حدث خطأ أثناء حذف الصورة');
      } finally {
        setUploadingAvatar(false);
      }
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'فشل في رفع الصورة');
      }

      const data = await response.json();
      setSettings(prev => ({ ...prev, avatar: data.avatarUrl }));
      alert('تم رفع الصورة بنجاح');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Construct payload matching API schema
      const payload = {
        name: `${settings.firstName} ${settings.lastName}`.trim() || settings.email,
        email: settings.email,
        phone: settings.phone || undefined,
        company: settings.company || undefined,
        location: settings.location || undefined,
        bio: settings.bio || undefined,
        image: settings.avatar || undefined,
        language: settings.language,
        theme: settings.theme,
      };

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ الإعدادات');
      }

      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('كلمات المرور الجديدة غير متطابقة');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'فشل في تغيير كلمة المرور');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('تم تغيير كلمة المرور بنجاح');
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Simulate data export
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-settings.json';
    a.click();
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto p-6" dir="rtl">
        <div className="flex items-center justify-center h-64">
          <RefreshCcw className="h-8 w-8 animate-spin" />
          <span className="ml-2">جاري تحميل الإعدادات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إعدادات المستخدم</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            إدارة ملفك الشخصي وتفضيلات النظام
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? (
            <RefreshCcw className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="ml-2 h-4 w-4" />
          )}
          حفظ التغييرات
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            التفضيلات
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            الأمان والخصوصية
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            إدارة البيانات
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                المعلومات الشخصية
              </CardTitle>
              <CardDescription>
                تحديث معلوماتك الشخصية ومعلومات جهة الاتصال
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={settings.avatar} alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {(settings.firstName?.charAt(0) || '')}{(settings.lastName?.charAt(0) || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="font-medium">الصورة الشخصية</h4>
                    <p className="text-sm text-gray-500">
                      يُفضل استخدام صورة مربعة بحجم 400x400 بكسل
                    </p>
                  </div>
                </div>
                
                <FileUpload
                  onFileSelect={handleAvatarUpload}
                  currentImage={settings.avatar}
                  disabled={uploadingAvatar}
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => setSettings({...settings, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">الاسم الأخير</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => setSettings({...settings, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">المسمى الوظيفي</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="jobTitle"
                      value={settings.jobTitle}
                      onChange={(e) => setSettings({...settings, jobTitle: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">الشركة</Label>
                  <Input
                    id="company"
                    value={settings.company}
                    onChange={(e) => setSettings({...settings, company: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">الموقع</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={settings.location}
                    onChange={(e) => setSettings({...settings, location: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">نبذة شخصية</Label>
                <textarea
                  id="bio"
                  rows={4}
                  value={settings.bio}
                  onChange={(e) => setSettings({...settings, bio: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="اكتب نبذة مختصرة عن نفسك..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid gap-6">
            {/* Language & Localization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  اللغة والتوطين
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اللغة</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>العملة</Label>
                    <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                        <SelectItem value="EUR">يورو (EUR)</SelectItem>
                        <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>تنسيق التاريخ</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => setSettings({...settings, dateFormat: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>المنطقة الزمنية</Label>
                    <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                        <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme & Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  المظهر والثيم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>المظهر</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">فاتح</SelectItem>
                      <SelectItem value="dark">داكن</SelectItem>
                      <SelectItem value="system">تلقائي (حسب النظام)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>
                اختر نوع الإشعارات التي تريد تلقيها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>إشعارات البريد الإلكتروني</Label>
                    <p className="text-sm text-gray-500">تلقي الإشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>الإشعارات الفورية</Label>
                    <p className="text-sm text-gray-500">تلقي الإشعارات الفورية في المتصفح</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>تحديثات المشاريع</Label>
                    <p className="text-sm text-gray-500">إشعارات عند تحديث حالة المشاريع</p>
                  </div>
                  <Switch
                    checked={settings.projectUpdates}
                    onCheckedChange={(checked) => setSettings({...settings, projectUpdates: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>تنبيهات دراسات الجدوى</Label>
                    <p className="text-sm text-gray-500">تنبيهات عند إكمال أو تحديث دراسات الجدوى</p>
                  </div>
                  <Switch
                    checked={settings.studyAlerts}
                    onCheckedChange={(checked) => setSettings({...settings, studyAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>التقارير الأسبوعية</Label>
                    <p className="text-sm text-gray-500">تلقي تقرير أسبوعي بملخص النشاطات</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => setSettings({...settings, weeklyReports: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6">
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  تغيير كلمة المرور
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handlePasswordChange} 
                  disabled={!currentPassword || !newPassword || !confirmPassword || loading}
                >
                  تغيير كلمة المرور
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  الخصوصية والأمان
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>رؤية الملف الشخصي</Label>
                  <Select value={settings.profileVisibility} onValueChange={(value) => setSettings({...settings, profileVisibility: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">عام</SelectItem>
                      <SelectItem value="team">أعضاء الفريق فقط</SelectItem>
                      <SelectItem value="private">خاص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>مشاركة البيانات للتحليلات</Label>
                    <p className="text-sm text-gray-500">مشاركة بيانات مجهولة لتحسين الخدمة</p>
                  </div>
                  <Switch
                    checked={settings.dataSharing}
                    onCheckedChange={(checked) => setSettings({...settings, dataSharing: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>المصادقة الثنائية</Label>
                    <p className="text-sm text-gray-500">تفعيل طبقة حماية إضافية للحساب</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>انتهاء صلاحية الجلسة (دقيقة)</Label>
                  <Select 
                    value={settings.sessionTimeout.toString()} 
                    onValueChange={(value) => setSettings({...settings, sessionTimeout: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 دقيقة</SelectItem>
                      <SelectItem value="30">30 دقيقة</SelectItem>
                      <SelectItem value="60">ساعة واحدة</SelectItem>
                      <SelectItem value="120">ساعتان</SelectItem>
                      <SelectItem value="0">لا تنتهي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                إدارة البيانات
              </CardTitle>
              <CardDescription>
                تصدير، استيراد، أو حذف بياناتك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">تصدير البيانات</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    تحميل نسخة من جميع بياناتك بصيغة JSON
                  </p>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="ml-2 h-4 w-4" />
                    تصدير البيانات
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">استيراد البيانات</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    استيراد بيانات من ملف JSON محفوظ مسبقاً
                  </p>
                  <Button variant="outline">
                    <Upload className="ml-2 h-4 w-4" />
                    استيراد البيانات
                  </Button>
                </div>

                <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/10 dark:border-red-800">
                  <h4 className="font-semibold mb-2 text-red-800 dark:text-red-400">منطقة الخطر</h4>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                    حذف حسابك سيؤدي لفقدان جميع البيانات نهائياً
                  </p>
                  <Button variant="destructive">
                    <Trash2 className="ml-2 h-4 w-4" />
                    حذف الحساب
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
