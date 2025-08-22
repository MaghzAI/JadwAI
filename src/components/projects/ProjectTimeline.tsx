'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause, 
  MoreHorizontal,
  Users,
  Target,
  TrendingUp,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays, isAfter, isBefore, addDays } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface ProjectStage {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed' | 'on_hold';
  progress: number;
  dependencies: string[];
  assignees: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  milestones: Array<{
    id: string;
    name: string;
    date: Date;
    completed: boolean;
  }>;
  tasks: Array<{
    id: string;
    name: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
  }>;
  budget?: {
    allocated: number;
    spent: number;
  };
}

interface ProjectTimelineProps {
  stages: ProjectStage[];
  projectStartDate: Date;
  projectEndDate: Date;
  onStageUpdate: (stageId: string, updates: Partial<ProjectStage>) => void;
  onTaskToggle: (stageId: string, taskId: string) => void;
  onMilestoneToggle: (stageId: string, milestoneId: string) => void;
}

export function ProjectTimeline({ 
  stages, 
  projectStartDate, 
  projectEndDate,
  onStageUpdate,
  onTaskToggle,
  onMilestoneToggle
}: ProjectTimelineProps) {
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'gantt'>('timeline');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const totalDays = differenceInDays(projectEndDate, projectStartDate);
  
  const getStatusColor = (status: ProjectStage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in_progress':
        return 'bg-blue-500 text-white';
      case 'delayed':
        return 'bg-red-500 text-white';
      case 'on_hold':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusIcon = (status: ProjectStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'in_progress':
        return <Play className="h-4 w-4" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4" />;
      case 'on_hold':
        return <Pause className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStagePosition = (stage: ProjectStage) => {
    const stageStart = differenceInDays(stage.startDate, projectStartDate);
    const stageDuration = differenceInDays(stage.endDate, stage.startDate);
    
    return {
      left: `${(stageStart / totalDays) * 100}%`,
      width: `${(stageDuration / totalDays) * 100}%`
    };
  };

  const isStageDelayed = (stage: ProjectStage) => {
    const now = new Date();
    return isAfter(now, stage.endDate) && stage.status !== 'completed';
  };

  const getOverallProgress = () => {
    const totalProgress = stages.reduce((sum, stage) => sum + stage.progress, 0);
    return Math.round(totalProgress / stages.length);
  };

  const completedStages = stages.filter(s => s.status === 'completed').length;
  const delayedStages = stages.filter(s => isStageDelayed(s)).length;
  const activeStages = stages.filter(s => s.status === 'in_progress').length;

  if (viewMode === 'timeline') {
    return (
      <div className="space-y-6">
        {/* Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              الجدول الزمني للمشروع
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              تتبع مراحل المشروع والمعالم الرئيسية
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              الجدول الزمني
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              القائمة
            </Button>
            <Button
              variant={viewMode === 'gantt' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('gantt')}
            >
              مخطط جانت
            </Button>
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي التقدم</p>
                  <p className="text-2xl font-bold">{getOverallProgress()}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المراحل المكتملة</p>
                  <p className="text-2xl font-bold">{completedStages}/{stages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المراحل النشطة</p>
                  <p className="text-2xl font-bold">{activeStages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المراحل المتأخرة</p>
                  <p className="text-2xl font-bold">{delayedStages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              المخطط الزمني
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Timeline Header */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{format(projectStartDate, 'dd MMM yyyy', { locale: ar })}</span>
                <span>{format(projectEndDate, 'dd MMM yyyy', { locale: ar })}</span>
              </div>
              
              {/* Timeline Bar */}
              <div className="relative bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20" />
              </div>

              {/* Stages */}
              <div className="space-y-4">
                {stages.map((stage, index) => {
                  const position = getStagePosition(stage);
                  const isDelayed = isStageDelayed(stage);
                  
                  return (
                    <div key={stage.id} className="relative">
                      <div className="flex items-center gap-4 mb-2">
                        <div className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                          getStatusColor(isDelayed ? 'delayed' : stage.status)
                        )}>
                          {getStatusIcon(isDelayed ? 'delayed' : stage.status)}
                          {stage.name}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {format(stage.startDate, 'dd/MM', { locale: ar })} - 
                          {format(stage.endDate, 'dd/MM', { locale: ar })}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {stage.assignees.length}
                          </span>
                        </div>
                      </div>
                      
                      {/* Stage Timeline Bar */}
                      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-full h-8 mb-2">
                        <div 
                          className={cn(
                            "absolute top-0 h-8 rounded-full flex items-center px-2",
                            isDelayed ? 'bg-red-100 dark:bg-red-900/20 border border-red-300' :
                            stage.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 border border-green-300' :
                            stage.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-300' :
                            'bg-gray-100 dark:bg-gray-800 border border-gray-300'
                          )}
                          style={position}
                        >
                          <div className="flex items-center justify-between w-full text-sm">
                            <span className="font-medium truncate">{stage.name}</span>
                            <span className="text-xs ml-2">{stage.progress}%</span>
                          </div>
                        </div>
                        
                        {/* Progress Bar within Stage */}
                        <div 
                          className={cn(
                            "absolute top-0 h-8 rounded-full opacity-60",
                            isDelayed ? 'bg-red-400' :
                            stage.status === 'completed' ? 'bg-green-400' :
                            'bg-blue-400'
                          )}
                          style={{
                            ...position,
                            width: `${((position.width.replace('%', '') as any) * stage.progress / 100)}%`
                          }}
                        />
                      </div>
                      
                      {/* Milestones */}
                      {stage.milestones.map((milestone) => {
                        const milestonePos = differenceInDays(milestone.date, projectStartDate);
                        const milestoneLeft = `${(milestonePos / totalDays) * 100}%`;
                        
                        return (
                          <div
                            key={milestone.id}
                            className="absolute top-0 transform -translate-x-1/2"
                            style={{ left: milestoneLeft }}
                          >
                            <div 
                              className={cn(
                                "w-3 h-3 rounded-full border-2 bg-white",
                                milestone.completed ? 'border-green-500' : 'border-gray-400'
                              )}
                              title={milestone.name}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stage Details */}
        {selectedStage && (
          <StageDetails 
            stage={stages.find(s => s.id === selectedStage)!}
            onClose={() => setSelectedStage(null)}
            onUpdate={(updates) => onStageUpdate(selectedStage, updates)}
            onTaskToggle={(taskId) => onTaskToggle(selectedStage, taskId)}
            onMilestoneToggle={(milestoneId) => onMilestoneToggle(selectedStage, milestoneId)}
          />
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مراحل المشروع</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            الجدول الزمني
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            القائمة
          </Button>
        </div>
      </div>

      {stages.map((stage) => (
        <Card key={stage.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(stage.status)}>
                  {getStatusIcon(stage.status)}
                  <span className="mr-1">
                    {stage.status === 'completed' ? 'مكتمل' :
                     stage.status === 'in_progress' ? 'قيد التنفيذ' :
                     stage.status === 'delayed' ? 'متأخر' :
                     stage.status === 'on_hold' ? 'متوقف' : 'لم يبدأ'}
                  </span>
                </Badge>
                <div>
                  <CardTitle className="text-lg">{stage.name}</CardTitle>
                  <CardDescription>{stage.description}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>التقدم</span>
                <span>{stage.progress}%</span>
              </div>
              <Progress value={stage.progress} />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">تاريخ البداية:</span>
                  <span className="mr-2">{format(stage.startDate, 'dd/MM/yyyy', { locale: ar })}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">تاريخ الانتهاء:</span>
                  <span className="mr-2">{format(stage.endDate, 'dd/MM/yyyy', { locale: ar })}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{stage.assignees.length} مسؤول</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flag className="h-4 w-4 text-gray-400" />
                  <span>{stage.milestones.length} معلم</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-gray-400" />
                  <span>{stage.tasks.filter(t => t.completed).length}/{stage.tasks.length} مهمة</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Stage Details Modal Component
function StageDetails({ 
  stage, 
  onClose, 
  onUpdate, 
  onTaskToggle, 
  onMilestoneToggle 
}: {
  stage: ProjectStage;
  onClose: () => void;
  onUpdate: (updates: Partial<ProjectStage>) => void;
  onTaskToggle: (taskId: string) => void;
  onMilestoneToggle: (milestoneId: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{stage.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <CardDescription>{stage.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tasks */}
          <div>
            <h4 className="font-semibold mb-3">المهام ({stage.tasks.filter(t => t.completed).length}/{stage.tasks.length})</h4>
            <div className="space-y-2">
              {stage.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onTaskToggle(task.id)}
                    className="rounded"
                  />
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.name}
                  </span>
                  <Badge variant={task.priority === 'high' ? 'destructive' : 
                                 task.priority === 'medium' ? 'default' : 'secondary'}>
                    {task.priority === 'high' ? 'عالي' : 
                     task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h4 className="font-semibold mb-3">المعالم ({stage.milestones.filter(m => m.completed).length}/{stage.milestones.length})</h4>
            <div className="space-y-2">
              {stage.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={() => onMilestoneToggle(milestone.id)}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                      {milestone.name}
                    </span>
                    <div className="text-xs text-gray-500">
                      {format(milestone.date, 'dd/MM/yyyy', { locale: ar })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget */}
        {stage.budget && (
          <div>
            <h4 className="font-semibold mb-3">الميزانية</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">المخصص</p>
                <p className="text-lg font-semibold">{stage.budget.allocated.toLocaleString()} ريال</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">المُنفق</p>
                <p className="text-lg font-semibold">{stage.budget.spent.toLocaleString()} ريال</p>
              </div>
            </div>
            <Progress 
              value={(stage.budget.spent / stage.budget.allocated) * 100} 
              className="mt-2"
            />
          </div>
        )}

        {/* Team */}
        <div>
          <h4 className="font-semibold mb-3">الفريق</h4>
          <div className="flex gap-2">
            {stage.assignees.map((assignee) => (
              <div key={assignee.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                {assignee.avatar ? (
                  <img src={assignee.avatar} alt={assignee.name} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    {assignee.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm">{assignee.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
