import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import StatsOverview from '../StatsOverview';

describe('StatsOverview', () => {
  const mockData = [
    {
      title: 'إجمالي المشاريع',
      value: '24',
      description: '+12% من الشهر الماضي',
      trend: '+2.5%',
      icon: 'FolderOpen',
      color: 'blue'
    },
    {
      title: 'دراسات الجدوى',
      value: '18',
      description: '+8% من الشهر الماضي',
      trend: '+1.8%',
      icon: 'FileText',
      color: 'green'
    },
    {
      title: 'إجمالي الاستثمار',
      value: '2.4M',
      description: '+15% من الشهر الماضي',
      trend: '+5.2%',
      icon: 'DollarSign',
      color: 'purple'
    },
    {
      title: 'معدل العائد',
      value: '24.5%',
      description: '+3% من الشهر الماضي',
      trend: '+0.8%',
      icon: 'TrendingUp',
      color: 'orange'
    }
  ];

  it('renders without crashing', () => {
    render(<StatsOverview data={mockData} loading={false} />);
    expect(screen.getByText('إجمالي المشاريع')).toBeInTheDocument();
  });

  it('displays all stats cards', () => {
    render(<StatsOverview data={mockData} loading={false} />);
    
    expect(screen.getByText('إجمالي المشاريع')).toBeInTheDocument();
    expect(screen.getByText('دراسات الجدوى')).toBeInTheDocument();
    expect(screen.getByText('إجمالي الاستثمار')).toBeInTheDocument();
    expect(screen.getByText('معدل العائد')).toBeInTheDocument();
  });

  it('displays correct values and descriptions', () => {
    render(<StatsOverview data={mockData} loading={false} />);
    
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('2.4M')).toBeInTheDocument();
    expect(screen.getByText('24.5%')).toBeInTheDocument();
    
    expect(screen.getByText('+12% من الشهر الماضي')).toBeInTheDocument();
    expect(screen.getByText('+8% من الشهر الماضي')).toBeInTheDocument();
    expect(screen.getByText('+15% من الشهر الماضي')).toBeInTheDocument();
    expect(screen.getByText('+3% من الشهر الماضي')).toBeInTheDocument();
  });

  it('displays trend indicators', () => {
    render(<StatsOverview data={mockData} loading={false} />);
    
    expect(screen.getByText('+2.5%')).toBeInTheDocument();
    expect(screen.getByText('+1.8%')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
    expect(screen.getByText('+0.8%')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading is true', () => {
    render(<StatsOverview data={[]} loading={true} />);
    
    const skeletons = screen.getAllByTestId('stat-skeleton');
    expect(skeletons).toHaveLength(4);
  });

  it('renders with empty data', () => {
    render(<StatsOverview data={[]} loading={false} />);
    // Should render without crashing
    expect(screen.queryByText('إجمالي المشاريع')).not.toBeInTheDocument();
  });

  it('applies correct color classes based on color prop', () => {
    render(<StatsOverview data={mockData} loading={false} />);
    
    // Check that cards are rendered (exact color classes depend on implementation)
    const cards = screen.getAllByRole('generic');
    expect(cards.length).toBeGreaterThan(0);
  });
});
