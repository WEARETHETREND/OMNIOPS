import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinancialDashboard() {
  const [moneyData, setMoneyData] = useState(null);
  const [trending, setTrending] = useState([]);
  const [topCosts, setTopCosts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    
    const [nowRes, trendRes, costsRes, alertsRes] = await Promise.all([
      safeGet('/api/money/now'),
      safeGet('/api/money/trending', { days: 7 }),
      safeGet('/api/money/top-costs', { limit: 10 }),
      safeGet('/api/money/alerts', { status: 'active' })
    ]);

    if (nowRes.ok) setMoneyData(nowRes.data);
    if (trendRes.ok) setTrending(trendRes.data.trends || []);
    if (costsRes.ok) setTopCosts(costsRes.data.costs || []);
    if (alertsRes.ok) setAlerts(alertsRes.data.alerts || []);
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Operations</h1>
          <p className="text-slate-500">Real-time dollar impact tracking</p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Burn Rate</p>
            <DollarSign className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {formatCurrency(moneyData?.current_burn_rate || 0)}/hr
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">24h Projection</p>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {formatCurrency(moneyData?.projected_daily_burn || 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Today's P&L</p>
            {(moneyData?.today?.net || 0) >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-rose-500" />
            )}
          </div>
          <p className={`text-3xl font-bold ${(moneyData?.today?.net || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(moneyData?.today?.net || 0)}
          </p>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-emerald-600">+{formatCurrency(moneyData?.today?.savings || 0)}</span>
            <span className="text-rose-600">-{formatCurrency(moneyData?.today?.losses || 0)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Active Issues</p>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {moneyData?.active_issues || 0}
          </p>
        </div>
      </div>

      {/* Trend Chart */}
      {trending.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Financial Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trending}>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Line type="monotone" dataKey="burn_rate" stroke="#ef4444" strokeWidth={2} name="Burn Rate" />
              <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} name="Savings" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Costs */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Money Drains (24h)</h3>
          <div className="space-y-3">
            {topCosts.length > 0 ? topCosts.map((cost, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{cost.workflow_type || cost.name}</p>
                  <p className="text-xs text-slate-500">{cost.count} failures</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-rose-600">{formatCurrency(cost.total_impact)}</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-4">No cost data available</p>
            )}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Money Alerts</h3>
          <div className="space-y-3">
            {alerts.length > 0 ? alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.severity === 'critical' ? 'bg-rose-50 border-rose-500' :
                alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                alert.severity === 'medium' ? 'bg-amber-50 border-amber-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{alert.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-4">No active alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}