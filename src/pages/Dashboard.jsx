import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { safeGet } from '@/components/api/apiClient';
import { 
  Activity, 
  Zap, 
  DollarSign, 
  Users, 
  ArrowRight,
  Workflow as WorkflowIcon,
  Plug,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import AreaChartCard from '@/components/charts/AreaChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';

export default function Dashboard() {
  const [health, setHealth] = useState(null);
  const [today, setToday] = useState(null);
  const [savings, setSavings] = useState(null);
  const [activity, setActivity] = useState(null);
  const [byDept, setByDept] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');

    const [h, t, s, a, d, w, al] = await Promise.all([
      safeGet('/health'),
      safeGet('/metrics/today'),
      safeGet('/metrics/savings'),
      safeGet('/metrics/activity', { range: '7d' }),
      safeGet('/metrics/by-department', { range: '7d' }),
      safeGet('/workflows', { status: 'active' }),
      safeGet('/alerts')
    ]);

    if (!h.ok) setError(`Health: ${h.error}`);
    else setHealth(h.data);

    if (t.ok) setToday(t.data);
    if (s.ok) setSavings(s.data);
    if (a.ok) setActivity(a.data);
    if (d.ok) setByDept(d.data);
    if (w.ok) setWorkflows(w.data.workflows || []);
    if (al.ok) setAlerts(al.data.alerts || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    await loadData();
    toast.success('Dashboard refreshed');
  };

  const activityChartData = activity?.points?.map(p => ({
    name: new Date(p.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: p.value
  })) || [];

  const deptChartData = byDept?.items?.map(item => ({
    name: item.department,
    value: item.value
  })) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" data-tour="dashboard">Welcome back!</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your operations today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
            <CheckCircle className="w-4 h-4" />
            {health?.status === 'ok' ? 'All systems operational' : 'Checking...'}
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Workflows"
          value={loading ? '...' : workflows.length}
          icon={WorkflowIcon}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Alerts"
          value={loading ? '...' : alerts.length}
          icon={AlertTriangle}
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          title="Operations Today"
          value={loading ? '...' : (today?.operationsToday || 0).toLocaleString()}
          icon={Activity}
          gradient="from-violet-500 to-purple-600"
        />
        <StatCard
          title="Cost Savings"
          value={loading ? '...' : `$${((savings?.monthlySavingsUsd || 0) / 1000).toFixed(1)}K`}
          unit="/mo"
          icon={DollarSign}
          gradient="from-blue-500 to-cyan-600"
        />
      </div>

      {/* Charts Row */}
      {!loading && activityChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AreaChartCard
              title="Operations Activity"
              subtitle="Total automated operations this week"
              data={activityChartData}
              color="#10b981"
            />
          </div>
          {deptChartData.length > 0 && (
            <DonutChartCard
              title="By Department"
              subtitle="Workflow distribution"
              data={deptChartData}
            />
          )}
        </div>
      )}

      {/* Active Workflows */}
      {workflows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Active Workflows</h2>
              <p className="text-sm text-slate-500">{workflows.length} running</p>
            </div>
            <Link to={createPageUrl('Workflows')}>
              <Button variant="ghost" className="text-slate-600">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflows.slice(0, 4).map(wf => (
              <Link key={wf.id} to={createPageUrl(`WorkflowDetails?id=${wf.id}`)}>
                <div className="bg-white rounded-xl border border-slate-200/60 p-4 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{wf.name}</h3>
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{wf.status}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    {wf.successRate && (
                      <span>{Math.round(wf.successRate * 100)}% success</span>
                    )}
                    {wf.avgDurationMs && (
                      <span>{Math.round(wf.avgDurationMs / 1000)}s avg</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Alerts</h2>
              <p className="text-sm text-slate-500">{alerts.length} active</p>
            </div>
            <Link to={createPageUrl('Alerts')}>
              <Button variant="ghost" className="text-slate-600">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 3).map(alert => (
              <div key={alert.id} className="bg-white rounded-lg border border-slate-200/60 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                    alert.severity === 'high' ? 'text-rose-500' : 
                    alert.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{alert.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{alert.service}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, unit, icon: Icon, gradient }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-2">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {unit && <span className="text-sm text-slate-400">{unit}</span>}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}