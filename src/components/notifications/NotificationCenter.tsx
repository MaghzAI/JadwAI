'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  BellRing, 
  Settings, 
  Check, 
  X, 
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  FileText,
  TrendingUp,
  MessageSquare,
  Users,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'task' | 'deadline' | 'milestone' | 'budget' | 'team' | 'system' | 'approval';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
  relatedProject?: {
    id: string;
    name: string;
  };
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'deadline',
      priority: 'urgent',
      title: 'موعد تسليم قريب',
      message: 'يجب تسليم المرحلة الثانية من مشروع المطعم خلال 3 أيام',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      actionUrl: '/projects/1',
      actionLabel: 'عرض المشروع',
      relatedProject: { id: '1', name: 'مشروع المطعم' }
    },
    {
      id: '2',
      type: 'task',
      priority: 'high',
      title: 'مهمة جديدة مُسندة إليك',
      message: 'تم تكليفك بمراجعة التقرير المالي',
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      sender: { id: '2', name: 'فاطمة أحمد' },
      relatedProject: { id: '2', name: 'مشروع التجارة الإلكترونية' }
    },
    {
      id: '3',
      type: 'milestone',
      priority: 'medium',
      title: 'تم إنجاز معلم مهم',
      message: 'تم الانتهاء من مرحلة التطوير الأولي بنجاح',
      isRead: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      relatedProject: { id: '3', name: 'مشروع التطبيق المحمول' }
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task': return User;
      case 'deadline': return Clock;
      case 'milestone': return CheckCircle2;
      case 'budget': return DollarSign;
      case 'team': return Users;
      case 'system': return Settings;
      case 'approval': return FileText;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return notification.type === activeTab;
  });

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        {unreadCount > 0 ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>الإشعارات</DialogTitle>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="h-4 w-4 mr-2" />
                    قراءة الكل
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">الكل ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">غير مقروءة ({unreadCount})</TabsTrigger>
              <TabsTrigger value="task">المهام</TabsTrigger>
              <TabsTrigger value="deadline">المواعيد</TabsTrigger>
            </TabsList>

            <div className="mt-4 max-h-[50vh] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد إشعارات</h3>
                  <p className="text-gray-500">ستظهر الإشعارات الجديدة هنا</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: { 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = getNotificationIcon(notification.type);

  return (
    <div className={`p-4 border rounded-lg ${!notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
          <Icon className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{notification.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>{format(notification.createdAt, 'PPp', { locale: ar })}</span>
                {notification.relatedProject && (
                  <span>• {notification.relatedProject.name}</span>
                )}
                {notification.sender && (
                  <span>• من {notification.sender.name}</span>
                )}
              </div>

              {notification.actionUrl && (
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                  {notification.actionLabel || 'عرض التفاصيل'}
                </Button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {!notification.isRead && (
                  <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    تحديد كمقروء
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete(notification.id)}>
                  <X className="h-4 w-4 mr-2" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
