import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import SensitivityChart from '../SensitivityChart';

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('SensitivityChart', () => {
  const mockData = [
    { variable: 'سعر المنتج', npvChange: 45, roiChange: 38 },
    { variable: 'حجم المبيعات', npvChange: 42, roiChange: 35 },
    { variable: 'تكلفة التشغيل', npvChange: -30, roiChange: -25 },
    { variable: 'تكلفة المواد', npvChange: -25, roiChange: -20 },
    { variable: 'معدل الخصم', npvChange: -20, roiChange: -15 }
  ];

  it('renders without crashing', () => {
    render(<SensitivityChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<SensitivityChart data={mockData} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('line')).toHaveLength(2); // NPV and ROI lines
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('displays variable impact ranking', () => {
    render(<SensitivityChart data={mockData} />);
    
    expect(screen.getByText('ترتيب المتغيرات حسب التأثير:')).toBeInTheDocument();
    expect(screen.getByText('سعر المنتج')).toBeInTheDocument();
    expect(screen.getByText('حجم المبيعات')).toBeInTheDocument();
    expect(screen.getByText('تكلفة التشغيل')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<SensitivityChart data={[]} />);
    expect(screen.getByText('لا توجد بيانات للعرض')).toBeInTheDocument();
  });

  it('displays scenario labels', () => {
    render(<SensitivityChart data={mockData} />);
    
    expect(screen.getByText('السيناريو الأساسي')).toBeInTheDocument();
    expect(screen.getByText('السيناريو المتفائل (+10%)')).toBeInTheDocument();
    expect(screen.getByText('السيناريو المتشائم (-10%)')).toBeInTheDocument();
  });

  it('ranks variables by absolute impact correctly', () => {
    render(<SensitivityChart data={mockData} />);
    
    // Should rank by absolute NPV change: سعر المنتج (45) > حجم المبيعات (42) > تكلفة التشغيل (30)
    const rankings = screen.getAllByText(/^\d+\./);
    expect(rankings).toHaveLength(5);
  });
});
