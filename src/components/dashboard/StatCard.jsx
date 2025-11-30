import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  unit = '', 
  change, 
  trend = 'stable', 
  icon: Icon,
  gradient = 'from-slate-500 to-slate-600'
}) {
  const trendConfig = {
    up: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    down: { icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-50' },
    stable: { icon: Minus, color: 'text-slate-400', bg: 'bg-slate-100' }
  };

  const TrendIcon = trendConfig[trend].icon;

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900">{value}</span>
            {unit && <span className="text-lg text-slate-400">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
              trendConfig[trend].bg,
              trendConfig[trend].color
            )}>
              <TrendIcon className="w-3 h-3" />
              <span>{change > 0 ? '+' : ''}{change}%</span>
              <span className="text-slate-400">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
            gradient
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      <div className={cn(
        "absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-5",
        gradient
      )} />
    </div>
  );
}