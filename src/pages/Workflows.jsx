import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Plus, 
  Search, 
  Zap,
  Play,
  MoreVertical,
  TrendingUp,
  Clock,
  BarChart2,
  Grid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');

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
    drafts: workflows.filter(w => w.status === 'draft').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workflows</h1>
          <p className="text-sm text-slate-500">Wednesday, December 4, 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Grid className="w-4 h-4 mr-2" />
            Visual Builder
          </Button>
          <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Quick Create
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>🏠</span>
        <span>/</span>
        <span className="text-slate-900">Workflows</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 rounded-full bg-slate-900" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Workflows</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 rounded-full bg-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 rounded-full bg-amber-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.paused}</p>
              <p className="text-xs text-slate-500">Paused</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 rounded-full bg-slate-400" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.drafts}</p>
              <p className="text-xs text-slate-500">Drafts</p>
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
        <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option>All Departments</option>
          <option>HR</option>
          <option>Finance</option>
          <option>IT</option>
        </select>
        <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Paused</option>
        </select>
        <div className="flex items-center border border-slate-200 rounded-lg">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Workflows Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredWorkflows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredWorkflows.map(w => (
            <WorkflowCard key={w.id} workflow={w} onRun={runNow} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200/60">
          <Zap className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">No workflows found</h3>
          <p className="text-sm text-slate-500">
            {searchQuery ? 'Try adjusting your search' : 'No workflows available'}
          </p>
        </div>
      )}
    </div>
  );
}

function WorkflowCard({ workflow, onRun }) {
  const trendData = [
    { value: 12 },
    { value: 19 },
    { value: 15 },
    { value: 25 },
    { value: 22 },
    { value: 30 },
    { value: 28 },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-5 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          workflow.status === 'active' ? 'bg-emerald-100' :
          workflow.status === 'paused' ? 'bg-amber-100' :
          'bg-slate-100'
        }`}>
          <Zap className={`w-5 h-5 ${
            workflow.status === 'active' ? 'text-emerald-600' :
            workflow.status === 'paused' ? 'text-amber-600' :
            'text-slate-600'
          }`} />
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
          workflow.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
          workflow.status === 'paused' ? 'bg-amber-100 text-amber-700' :
          'bg-slate-100 text-slate-600'
        }`}>
          <div className={`w-1 h-1 rounded-full ${
            workflow.status === 'active' ? 'bg-emerald-500' :
            workflow.status === 'paused' ? 'bg-amber-500' :
            'bg-slate-400'
          }`} />
          {workflow.status}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="font-semibold text-slate-900 mb-2 text-sm">{workflow.name}</h3>
      <p className="text-xs text-slate-500 mb-4 line-clamp-2">
        {workflow.description || 'Extracts data from invoices and updates accounting systems automatically'}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-xs text-slate-500">Runs</p>
          <p className="text-base font-bold text-slate-900">{workflow.run_count || 567}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Success</p>
          <p className="text-base font-bold text-emerald-600">
            {typeof workflow.successRate === 'number' ? `${Math.round(workflow.successRate * 100)}%` : '97.8%'}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Avg Time</p>
          <p className="text-base font-bold text-slate-900">
            {typeof workflow.avgDurationMs === 'number' ? `${Math.round(workflow.avgDurationMs / 1000)}s` : '28s'}
          </p>
        </div>
      </div>

      {/* Trend */}
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={40}>
          <LineChart data={trendData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-emerald-600 font-medium mt-1">↗ +45% 7-day trend</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs"
          onClick={() => onRun(workflow.id, workflow.name)}
        >
          <Play className="w-3 h-3 mr-1" />
          Run Now
        </Button>
        <Button variant="ghost" size="sm" className="px-2">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}