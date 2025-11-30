import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bg: 'bg-gradient-to-r from-rose-50 to-rose-100/50',
    border: 'border-rose-200',
    iconBg: 'bg-rose-500',
    text: 'text-rose-700'
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-gradient-to-r from-orange-50 to-orange-100/50',
    border: 'border-orange-200',
    iconBg: 'bg-orange-500',
    text: 'text-orange-700'
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-gradient-to-r from-amber-50 to-amber-100/50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-500',
    text: 'text-amber-700'
  },
  info: {
    icon: Info,
    bg: 'bg-gradient-to-r from-blue-50 to-blue-100/50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-500',
    text: 'text-blue-700'
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-gradient-to-r from-emerald-50 to-emerald-100/50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-500',
    text: 'text-emerald-700'
  }
};

export default function AlertBanner({ alert, onDismiss }) {
  const config = severityConfig[alert.severity] || severityConfig.info;
  const Icon = config.icon;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border p-4 pr-12",
      config.bg,
      config.border
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", config.iconBg)}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-semibold text-sm", config.text)}>{alert.title}</p>
          <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">{alert.message}</p>
          <p className="text-xs text-slate-400 mt-1">
            {new Date(alert.created_date).toLocaleString()}
          </p>
        </div>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 w-8 h-8 text-slate-400 hover:text-slate-600"
          onClick={() => onDismiss(alert.id)}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}