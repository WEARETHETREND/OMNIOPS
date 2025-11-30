import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Clock, RefreshCw, RotateCcw, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const statusConfig = {
  connected: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Connected' },
  disconnected: { icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-100', label: 'Disconnected' },
  error: { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Error' },
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' }
};

const typeGradients = {
  crm: 'from-blue-500 to-indigo-600',
  erp: 'from-violet-500 to-purple-600',
  database: 'from-emerald-500 to-teal-600',
  api: 'from-orange-500 to-red-600',
  cloud_service: 'from-cyan-500 to-blue-600',
  communication: 'from-pink-500 to-rose-600',
  analytics: 'from-amber-500 to-orange-600',
  storage: 'from-slate-500 to-slate-700'
};

export default function IntegrationCard({ integration, onSync, onRetry }) {
  const [retrying, setRetrying] = useState(false);
  const status = statusConfig[integration.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const gradient = typeGradients[integration.type] || typeGradients.api;

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetry?.(integration);
      toast.success(`Reconnecting to ${integration.name}...`);
    } catch (e) {
      toast.error('Retry failed');
    } finally {
      setTimeout(() => setRetrying(false), 2000);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg",
          gradient
        )}>
          {integration.provider?.[0]?.toUpperCase() || 'I'}
        </div>
        <Badge className={cn("font-medium", status.bg, status.color)}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
      </div>

      <h3 className="font-semibold text-slate-900 mb-0.5">{integration.name}</h3>
      <p className="text-sm text-slate-500 mb-3">{integration.provider}</p>

      <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
        <span className="capitalize">{integration.type?.replace('_', ' ')}</span>
        <span>{integration.sync_frequency}</span>
      </div>

      {integration.status === 'error' && integration.error_message && (
        <div className="bg-rose-50 rounded-lg p-3 mb-4 border border-rose-100">
          <p className="text-xs text-rose-600 line-clamp-2">{integration.error_message}</p>
        </div>
      )}

      {integration.data_synced !== undefined && integration.status !== 'error' && (
        <div className="bg-slate-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Records synced</span>
            <span className="text-sm font-semibold text-slate-900">
              {integration.data_synced?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {integration.last_sync 
            ? `Synced ${new Date(integration.last_sync).toLocaleDateString()}`
            : 'Never synced'
          }
        </span>
        <div className="flex gap-1">
          {integration.status === 'error' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              onClick={handleRetry}
              disabled={retrying}
            >
              {retrying ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
              )}
              Retry
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-slate-600"
            onClick={() => onSync?.(integration)}
            disabled={integration.status === 'disconnected' || integration.status === 'error'}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Sync
          </Button>
        </div>
      </div>
    </div>
  );
}