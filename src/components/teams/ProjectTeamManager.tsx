'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { 
  Users, 
  UserPlus, 
  Crown, 
  Shield, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Settings,
  Trash2,
  Edit,
  Star,
  Activity,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
  department: string;
  joinedAt: Date;
  lastActive: Date;
  status: 'active' | 'away' | 'busy' | 'offline';
  skills: string[];
  tasksAssigned: number;
  tasksCompleted: number;
  performance: number; // 0-100
  workload: number; // 0-100
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: Date;
  projectsCount: number;
}

interface ProjectTeamManagerProps {
  projectId: string;
  canManage?: boolean;
}

const ROLES = [
  { value: 'owner', label: 'مالك المشروع', icon: Crown, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'admin', label: 'مدير', icon: Shield, color: 'bg-red-100 text-red-800' },
  { value: 'manager', label: 'مدير فريق', icon: User, color: 'bg-blue-100 text-blue-800' },
  { value: 'member', label: 'عضو فريق', icon: User, color: 'bg-green-100 text-green-800' },
  { value: 'viewer', label: 'مراقب', icon: User, color: 'bg-gray-100 text-gray-800' }
];

export function ProjectTeamManager({ projectId, canManage = false }: ProjectTeamManagerProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'أحمد محمد السالم',
      email: 'ahmed@example.com',
      avatar: '/avatars/01.png',
      role: 'owner',
      department: 'الإدارة',
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date(),
      status: 'active',
      skills: ['إدارة المشاريع', 'التخطيط الاستراتيجي', 'القيادة'],
      tasksAssigned: 8,
      tasksCompleted: 6,
      performance: 95,
      workload: 80
    },
    {
      id: '2',
      name: 'فاطمة أحمد علي',
      email: 'fatima@example.com',
      role: 'admin',
      department: 'التطوير',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'away',
      skills: ['تطوير الويب', 'إدارة قواعد البيانات', 'UI/UX'],
      tasksAssigned: 12,
      tasksCompleted: 10,
      performance: 88,
      workload: 75
    },
    {
      id: '3',
      name: 'محمد علي حسن',
      email: 'mohammed@example.com',
      role: 'manager',
      department: 'التسويق',
      joinedAt: new Date('2024-02-01'),
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      status: 'busy',
      skills: ['التسويق الرقمي', 'إدارة المحتوى', 'تحليل البيانات'],
      tasksAssigned: 6,
      tasksCompleted: 4,
      performance: 92,
      workload: 60
    }
  ]);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getRoleInfo = (role: TeamMember['role']) => {
    return ROLES.find(r => r.value === role) || ROLES[4];
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'متاح';
      case 'away': return 'غائب';
      case 'busy': return 'مشغول';
      case 'offline': return 'غير متصل';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return 'text-red-600';
    if (workload >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            فريق العمل
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            إدارة أعضاء الفريق والأدوار والصلاحيات
          </p>
        </div>

        {canManage && (
          <div className="flex gap-2">
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  دعوة عضو
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>دعوة عضو جديد</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل العضو الجديد لدعوته للانضمام للفريق
                  </DialogDescription>
                </DialogHeader>
                <InviteMemberForm onClose={() => setIsInviteDialogOpen(false)} />
              </DialogContent>
            </Dialog>
            
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              إعدادات الفريق
            </Button>
          </div>
        )}
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold">{teamMembers.length}</p>
                <p className="text-gray-600 dark:text-gray-400">أعضاء الفريق</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold">
                  {teamMembers.filter(m => m.status === 'active').length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">أعضاء متاحون</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold">
                  {Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length)}%
                </p>
                <p className="text-gray-600 dark:text-gray-400">متوسط الأداء</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold">
                  {teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">المهام المكتملة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="workload">عبء العمل</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map(member => (
              <MemberCard 
                key={member.id} 
                member={member} 
                onSelect={setSelectedMember}
                canManage={canManage}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>تقييم أداء الفريق</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ')[0][0]}{member.name.split(' ')[1][0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">المهام المكتملة</p>
                        <p className="font-bold">{member.tasksCompleted}/{member.tasksAssigned}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">الأداء</p>
                        <p className={`font-bold ${getPerformanceColor(member.performance)}`}>
                          {member.performance}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>توزيع عبء العمل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ')[0][0]}{member.name.split(' ')[1][0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <span className={`font-medium ${getWorkloadColor(member.workload)}`}>
                        {member.workload}%
                      </span>
                    </div>
                    <Progress value={member.workload} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Member Details Dialog */}
      {selectedMember && (
        <MemberDetailsDialog 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)}
          canManage={canManage}
        />
      )}
    </div>
  );
}

function MemberCard({ 
  member, 
  onSelect, 
  canManage 
}: { 
  member: TeamMember; 
  onSelect: (member: TeamMember) => void;
  canManage: boolean;
}) {
  const roleInfo = getRoleInfo(member.role);
  const RoleIcon = roleInfo.icon;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(member)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name.split(' ')[0][0]}{member.name.split(' ')[1][0]}</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
            </div>
            <div>
              <h4 className="font-medium">{member.name}</h4>
              <p className="text-sm text-gray-600">{member.department}</p>
            </div>
          </div>

          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  تعديل
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="h-4 w-4 mr-2" />
                  إرسال رسالة
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  إزالة من الفريق
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={roleInfo.color}>
              <RoleIcon className="h-3 w-3 mr-1" />
              {roleInfo.label}
            </Badge>
            <span className="text-xs text-gray-500">{getStatusLabel(member.status)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">المهام</p>
              <p className="font-medium">{member.tasksCompleted}/{member.tasksAssigned}</p>
            </div>
            <div>
              <p className="text-gray-600">الأداء</p>
              <p className={`font-medium ${getPerformanceColor(member.performance)}`}>
                {member.performance}%
              </p>
            </div>
          </div>

          {member.skills.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 mb-2">المهارات</p>
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 3).map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {member.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{member.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MemberDetailsDialog({ 
  member, 
  onClose, 
  canManage 
}: { 
  member: TeamMember; 
  onClose: () => void;
  canManage: boolean;
}) {
  const roleInfo = getRoleInfo(member.role);

  return (
    <Dialog open={!!member} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>تفاصيل العضو</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="text-lg">
                {member.name.split(' ')[0][0]}{member.name.split(' ')[1][0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={roleInfo.color}>
                  <roleInfo.icon className="h-3 w-3 mr-1" />
                  {roleInfo.label}
                </Badge>
                <Badge variant="outline">{getStatusLabel(member.status)}</Badge>
              </div>
            </div>

            {canManage && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  تعديل
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  رسالة
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{member.tasksCompleted}</p>
                <p className="text-sm text-gray-600">مهام مكتملة</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{member.tasksAssigned - member.tasksCompleted}</p>
                <p className="text-sm text-gray-600">مهام قيد التنفيذ</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className={`text-2xl font-bold ${getPerformanceColor(member.performance)}`}>
                  {member.performance}%
                </p>
                <p className="text-sm text-gray-600">تقييم الأداء</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="font-medium mb-3">المهارات والخبرات</h4>
            <div className="flex flex-wrap gap-2">
              {member.skills.map(skill => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">تاريخ الانضمام</p>
              <p className="font-medium">
                {format(member.joinedAt, 'PPP', { locale: ar })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">آخر نشاط</p>
              <p className="font-medium">
                {format(member.lastActive, 'PPp', { locale: ar })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InviteMemberForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'member' as TeamMember['role'],
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the invitation
    console.log('Sending invitation:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="أدخل البريد الإلكتروني"
          required
        />
      </div>

      <div>
        <Label htmlFor="role">الدور</Label>
        <Select 
          value={formData.role} 
          onValueChange={(value: TeamMember['role']) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.slice(1).map(role => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="message">رسالة الدعوة (اختيارية)</Label>
        <Input
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="أضف رسالة شخصية"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit">إرسال الدعوة</Button>
        <Button type="button" variant="outline" onClick={onClose}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
