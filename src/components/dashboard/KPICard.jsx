import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Sparkline from '@/components/charts/Sparkline';
import InfoTooltip from '@/components/ui/InfoTooltip';

export default function KPICard({
  title,
  value,
  unit,
  change,
  trend = 'stable',
  sparklineData = [],
  status,
  icon: Icon,
  tooltip,
  onClick
}) {
  const trendConfig = {
    up: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    down: { icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50' },
    stable: { icon: Minus, color: 'text-slate-500', bg: 'bg-slate-100' },
  };

  const statusColors = {
    healthy: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    critical: 'bg-rose-100 text-rose-700',
  };

  const TrendIcon = trendConfig[trend].icon;

  return (
    <div 
      className={cn(
        "bg-white rounded-xl border border-slate-200/60 p-5 transition-all",
        onClick && "cursor-pointer hover:shadow-lg hover:border-slate-300"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-slate-600" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-slate-500">{title}</p>
              {tooltip && <InfoTooltip text={tooltip} />}
            </div>
          </div>
        </div>
        {status && (
          <Badge className={cn("text-xs", statusColors[status])}>
            {status}
          </Badge>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-slate-900">
            {value}
            {unit && <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>}
          </p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-1", trendConfig[trend].color)}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-slate-400">vs last period</span>
            </div>
          )}
        </div>

        {sparklineData.length > 0 && (
          <Sparkline data={sparklineData} height={40} width={100} />
        )}
      </div>
    </div>
  );
}