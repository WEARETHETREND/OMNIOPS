import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  Server,
  Database,
  Cloud,
  Code,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function TechStack() {
  const [stack, setStack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStack = async () => {
    setLoading(true);
    setError('');
    const r = await safeGet('/tech-stack');
    if (!r.ok) {
      setError(r.error);
    } else {
      setStack(r.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStack();
  }, []);

  const categories = [
    { id: 'backend', label: 'Backend', icon: Server, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'database', label: 'Database', icon: Database, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'infrastructure', label: 'Infrastructure', icon: Cloud, gradient: 'from-violet-500 to-purple-500' },
    { id: 'frontend', label: 'Frontend', icon: Code, gradient: 'from-amber-500 to-orange-500' },
  ];

  const getStatusIcon = (status) => {
    if (status === 'healthy') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (status === 'degraded') return <Loader2 className="w-4 h-4 text-amber-500" />;
    if (status === 'down') return <XCircle className="w-4 h-4 text-rose-500" />;
    return <Loader2 className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tech Stack</h1>
          <p className="text-slate-500 mt-1">Infrastructure, services, and dependencies</p>
        </div>
        <Button onClick={loadStack} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* System Overview */}
      {loading ? (
        <Skeleton className="h-32 rounded-xl" />
      ) : stack?.system && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 mb-2">System Version</p>
              <p className="text-4xl font-bold">{stack.system.version || 'v1.0.0'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300 mb-2">Environment</p>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm font-medium">
                {stack.system.environment || 'Production'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tech Stack Categories */}
      {loading ? (
        <div className="space-y-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : stack?.components ? (
        <div className="space-y-6">
          {categories.map(category => {
            const components = stack.components[category.id] || [];
            const Icon = category.icon;
            
            return (
              <div key={category.id} className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
                <div className={`bg-gradient-to-r ${category.gradient} p-6 text-white`}>
                  <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8" />
                    <div>
                      <h2 className="text-xl font-semibold">{category.label}</h2>
                      <p className="text-sm opacity-90">{components.length} components</p>
                    </div>
                  </div>
                </div>

                {components.length > 0 ? (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {components.map((comp, i) => (
                        <div key={i} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-slate-900">{comp.name}</h3>
                              <p className="text-sm text-slate-500 mt-1">{comp.version}</p>
                            </div>
                            {getStatusIcon(comp.status)}
                          </div>
                          {comp.description && (
                            <p className="text-sm text-slate-600 mb-2">{comp.description}</p>
                          )}
                          {comp.url && (
                            <a 
                              href={comp.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              Documentation →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No {category.label.toLowerCase()} components configured
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Server className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No stack data</h3>
          <p className="text-slate-500">Tech stack information not available</p>
        </div>
      )}
    </div>
  );
}