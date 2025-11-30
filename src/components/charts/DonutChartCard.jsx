import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

export default function DonutChartCard({ 
  title, 
  subtitle,
  data, 
  dataKey = 'value',
  nameKey = 'name',
  height = 280,
  showLegend = true
}) {
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-6">
        <div style={{ width: height, height: height * 0.8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey={dataKey}
                nameKey={nameKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '13px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {showLegend && (
          <div className="flex-1 space-y-2">
            {data.map((item, index) => (
              <div key={item[nameKey]} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-slate-600 capitalize">
                    {item[nameKey]?.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-900">
                  {Math.round((item[dataKey] / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}