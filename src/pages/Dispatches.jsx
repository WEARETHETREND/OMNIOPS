import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  Search,
  Filter,
  TrendingUp,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Dispatches() {
  const [dispatches, setDispatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDispatches = async () => {
    setLoading(true);
    setError('');
    const r = await safeGet('/dispatch', { status: statusFilter === 'all' ? undefined : statusFilter });
    if (!r.ok) {
      setError(r.error);
    } else {
      setDispatches(r.data.dispatches || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDispatches();
  }, [statusFilter]);

  const filteredDispatches = dispatches.filter(d => 
    d.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSavings = dispatches
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + (d.estimatedSavingsUsd || 0), 0);

  const stats = {
    total: dispatches.length,
    completed: dispatches.filter(d => d.status === 'completed').length,
    running: dispatches.filter(d => d.status === 'running').length,
    failed: dispatches.filter(d => d.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-slate-900" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
              <p className="text-sm text-slate-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-blue-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.running}</p>
              <p className="text-sm text-slate-500">Running</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-rose-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.failed}</p>
              <p className="text-sm text-slate-500">Failed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">${totalSavings.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Savings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search dispatches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={loadDispatches} variant="outline">
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Dispatches Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(10).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : filteredDispatches.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">ID</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Action</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-slate-700">Estimated Savings</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDispatches.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-mono text-slate-600">{d.id}</td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-900">{d.action?.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      d.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                      d.status === 'running' ? 'bg-blue-50 text-blue-700' :
                      d.status === 'failed' ? 'bg-rose-50 text-rose-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        d.status === 'completed' ? 'bg-emerald-500' :
                        d.status === 'running' ? 'bg-blue-500' :
                        d.status === 'failed' ? 'bg-rose-500' :
                        'bg-slate-400'
                      }`} />
                      {d.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-sm font-semibold text-emerald-600">
                      ${(d.estimatedSavingsUsd || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {new Date(d.timestamp || d.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No dispatches found</h3>
          <p className="text-slate-500">
            {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No dispatches available'}
          </p>
        </div>
      )}
    </div>
  );
}