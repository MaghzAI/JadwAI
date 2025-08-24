import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationType } from '@prisma/client';

interface UseNotificationsOptions {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}

interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const [data, setData] = useState<NotificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.isRead !== undefined) params.append('isRead', options.isRead.toString());
      if (options.type) params.append('type', options.type);

      const response = await fetch(`/api/notifications?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب الإشعارات');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.isRead, options.type]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const refetch = () => {
    fetchNotifications();
  };

  return {
    notifications: data?.notifications || [],
    pagination: data?.pagination,
    unreadCount: data?.unreadCount || 0,
    loading,
    error,
    refetch,
  };
}

export function useMarkNotificationAsRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsRead = async (notificationId: string, isRead: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحديث الإشعار');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    markAsRead,
    loading,
    error,
  };
}

export function useCreateNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNotification = async (notificationData: {
    title: string;
    message: string;
    type?: NotificationType;
    relatedId?: string;
    relatedType?: string;
    userId?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إنشاء الإشعار');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNotification,
    loading,
    error,
  };
}
