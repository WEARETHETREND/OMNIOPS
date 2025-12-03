import React from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Clock, CheckCircle, AlertCircle, Zap, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sparkline from '@/components/charts/Sparkline';

const statusConfig = {
  active: { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Active' },
  paused: { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', label: 'Paused' },
  draft: { color: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100', label: 'Draft' },
  archived: { color: 'bg-slate-300', text: 'text-slate-500', bg: 'bg-slate-50', label: 'Archived' }
};

const departmentColors = {
  hr: 'from-violet-500 to-purple-600',
  finance: 'from-emerald-500 to-teal-600',
  it: 'from-blue-500 to-cyan-600',
  logistics: 'from-orange-500 to-amber-600',
  customer_service: 'from-pink-500 to-rose-600',
  sales: 'from-green-500 to-emerald-600',
  marketing: 'from-fuchsia-500 to-pink-600',
  operations: 'from-slate-500 to-slate-600'
};

export default function WorkflowCard({ workflow, onToggle }) {
  const status = statusConfig[workflow.status] || statusConfig.draft;
  const gradient = departmentColors[workflow.department] || departmentColors.operations;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/60 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
          gradient
        )}>
          <Zap className="w-5 h-5 text-white" />
        </div>
        <Badge className={cn("font-medium", status.bg, status.text)}>
          <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", status.color)} />
          {status.label}
        </Badge>
      </div>

      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{workflow.name}</h3>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{workflow.description || 'No description'}</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-400">Runs</p>
          <p className="text-sm font-semibold text-slate-900">{workflow.run_count || 0}</p>
        </div>
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-400">Success</p>
          <p className="text-sm font-semibold text-emerald-600">{workflow.success_rate || 0}%</p>
        </div>
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-400">Avg Time</p>
          <p className="text-sm font-semibold text-slate-900">{workflow.avg_duration || 0}s</p>
        </div>
      </div>

      {/* Mini Sparkline */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-xs text-slate-400">7-day trend</span>
        <Sparkline 
          data={[
            { value: 45 + Math.random() * 20 },
            { value: 50 + Math.random() * 20 },
            { value: 48 + Math.random() * 20 },
            { value: 55 + Math.random() * 20 },
            { value: 52 + Math.random() * 20 },
            { value: 60 + Math.random() * 20 },
            { value: 58 + Math.random() * 20 }
          ]}
          showTrend
        />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          {workflow.last_run 
            ? `Last run ${new Date(workflow.last_run).toLocaleDateString()}`
            : 'Never run'
          }
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-3",
            workflow.status === 'active' ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'
          )}
          onClick={() => onToggle?.(workflow)}
        >
          {workflow.status === 'active' ? (
            <>
              <Pause className="w-3.5 h-3.5 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 mr-1" />
              Start
            </>
          )}
        </Button>
      </div>
    </div>
  );
}