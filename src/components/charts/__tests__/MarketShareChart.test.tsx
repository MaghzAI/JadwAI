import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import MarketShareChart from '../MarketShareChart';

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Cell: () => <div data-testid="cell" />,
}));

describe('MarketShareChart', () => {
  const mockData = [
    { name: 'مشروعنا', value: 15, color: '#3b82f6' },
    { name: 'المنافس الأول', value: 35, color: '#10b981' },
    { name: 'المنافس الثاني', value: 25, color: '#f59e0b' },
    { name: 'المنافس الثالث', value: 15, color: '#ef4444' },
    { name: 'أخرى', value: 10, color: '#8b5cf6' }
  ];

  it('renders without crashing', () => {
    render(<MarketShareChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with title when provided', () => {
    const title = 'Market Share Test Title';
    render(<MarketShareChart data={mockData} title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<MarketShareChart data={mockData} />);
    
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('displays summary statistics', () => {
    render(<MarketShareChart data={mockData} />);
    
    expect(screen.getByText('عدد المنافسين')).toBeInTheDocument();
    expect(screen.getByText('إجمالي السوق')).toBeInTheDocument();
    expect(screen.getByText('أكبر حصة')).toBeInTheDocument();
    expect(screen.getByText('أصغر حصة')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // number of competitors
    expect(screen.getByText('١٠٠')).toBeInTheDocument(); // total market in Arabic numerals
  });

  it('handles empty data gracefully', () => {
    render(<MarketShareChart data={[]} />);
    expect(screen.getByText('عدد المنافسين')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders chart components successfully', () => {
    render(<MarketShareChart data={mockData} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('calculates market share correctly', () => {
    const partialData = [
      { name: 'A', value: 30, color: '#ff0000' },
      { name: 'B', value: 20, color: '#00ff00' }
    ];
    
    render(<MarketShareChart data={partialData} />);
    expect(screen.getByText('٥٠')).toBeInTheDocument(); // total in Arabic numerals
    expect(screen.getByText('60.0%')).toBeInTheDocument(); // largest share
    expect(screen.getByText('40.0%')).toBeInTheDocument(); // smallest share
  });
});
