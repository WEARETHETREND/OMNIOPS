import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { safeGet } from '@/components/api/apiClient';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [trending, setTrending] = useState([]);
  const [workflowStats, setWorkflowStats] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [insightsRes, trendRes] = await Promise.all([
      safeGet('/api/insights'),
      safeGet('/api/money/trending', { days: 30 })
    ]);

    if (insightsRes.ok) setInsights(insightsRes.data);
    if (trendRes.ok) setTrending(trendRes.data.trends || []);
    
    setLoading(false);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500">Wednesday, December 4, 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>🏠</span>
        <span>/</span>
        <span className="text-slate-900">Analytics</span>
      </div>

      <p className="text-slate-600">Track your operational performance and efficiency metrics</p>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard title="Total Runs" value={insights?.total_runs?.toString() || '0'} />
          <KPICard title="Success Rate" value={`${insights?.success_rate?.toFixed(1) || 0}%`} positive />
          <KPICard title="Avg Duration" value={`${insights?.avg_duration?.toFixed(1) || 0}s`} />
          <KPICard title="Total Cost" value={`$${insights?.total_cost?.toFixed(2) || 0}`} />
          <KPICard title="Failed Runs" value={insights?.failed_runs?.toString() || '0'} />
          <KPICard title="Active Workflows" value={insights?.active_workflows?.toString() || '0'} positive />
        </div>
      )}

      {/* Charts Row */}
      {trending.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Run Activity */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-slate-900">Workflow Activity</h3>
              <p className="text-sm text-slate-500">Run count over time</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={insights?.trending || []}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Financial Trend */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-slate-900">Burn Rate Trend</h3>
              <p className="text-sm text-slate-500">Daily burn rate over time</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trending}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Line type="monotone" dataKey="burn_rate" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} name="Burn Rate" />
                <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Savings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Status Distribution */}
      {insights?.by_status && (
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">Status Distribution</h3>
            <p className="text-sm text-slate-500">Runs by status</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={Object.entries(insights.by_status).map(([key, value]) => ({
                  name: key,
                  value: value,
                  color: key === 'success' ? '#10b981' : key === 'failed' ? '#ef4444' : '#3b82f6'
                }))}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {Object.entries(insights.by_status).map(([key], index) => (
                  <Cell key={`cell-${index}`} fill={key === 'success' ? '#10b981' : key === 'failed' ? '#ef4444' : '#3b82f6'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function KPICard({ title, value, change, positive, neutral }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200/60 p-4">
      <p className="text-xs text-slate-500 mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold text-slate-900">{value}</p>
        {change && (
          <span className={`text-xs font-medium ${
            neutral ? 'text-slate-500' : positive ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {!neutral && (positive ? '↗ ' : '↘ ')}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}