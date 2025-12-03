import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { ChevronRight, ChevronLeft, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DrillDownChart({
  title,
  subtitle,
  data = [],
  dataKey = 'value',
  xAxisKey = 'name',
  type = 'area',
  color = '#10b981',
  drillDownData,
  onDrillDown
}) {
  const [isDrilledDown, setIsDrilledDown] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const displayData = isDrilledDown && drillDownData ? drillDownData : data;

  const handleClick = (item) => {
    if (drillDownData && !isDrilledDown) {
      setSelectedItem(item);
      setIsDrilledDown(true);
      onDrillDown?.(item);
    }
  };

  const handleBack = () => {
    setIsDrilledDown(false);
    setSelectedItem(null);
  };

  return (
    <div className={cn(
      "bg-white rounded-xl border border-slate-200/60 p-5 transition-all",
      expanded && "fixed inset-4 z-50 shadow-2xl"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isDrilledDown && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="h-7 px-2">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h3 className="font-semibold text-slate-900">
              {isDrilledDown && selectedItem ? `${title} - ${selectedItem[xAxisKey]}` : title}
            </h3>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      <div className={cn("transition-all", expanded ? "h-[calc(100%-80px)]" : "h-64")}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={displayData} onClick={(e) => e?.activePayload && handleClick(e.activePayload[0].payload)}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
                cursor={drillDownData ? 'pointer' : 'default'}
              />
            </AreaChart>
          ) : (
            <BarChart data={displayData} onClick={(e) => e?.activePayload && handleClick(e.activePayload[0].payload)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey={dataKey} 
                fill={color} 
                radius={[4, 4, 0, 0]}
                cursor={drillDownData ? 'pointer' : 'default'}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {drillDownData && !isDrilledDown && (
        <p className="text-xs text-slate-400 mt-2 text-center">Click on chart to drill down</p>
      )}
    </div>
  );
}