import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Plus, 
  Search, 
  Zap,
  Play,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWorkflows = async () => {
    setLoading(true);
    setError('');
    const r = await safeGet('/workflows', { status: 'all' });
    if (!r.ok) {
      setError(r.error);
    } else {
      setWorkflows(r.data.workflows || []);
    }
    setLoading(false);
  };

  const runNow = async (id, name) => {
    const r = await safePost(`/workflows/${id}/run`, { input: {} });
    if (!r.ok) {
      toast.error(`Failed to run workflow: ${r.error}`);
    } else {
      toast.success(`Queued run ${r.data.runId} for ${name}`);
      await loadWorkflows();
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const filteredWorkflows = workflows.filter(w => 
    w.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    paused: workflows.filter(w => w.status === 'paused').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-slate-900" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Workflows</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
              <p className="text-sm text-slate-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-amber-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.paused}</p>
              <p className="text-sm text-slate-500">Paused</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={loadWorkflows} variant="outline">
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Workflows Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filteredWorkflows.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Name</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Last Run</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Success Rate</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Avg Duration</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkflows.map(w => (
                <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900">{w.name}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      w.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                      w.status === 'paused' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        w.status === 'active' ? 'bg-emerald-500' :
                        w.status === 'paused' ? 'bg-amber-500' :
                        'bg-slate-400'
                      }`} />
                      {w.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {w.lastRunAt ? new Date(w.lastRunAt).toLocaleString() : '—'}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {typeof w.successRate === 'number' ? `${Math.round(w.successRate * 100)}%` : '—'}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {typeof w.avgDurationMs === 'number' ? `${Math.round(w.avgDurationMs / 1000)}s` : '—'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={createPageUrl(`WorkflowDetails?id=${w.id}`)}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => runNow(w.id, w.name)}
                      >
                        <Play className="w-3.5 h-3.5 mr-1" />
                        Run Now
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Zap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No workflows found</h3>
          <p className="text-slate-500">
            {searchQuery ? 'Try adjusting your search' : 'No workflows available'}
          </p>
        </div>
      )}
    </div>
  );
}