import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import CashFlowChart from '../CashFlowChart';

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('CashFlowChart', () => {
  const mockData = [
    { period: 'السنة 1', inflow: 800000, outflow: 600000, netFlow: 200000, cumulative: 200000 },
    { period: 'السنة 2', inflow: 1200000, outflow: 700000, netFlow: 500000, cumulative: 700000 },
    { period: 'السنة 3', inflow: 1500000, outflow: 800000, netFlow: 700000, cumulative: 1400000 },
  ];

  it('renders without crashing', () => {
    render(<CashFlowChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with currency when provided', () => {
    render(<CashFlowChart data={mockData} currency="SAR" />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<CashFlowChart data={mockData} />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('bar')).toHaveLength(4); // inflow, outflow, netFlow, cumulative bars
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getAllByTestId('y-axis')).toHaveLength(2); // left and right y-axis
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<CashFlowChart data={[]} />);
    expect(screen.getByText('لا توجد بيانات للعرض')).toBeInTheDocument();
  });

  it('renders with default currency when not provided', () => {
    render(<CashFlowChart data={mockData} />);
    // Should render without errors
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
