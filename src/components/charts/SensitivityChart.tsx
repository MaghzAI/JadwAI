'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface SensitivityData {
  variable: string;
  change: number; // percentage change from baseline
  npvChange: number; // percentage change in NPV
  roiChange: number; // percentage change in ROI
}

interface SensitivityChartProps {
  data: SensitivityData[];
  title?: string;
  baselineNPV?: number;
  baselineROI?: number;
}

export default function SensitivityChart({ 
  data, 
  title = 'تحليل الحساسية',
  baselineNPV,
  baselineROI
}: SensitivityChartProps) {
  // Transform data for chart display
  const chartData = data.flatMap(item => [
    {
      variable: item.variable,
      change: -20,
      npvChange: item.npvChange * -1,
      roiChange: item.roiChange * -1,
      scenario: 'متشائم'
    },
    {
      variable: item.variable,
      change: -10,
      npvChange: item.npvChange * -0.5,
      roiChange: item.roiChange * -0.5,
      scenario: 'محافظ'
    },
    {
      variable: item.variable,
      change: 0,
      npvChange: 0,
      roiChange: 0,
      scenario: 'أساسي'
    },
    {
      variable: item.variable,
      change: 10,
      npvChange: item.npvChange * 0.5,
      roiChange: item.roiChange * 0.5,
      scenario: 'متفائل'
    },
    {
      variable: item.variable,
      change: 20,
      npvChange: item.npvChange,
      roiChange: item.roiChange,
      scenario: 'متفائل جداً'
    }
  ]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-right">{title}</h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* NPV Sensitivity */}
        <div>
          <h4 className="text-md font-medium mb-3 text-right">حساسية صافي القيمة الحالية</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.filter((_, index) => index % 5 < 5)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="change" 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'نسبة التغيير (%)', position: 'insideBottom', offset: -10, textAnchor: 'middle' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'تأثير NPV (%)', angle: -90, position: 'insideLeft', textAnchor: 'middle' }}
                />
                <Tooltip 
                  formatter={(value, name) => [`${Number(value).toFixed(1)}%`, 'تأثير NPV']}
                  labelFormatter={(label) => `تغيير ${label}%`}
                  contentStyle={{
                    backgroundColor: 'rgb(255 255 255 / 0.95)',
                    border: '1px solid rgb(229 231 235)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    textAlign: 'right'
                  }}
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
                {data.map((item, index) => (
                  <Line 
                    key={item.variable}
                    type="monotone" 
                    dataKey="npvChange"
                    data={chartData.filter(d => d.variable === item.variable)}
                    stroke={`hsl(${(index * 360) / data.length}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                    name={item.variable}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROI Sensitivity */}
        <div>
          <h4 className="text-md font-medium mb-3 text-right">حساسية العائد على الاستثمار</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.filter((_, index) => index % 5 < 5)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="change" 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'نسبة التغيير (%)', position: 'insideBottom', offset: -10, textAnchor: 'middle' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'تأثير ROI (%)', angle: -90, position: 'insideLeft', textAnchor: 'middle' }}
                />
                <Tooltip 
                  formatter={(value, name) => [`${Number(value).toFixed(1)}%`, 'تأثير ROI']}
                  labelFormatter={(label) => `تغيير ${label}%`}
                  contentStyle={{
                    backgroundColor: 'rgb(255 255 255 / 0.95)',
                    border: '1px solid rgb(229 231 235)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    textAlign: 'right'
                  }}
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
                {data.map((item, index) => (
                  <Line 
                    key={`roi-${item.variable}`}
                    type="monotone" 
                    dataKey="roiChange"
                    data={chartData.filter(d => d.variable === item.variable)}
                    stroke={`hsl(${(index * 360) / data.length}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                    name={item.variable}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Variable Sensitivity Ranking */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-3 text-right">ترتيب المتغيرات حسب التأثير</h4>
        <div className="space-y-2">
          {data
            .sort((a, b) => Math.abs(b.npvChange) - Math.abs(a.npvChange))
            .map((item, index) => (
              <div key={item.variable} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item.variable}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    تأثير NPV: <span className="font-medium">{item.npvChange > 0 ? '+' : ''}{item.npvChange.toFixed(1)}%</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    تأثير ROI: <span className="font-medium">{item.roiChange > 0 ? '+' : ''}{item.roiChange.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Scenario Summary */}
      <div className="mt-6 grid grid-cols-5 gap-2 text-xs">
        <div className="p-2 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded text-center">
          <div className="font-medium">متشائم</div>
          <div>-20%</div>
        </div>
        <div className="p-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded text-center">
          <div className="font-medium">محافظ</div>
          <div>-10%</div>
        </div>
        <div className="p-2 bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 rounded text-center">
          <div className="font-medium">أساسي</div>
          <div>0%</div>
        </div>
        <div className="p-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded text-center">
          <div className="font-medium">متفائل</div>
          <div>+10%</div>
        </div>
        <div className="p-2 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded text-center">
          <div className="font-medium">متفائل جداً</div>
          <div>+20%</div>
        </div>
      </div>
    </div>
  );
}
