import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import RiskMatrix from '../RiskMatrix';

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  ScatterChart: ({ children }: { children: React.ReactNode }) => <div data-testid="scatter-chart">{children}</div>,
  Scatter: () => <div data-testid="scatter" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Cell: () => <div data-testid="cell" />,
}));

describe('RiskMatrix', () => {
  const mockData = [
    { name: 'مخاطر السوق', probability: 0.7, impact: 0.8, riskLevel: 'عالية' },
    { name: 'مخاطر التمويل', probability: 0.4, impact: 0.9, riskLevel: 'متوسطة' },
    { name: 'مخاطر تقنية', probability: 0.3, impact: 0.6, riskLevel: 'منخفضة' },
  ];

  it('renders without crashing', () => {
    render(<RiskMatrix data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with title when provided', () => {
    const title = 'Risk Matrix Test Title';
    render(<RiskMatrix data={mockData} title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<RiskMatrix data={mockData} />);
    
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('scatter')).toHaveLength(3); // High, Medium, Low risk levels
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('displays risk level legend', () => {
    render(<RiskMatrix data={mockData} />);
    
    expect(screen.getByText('مخاطر عالية')).toBeInTheDocument();
    expect(screen.getByText('مخاطر متوسطة')).toBeInTheDocument();
    expect(screen.getByText('مخاطر منخفضة')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<RiskMatrix data={[]} />);
    expect(screen.getByText('لا توجد بيانات للعرض')).toBeInTheDocument();
  });

  it('renders axis labels correctly', () => {
    render(<RiskMatrix data={mockData} />);
    expect(screen.getByText('الاحتمالية')).toBeInTheDocument();
    expect(screen.getByText('التأثير')).toBeInTheDocument();
  });
});
