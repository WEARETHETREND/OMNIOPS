import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WorkflowExecutionPanel({ execution }) {
  if (!execution) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        No execution data
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-500/10';
      case 'running':
        return 'border-blue-500 bg-blue-500/10';
      case 'failed':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-slate-700 bg-slate-800/50';
    }
  };

  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Status</span>
            <span className={cn(
              "text-sm font-medium capitalize",
              execution.status === 'completed' && 'text-green-500',
              execution.status === 'running' && 'text-blue-500',
              execution.status === 'failed' && 'text-red-500'
            )}>
              {execution.status}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {execution.steps.map((step, idx) => (
            <div
              key={step.nodeId}
              className={cn(
                "relative border-l-4 pl-4 pb-4",
                getStatusColor(step.status)
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getStatusIcon(step.status)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white mb-1">{step.name}</h4>
                  <p className="text-xs text-slate-400 capitalize mb-2">{step.status}</p>
                  
                  {step.startTime && (
                    <div className="text-xs text-slate-500">
                      Started: {new Date(step.startTime).toLocaleTimeString()}
                    </div>
                  )}
                  
                  {step.endTime && (
                    <div className="text-xs text-slate-500">
                      Completed: {new Date(step.endTime).toLocaleTimeString()}
                    </div>
                  )}

                  {step.duration && (
                    <div className="text-xs text-slate-500">
                      Duration: {step.duration}ms
                    </div>
                  )}

                  {step.output && (
                    <div className="mt-2 p-2 bg-slate-950 rounded border border-slate-800">
                      <pre className="text-xs text-slate-400 overflow-x-auto">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </div>
                  )}

                  {step.error && (
                    <div className="mt-2 p-2 bg-red-950/20 rounded border border-red-900/50">
                      <p className="text-xs text-red-400">{step.error}</p>
                    </div>
                  )}
                </div>
              </div>

              {idx < execution.steps.length - 1 && (
                <div className="absolute left-0 top-12 bottom-0 w-0.5 bg-slate-800" />
              )}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}