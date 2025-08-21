'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface CashFlowData {
  period: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulative: number;
}

interface CashFlowChartProps {
  data: CashFlowData[];
  title?: string;
  currency?: string;
}

export default function CashFlowChart({ data, title = 'التدفق النقدي', currency = 'SAR' }: CashFlowChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full h-96">
      <h3 className="text-lg font-semibold mb-4 text-right">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              if (Math.abs(value) >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
              } else if (Math.abs(value) >= 1000) {
                return `${(value / 1000).toFixed(0)}K`;
              }
              return value.toString();
            }}
          />
          <Tooltip 
            formatter={(value, name) => {
              const labels: Record<string, string> = {
                inflow: 'التدفق الداخل',
                outflow: 'التدفق الخارج',
                netFlow: 'صافي التدفق',
                cumulative: 'التدفق التراكمي'
              };
              return [formatCurrency(value as number), labels[name] || name];
            }}
            labelFormatter={(label) => `الفترة: ${label}`}
            contentStyle={{
              backgroundColor: 'rgb(255 255 255 / 0.95)',
              border: '1px solid rgb(229 231 235)',
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'right'
            }}
          />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
          <Bar 
            dataKey="inflow" 
            fill="#10b981" 
            name="inflow"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="outflow" 
            fill="#ef4444" 
            name="outflow"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="netFlow" 
            fill="#3b82f6" 
            name="netFlow"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
