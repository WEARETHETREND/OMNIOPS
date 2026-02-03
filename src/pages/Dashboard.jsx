import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { safeGet } from '@/components/api/apiClient';
import { mockFinancial, mockWorkflows, mockAlerts, mockInsights } from '@/components/api/mockData';
import { 
  Activity, 
  Zap, 
  DollarSign, 
  Users, 
  ArrowRight,
  Workflow as WorkflowIcon,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [financial, setFinancial] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    
    try {
      const [finRes, wfRes, alertRes, insightRes] = await Promise.all([
        safeGet('/api/money/now'),
        safeGet('/api/workflows'),
        safeGet('/api/alerts'),
        safeGet('/api/insights')
      ]);

      // Use backend data if available, otherwise fallback to mock data
      setFinancial(finRes.ok ? finRes.data : mockFinancial);
      setWorkflows((wfRes.ok ? (wfRes.data.workflows || wfRes.data || []) : mockWorkflows).slice(0, 4));
      setAlerts((alertRes.ok ? (alertRes.data.alerts || alertRes.data || []) : mockAlerts).slice(0, 3));
      setInsights(insightRes.ok ? insightRes.data : mockInsights);
    } catch (error) {
      // Fallback to mock data if API fails
      setFinancial(mockFinancial);
      setWorkflows(mockWorkflows.slice(0, 4));
      setAlerts(mockAlerts.slice(0, 3));
      setInsights(mockInsights);
    }

    setLoading(false);
  };
  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your operations today.</p>
        </div>
        <Button onClick={loadDashboard} variant="outline" size="sm">
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Financial Stats */}
      {financial && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Current Burn Rate</p>
              <p className="text-3xl font-bold">${financial.current_burn_rate?.toFixed(2)}<span className="text-lg text-slate-400">/hr</span></p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">24h Projection</p>
              <p className="text-3xl font-bold">${financial.projected_daily_burn?.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Today's Net P&L</p>
              <p className={`text-3xl font-bold ${financial.today?.net >= 0 ? 'text-[#7cb342]' : 'text-rose-400'}`}>
                ${Math.abs(financial.today?.net || 0).toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Active Issues</p>
              <p className="text-3xl font-bold">{financial.active_issues || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Workflows"
          value={workflows.length.toString()}
          icon={WorkflowIcon}
          gradient="from-[#7cb342] to-[#689f38]"
        />
        <StatCard
          title="Alerts"
          value={alerts.length.toString()}
          icon={AlertTriangle}
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          title="Success Rate"
          value={insights?.success_rate ? `${insights.success_rate.toFixed(1)}%` : 'N/A'}
          icon={CheckCircle}
          gradient="from-[#2196f3] to-[#1976d2]"
        />
        <StatCard
          title="Total Runs"
          value={insights?.total_runs?.toString() || '0'}
          icon={Activity}
          gradient="from-[#7cb342] to-[#2196f3]"
        />
      </div>

      {/* Activity Chart */}
      {insights?.trending && (
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Operations Activity</h3>
            <p className="text-sm text-slate-500">Workflow executions over time</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={insights.trending}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7cb342" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7cb342" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#7cb342" 
                strokeWidth={2}
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Active Workflows */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Active Workflows</h2>
            <p className="text-sm text-slate-500">{workflows.length} workflows</p>
          </div>
          <Link to={createPageUrl('Workflows')}>
            <Button variant="ghost" className="text-slate-600">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        {workflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflows.map(wf => (
              <div key={wf.workflow_id} className="bg-white rounded-xl border border-slate-200/60 p-4 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 line-clamp-2">{wf.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${wf.enabled ? 'bg-[#7cb342]' : 'bg-slate-300'}`}></div>
                </div>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{wf.description || 'No description'}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="capitalize">{wf.workflow_type || 'workflow'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/60 p-12 text-center">
            <WorkflowIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No workflows configured yet</p>
          </div>
        )}
      </div>

      {/* Recent Alerts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Alerts</h2>
            <p className="text-sm text-slate-500">{alerts.length} alerts</p>
          </div>
          <Link to={createPageUrl('Alerts')}>
            <Button variant="ghost" className="text-slate-600">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.alert_id} className="bg-white rounded-lg border border-slate-200/60 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                    alert.level === 'critical' ? 'text-rose-500' : 
                    alert.level === 'warning' ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{alert.message}</h4>
                    <p className="text-sm text-slate-500 mt-1">Run: {alert.run_id || 'N/A'}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {alert.created_at ? new Date(alert.created_at).toLocaleTimeString() : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/60 p-12 text-center">
            <CheckCircle className="w-12 h-12 text-[#7cb342]/30 mx-auto mb-3" />
            <p className="text-slate-500">No active alerts</p>
          </div>
        )}
      </div>
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