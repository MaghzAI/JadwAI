'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface ROIData {
  year: number;
  roi: number;
  cumulativeROI: number;
}

interface ROIChartProps {
  data: ROIData[];
  title?: string;
}

export default function ROIChart({ data, title = 'العائد على الاستثمار عبر الزمن' }: ROIChartProps) {
  const isMobile = useIsMobile();

  return (
    <div className="w-full space-y-4">
      {title && (
        <h3 className="text-base sm:text-lg font-semibold text-center px-2">{title}</h3>
      )}
      
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 sm:h-64 text-gray-500">
          <p className="text-sm sm:text-base">لا توجد بيانات للعرض</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
          <LineChart 
            data={data} 
            margin={{ 
              top: 5, 
              right: isMobile ? 15 : 30, 
              left: isMobile ? 10 : 20, 
              bottom: 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#6b7280' }}
              tickFormatter={(value) => isMobile ? `${value}` : `السنة ${value}`}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#6b7280' }}
              tickFormatter={(value) => `${value}%`}
              width={isMobile ? 40 : 60}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 border rounded-lg shadow-lg text-xs sm:text-sm">
                      <p className="font-semibold mb-1 sm:mb-2">{`السنة ${label}`}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                          {`${entry.name}: ${entry.value}%`}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
            />
            <Line 
              type="monotone" 
              dataKey="roi" 
              stroke="#3b82f6" 
              strokeWidth={isMobile ? 2 : 3}
              name="العائد السنوي"
              dot={{ r: isMobile ? 4 : 6 }}
              activeDot={{ r: isMobile ? 6 : 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="cumulativeROI" 
              stroke="#10b981" 
              strokeWidth={isMobile ? 2 : 3}
              name="العائد التراكمي"
              dot={{ r: isMobile ? 4 : 6 }}
              activeDot={{ r: isMobile ? 6 : 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
