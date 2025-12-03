import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Sparkline({ 
  data = [], 
  dataKey = 'value',
  color = '#10b981',
  height = 32,
  width = 80,
  showTrend = false
}) {
  if (!data.length) return null;

  const values = data.map(d => d[dataKey]);
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const trend = lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'stable';
  const changePercent = firstValue ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={trend === 'up' ? '#10b981' : trend === 'down' ? '#f43f5e' : '#94a3b8'} 
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {showTrend && (
        <div className={cn(
          "flex items-center gap-0.5 text-xs font-medium",
          trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-400'
        )}>
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          <span>{changePercent > 0 ? '+' : ''}{changePercent}%</span>
        </div>
      )}
    </div>
  );
}