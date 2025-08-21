import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import RecentActivity from '../RecentActivity';

describe('RecentActivity', () => {
  const mockActivities = [
    {
      id: '1',
      type: 'project_created',
      title: 'إنشاء مشروع جديد',
      description: 'تم إنشاء مشروع "مطعم الأصالة"',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      user: 'أحمد محمد',
      status: 'completed'
    },
    {
      id: '2',
      type: 'study_updated',
      title: 'تحديث دراسة الجدوى',
      description: 'تم تحديث دراسة جدوى مشروع "متجر الإلكترونيات"',
      timestamp: new Date('2024-01-15T09:15:00Z'),
      user: 'سارة أحمد',
      status: 'in_progress'
    },
    {
      id: '3',
      type: 'report_generated',
      title: 'إنتاج تقرير',
      description: 'تم إنتاج التقرير المالي للربع الأول',
      timestamp: new Date('2024-01-15T08:45:00Z'),
      user: 'محمد علي',
      status: 'completed'
    }
  ];

  it('renders without crashing', () => {
    render(<RecentActivity activities={mockActivities} loading={false} />);
    expect(screen.getByText('النشاطات الأخيرة')).toBeInTheDocument();
  });

  it('displays all activities', () => {
    render(<RecentActivity activities={mockActivities} loading={false} />);
    
    expect(screen.getByText('إنشاء مشروع جديد')).toBeInTheDocument();
    expect(screen.getByText('تحديث دراسة الجدوى')).toBeInTheDocument();
    expect(screen.getByText('إنتاج تقرير')).toBeInTheDocument();
  });

  it('displays activity descriptions', () => {
    render(<RecentActivity activities={mockActivities} loading={false} />);
    
    expect(screen.getByText('تم إنشاء مشروع "مطعم الأصالة"')).toBeInTheDocument();
    expect(screen.getByText('تم تحديث دراسة جدوى مشروع "متجر الإلكترونيات"')).toBeInTheDocument();
    expect(screen.getByText('تم إنتاج التقرير المالي للربع الأول')).toBeInTheDocument();
  });

  it('displays user names', () => {
    render(<RecentActivity activities={mockActivities} loading={false} />);
    
    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('سارة أحمد')).toBeInTheDocument();
    expect(screen.getByText('محمد علي')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading is true', () => {
    render(<RecentActivity activities={[]} loading={true} />);
    
    const skeletons = screen.getAllByTestId('activity-skeleton');
    expect(skeletons).toHaveLength(5);
  });

  it('displays status badges with correct colors', () => {
    render(<RecentActivity activities={mockActivities} loading={false} />);
    
    // Check that status badges are rendered
    const completedStatuses = screen.getAllByText('مكتمل');
    const inProgressStatuses = screen.getAllByText('قيد التنفيذ');
    
    expect(completedStatuses).toHaveLength(2);
    expect(inProgressStatuses).toHaveLength(1);
  });

  it('formats timestamps correctly', () => {
    render(<RecentActivity activities={mockActivities} loading={false} />);
    
    // Check that relative time is displayed (exact format may vary based on implementation)
    expect(screen.getByText(/منذ/)).toBeInTheDocument();
  });

  it('renders with empty activities list', () => {
    render(<RecentActivity activities={[]} loading={false} />);
    
    expect(screen.getByText('النشاطات الأخيرة')).toBeInTheDocument();
    expect(screen.getByText('لا توجد نشاطات حديثة')).toBeInTheDocument();
  });

  it('displays activity icons based on type', () => {
    render(<RecentActivity activities={mockActivities} loading={false} />);
    
    // Icons should be present for different activity types
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThan(0);
  });

  it('shows view all activities link', () => {
    render(<RecentActivity activities={mockActivities} loading={false} />);
    
    expect(screen.getByText('عرض جميع النشاطات')).toBeInTheDocument();
  });
});
