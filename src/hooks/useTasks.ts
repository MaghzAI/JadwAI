import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, Priority } from '@prisma/client';

interface UseTasksOptions {
  projectId: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  stageId?: string;
}

export function useTasks(options: UseTasksOptions) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.priority) params.append('priority', options.priority);
      if (options.assigneeId) params.append('assigneeId', options.assigneeId);
      if (options.stageId) params.append('stageId', options.stageId);

      const response = await fetch(`/api/projects/${options.projectId}/tasks?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب المهام');
      }

      const result = await response.json();
      setTasks(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  }, [options.projectId, options.status, options.priority, options.assigneeId, options.stageId]);

  useEffect(() => {
    if (options.projectId) {
      fetchTasks();
    }
  }, [options.projectId, fetchTasks]);

  const refetch = () => {
    fetchTasks();
  };

  return {
    tasks,
    loading,
    error,
    refetch,
  };
}

export function useCreateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = async (projectId: string, taskData: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إنشاء المهمة');
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
    createTask,
    loading,
    error,
  };
}

export function useUpdateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = async (projectId: string, taskId: string, taskData: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحديث المهمة');
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
    updateTask,
    loading,
    error,
  };
}
