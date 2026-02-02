import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Revenue() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [metrics, setMetrics] = useState({
    mrr: 0,
    arr: 0,
    activeCustomers: 0,
    churnRate: 0,
    avgRevenuePerCustomer: 0,
    growth: 0
  });

  useEffect(() => {
    loadRevenue();
  }, []);

  const loadRevenue = async () => {
    setLoading(true);
    try {
      const [subs, custs] = await Promise.all([
        base44.entities.Subscription.filter({ status: 'active' }),
        base44.entities.Customer.list()
      ]);

      setSubscriptions(subs);
      setCustomers(custs);

      // Calculate metrics
      const mrr = subs.reduce((sum, sub) => sum + (sub.price_monthly || 0), 0);
      const arr = mrr * 12;
      const activeCustomers = custs.filter(c => c.success_score > 50).length;

      setMetrics({
        mrr,
        arr,
        activeCustomers,
        churnRate: 2.5, // TODO: Calculate from data
        avgRevenuePerCustomer: subs.length > 0 ? mrr / subs.length : 0,
        growth: 23.5 // TODO: Calculate month-over-month
      });
    } catch (error) {
      console.error('Failed to load revenue:', error);
    }
    setLoading(false);
  };

  const planDistribution = [
    { name: 'Free', value: subscriptions.filter(s => s.plan === 'free').length, color: '#64748b' },
    { name: 'Starter', value: subscriptions.filter(s => s.plan === 'starter').length, color: '#10b981' },
    { name: 'Professional', value: subscriptions.filter(s => s.plan === 'professional').length, color: '#3b82f6' },
    { name: 'Enterprise', value: subscriptions.filter(s => s.plan === 'enterprise').length, color: '#8b5cf6' }
  ];

  const revenueByMonth = [
    { month: 'Jan', revenue: 4200, customers: 15 },
    { month: 'Feb', revenue: 5100, customers: 18 },
    { month: 'Mar', revenue: 6300, customers: 22 },
    { month: 'Apr', revenue: 7800, customers: 26 },
    { month: 'May', revenue: 9200, customers: 31 },
    { month: 'Jun', revenue: metrics.mrr, customers: subscriptions.length }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revenue Dashboard</h1>
          <p className="text-slate-500 mt-1">Track your growth and customer metrics</p>
        </div>
        <Button onClick={loadRevenue} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Recurring Revenue"
          value={`$${metrics.mrr.toLocaleString()}`}
          change={metrics.growth}
          icon={DollarSign}
          gradient="from-emerald-500 to-teal-600"
        />
        <MetricCard
          title="Annual Run Rate"
          value={`$${metrics.arr.toLocaleString()}`}
          icon={Target}
          gradient="from-blue-500 to-cyan-600"
        />
        <MetricCard
          title="Active Customers"
          value={metrics.activeCustomers.toString()}
          change={15.2}
          icon={Users}
          gradient="from-violet-500 to-purple-600"
        />
        <MetricCard
          title="Churn Rate"
          value={`${metrics.churnRate}%`}
          change={-1.2}
          isNegativeGood
          icon={TrendingUp}
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Revenue Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueByMonth}>
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Plan Distribution & Top Customers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {customers.slice(0, 5).map((customer, i) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{customer.company_name}</p>
                  <p className="text-sm text-slate-500">{customer.industry}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    ${(customer.lifetime_value || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">LTV</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Active Subscriptions ({subscriptions.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200">
              <tr className="text-left">
                <th className="pb-3 text-sm font-semibold text-slate-600">Plan</th>
                <th className="pb-3 text-sm font-semibold text-slate-600">Status</th>
                <th className="pb-3 text-sm font-semibold text-slate-600">MRR</th>
                <th className="pb-3 text-sm font-semibold text-slate-600">Next Billing</th>
                <th className="pb-3 text-sm font-semibold text-slate-600">Usage</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.slice(0, 10).map((sub) => (
                <tr key={sub.id} className="border-b border-slate-100">
                  <td className="py-3">
                    <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded capitalize">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${
                      sub.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      sub.status === 'trialing' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-slate-900">
                    ${sub.price_monthly || 0}
                  </td>
                  <td className="py-3 text-sm text-slate-600">
                    {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 text-sm text-slate-600">
                    {sub.usage_this_month?.runs_executed || 0} / {sub.runs_limit_monthly === -1 ? '∞' : sub.runs_limit_monthly}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon, gradient, isNegativeGood }) {
  const isPositive = isNegativeGood ? change < 0 : change > 0;
  
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          )}
          <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
            {Math.abs(change)}%
          </span>
          <span className="text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
}