import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import ROIChart from '../ROIChart';

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

describe('ROIChart', () => {
  const mockData = [
    { year: 1, roi: 15, cumulativeROI: 15 },
    { year: 2, roi: 22, cumulativeROI: 39 },
    { year: 3, roi: 28, cumulativeROI: 78 },
    { year: 4, roi: 25, cumulativeROI: 122 },
    { year: 5, roi: 30, cumulativeROI: 189 }
  ];

  it('renders without crashing', () => {
    render(<ROIChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with title when provided', () => {
    const title = 'Test ROI Chart Title';
    render(<ROIChart data={mockData} title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<ROIChart data={mockData} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('line')).toHaveLength(2); // ROI and Cumulative ROI lines
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(<ROIChart data={[]} />);
    expect(screen.getByText('لا توجد بيانات للعرض')).toBeInTheDocument();
  });

  it('does not render chart when data is empty', () => {
    render(<ROIChart data={[]} />);
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
  });
});
