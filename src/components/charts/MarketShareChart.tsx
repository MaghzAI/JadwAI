'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MarketShareData {
  name: string;
  value: number;
  color: string;
}

interface MarketShareChartProps {
  data: MarketShareData[];
  title?: string;
  centerLabel?: string;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export default function MarketShareChart({ 
  data, 
  title = 'حصص السوق', 
  centerLabel = 'إجمالي السوق' 
}: MarketShareChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-right">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${((value / total) * 100).toFixed(1)}% (${value.toLocaleString('ar-SA')})`,
                name
              ]}
              contentStyle={{
                backgroundColor: 'rgb(255 255 255 / 0.95)',
                border: '1px solid rgb(229 231 235)',
                borderRadius: '8px',
                fontSize: '12px',
                textAlign: 'right'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">عدد المنافسين</p>
          <p className="text-lg font-semibold">{data.length}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي السوق</p>
          <p className="text-lg font-semibold">{total.toLocaleString('ar-SA')}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">أكبر حصة</p>
          <p className="text-lg font-semibold">
            {Math.max(...data.map(d => (d.value / total) * 100)).toFixed(1)}%
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">أصغر حصة</p>
          <p className="text-lg font-semibold">
            {Math.min(...data.map(d => (d.value / total) * 100)).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
