import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Runs() {
  const [runs, setRuns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadRuns = async () => {
    setLoading(true);
    const r = await safeGet('/api/runs');
    if (r.ok) {
      setRuns(r.data.runs || r.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const filteredRuns = runs.filter(run => 
    run.run_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    run.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-emerald-50 text-emerald-700',
      running: 'bg-blue-50 text-blue-700',
      failed: 'bg-rose-50 text-rose-700',
      pending: 'bg-amber-50 text-amber-700',
    };
    return styles[status?.toLowerCase()] || 'bg-slate-50 text-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Runs</h1>
          <p className="text-sm text-slate-500">Monday, January 6, 2026</p>
        </div>
        <Button size="sm" onClick={loadRuns} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>🏠</span>
        <span>/</span>
        <span className="text-slate-900">Runs</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <p className="text-xs text-slate-500 mb-2">Total Runs</p>
          <p className="text-2xl font-bold text-slate-900">{runs.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <p className="text-xs text-slate-500 mb-2">Success</p>
          <p className="text-2xl font-bold text-emerald-600">
            {runs.filter(r => r.status?.toLowerCase() === 'success').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <p className="text-xs text-slate-500 mb-2">Running</p>
          <p className="text-2xl font-bold text-blue-600">
            {runs.filter(r => r.status?.toLowerCase() === 'running').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <p className="text-xs text-slate-500 mb-2">Failed</p>
          <p className="text-2xl font-bold text-rose-600">
            {runs.filter(r => r.status?.toLowerCase() === 'failed').length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search runs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Run ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Started At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ended At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredRuns.length > 0 ? (
                filteredRuns.map((run) => (
                  <tr key={run.run_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {run.run_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(run.status)}`}>
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      ${typeof run.cost === 'number' ? run.cost.toFixed(4) : run.cost || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {run.started_at ? new Date(run.started_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {run.ended_at ? new Date(run.ended_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                    No runs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}