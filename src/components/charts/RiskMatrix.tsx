'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RiskData {
  id: string;
  name: string;
  probability: number; // 1-5 scale
  impact: number; // 1-5 scale
  category: 'financial' | 'operational' | 'technical' | 'market' | 'regulatory';
}

interface RiskMatrixProps {
  data: RiskData[];
  title?: string;
}

const categoryColors = {
  financial: '#ef4444',
  operational: '#f97316',
  technical: '#3b82f6',
  market: '#10b981',
  regulatory: '#8b5cf6'
};

const categoryLabels = {
  financial: 'مالي',
  operational: 'تشغيلي',
  technical: 'تقني',
  market: 'سوقي',
  regulatory: 'تنظيمي'
};

const getRiskLevel = (probability: number, impact: number) => {
  const score = probability * impact;
  if (score >= 20) return 'عالي جداً';
  if (score >= 15) return 'عالي';
  if (score >= 10) return 'متوسط';
  if (score >= 5) return 'منخفض';
  return 'منخفض جداً';
};

const getRiskColor = (probability: number, impact: number) => {
  const score = probability * impact;
  if (score >= 20) return '#dc2626';
  if (score >= 15) return '#ea580c';
  if (score >= 10) return '#d97706';
  if (score >= 5) return '#65a30d';
  return '#16a34a';
};

export default function RiskMatrix({ data, title = 'مصفوفة المخاطر' }: RiskMatrixProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-right">{title}</h3>
      
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 justify-center">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: categoryColors[key as keyof typeof categoryColors] }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              type="number" 
              dataKey="probability" 
              name="الاحتمالية" 
              domain={[0.5, 5.5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 12 }}
              label={{ value: 'الاحتمالية', position: 'insideBottom', offset: -10, textAnchor: 'middle' }}
            />
            <YAxis 
              type="number" 
              dataKey="impact" 
              name="التأثير" 
              domain={[0.5, 5.5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 12 }}
              label={{ value: 'التأثير', angle: -90, position: 'insideLeft', textAnchor: 'middle' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as RiskData;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                      <h4 className="font-semibold text-sm mb-2">{data.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        الفئة: {categoryLabels[data.category]}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        الاحتمالية: {data.probability}/5
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        التأثير: {data.impact}/5
                      </p>
                      <p className="text-xs font-medium mt-1">
                        مستوى المخاطرة: {getRiskLevel(data.probability, data.impact)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="المخاطر" data={data} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getRiskColor(entry.probability, entry.impact)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Level Legend */}
      <div className="mt-4 grid grid-cols-5 gap-2 text-xs text-center">
        <div className="p-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded">
          منخفض جداً<br/>(1-4)
        </div>
        <div className="p-2 bg-lime-100 text-lime-800 dark:bg-lime-900/20 dark:text-lime-400 rounded">
          منخفض<br/>(5-9)
        </div>
        <div className="p-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded">
          متوسط<br/>(10-14)
        </div>
        <div className="p-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded">
          عالي<br/>(15-19)
        </div>
        <div className="p-2 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded">
          عالي جداً<br/>(20-25)
        </div>
      </div>
    </div>
  );
}
