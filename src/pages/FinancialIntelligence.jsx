import React, { useState } from 'react';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 42000, expenses: 28000, profit: 14000 },
  { month: 'Feb', revenue: 48000, expenses: 31000, profit: 17000 },
  { month: 'Mar', revenue: 51000, expenses: 33000, profit: 18000 },
  { month: 'Apr', revenue: 55000, expenses: 35000, profit: 20000 },
  { month: 'May', revenue: 62000, expenses: 38000, profit: 24000 },
  { month: 'Jun', revenue: 58000, expenses: 36000, profit: 22000 },
];

const cashFlowForecast = [
  { week: 'Week 1', inflow: 28000, outflow: 22000 },
  { week: 'Week 2', inflow: 32000, outflow: 25000 },
  { week: 'Week 3', inflow: 35000, outflow: 28000 },
  { week: 'Week 4', inflow: 30000, outflow: 24000 },
];

const expenseBreakdown = [
  { name: 'Labor', value: 45, color: '#8b5cf6' },
  { name: 'Materials', value: 25, color: '#06b6d4' },
  { name: 'Equipment', value: 15, color: '#f59e0b' },
  { name: 'Overhead', value: 15, color: '#64748b' },
];

const jobCostingData = [
  { job: 'Smith Renovation', budget: 15000, actual: 13200, margin: 32, status: 'healthy' },
  { job: 'Johnson HVAC', budget: 8500, actual: 9100, margin: -7, status: 'over' },
  { job: 'Williams Plumbing', budget: 4200, actual: 3800, margin: 22, status: 'healthy' },
  { job: 'Davis Electrical', budget: 6800, actual: 6500, margin: 18, status: 'healthy' },
];

export default function FinancialIntelligence() {
  const [syncStatus, setSyncStatus] = useState('synced');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-emerald-600" />
            Financial Intelligence
          </h1>
          <p className="text-slate-500">Real-time financial insights and forecasting</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={syncStatus === 'synced' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
            <CheckCircle className="w-3 h-3 mr-1" />
            QuickBooks Synced
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            Sync Now
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue MTD', value: '$58,420', change: 12, trend: 'up', icon: TrendingUp, color: 'emerald' },
          { label: 'Net Profit', value: '$22,150', change: 8, trend: 'up', icon: DollarSign, color: 'blue' },
          { label: 'Avg Job Margin', value: '34.2%', change: -2, trend: 'down', icon: PieChart, color: 'violet' },
          { label: 'Cash Balance', value: '$145,800', change: 5, trend: 'up', icon: BarChart3, color: 'amber' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", `bg-${kpi.color}-100`)}>
                <kpi.icon className={cn("w-5 h-5", `text-${kpi.color}-600`)} />
              </div>
              <div className={cn("flex items-center gap-1 text-sm", kpi.trend === 'up' ? 'text-emerald-600' : 'text-rose-600')}>
                {kpi.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(kpi.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-sm text-slate-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900">Margin Alert</h3>
            <p className="text-sm text-amber-700">Johnson HVAC job is 7% over budget. Review labor costs and material usage.</p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto border-amber-300 text-amber-700 hover:bg-amber-100">
            View Job
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="jobcosting">Job Costing</TabsTrigger>
          <TabsTrigger value="forecast">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Revenue vs Expenses</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, '']} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="url(#expenseGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Expense Breakdown</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, '']} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {expenseBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-medium text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6 mt-0">
          <div className="bg-white rounded-xl border border-slate-200/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">30-Day Cash Flow Forecast</h3>
              <Badge className="bg-emerald-100 text-emerald-700">
                <Zap className="w-3 h-3 mr-1" />
                AI Predicted
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, '']} />
                  <Legend />
                  <Bar dataKey="inflow" fill="#10b981" radius={[4, 4, 0, 0]} name="Inflow" />
                  <Bar dataKey="outflow" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Outflow" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="jobcosting" className="space-y-6 mt-0">
          <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Active Job Margins</h3>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Job</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actual</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Margin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobCostingData.map((job, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{job.job}</td>
                    <td className="px-4 py-3 text-slate-600">${job.budget.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600">${job.actual.toLocaleString()}</td>
                    <td className={cn("px-4 py-3 font-medium", job.margin >= 0 ? "text-emerald-600" : "text-rose-600")}>
                      {job.margin >= 0 ? '+' : ''}{job.margin}%
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={job.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
                        {job.status === 'healthy' ? 'On Track' : 'Over Budget'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6" />
                <h3 className="font-semibold">Revenue Forecast</h3>
              </div>
              <p className="text-4xl font-bold mb-2">$185,000</p>
              <p className="text-emerald-100">Projected Q1 2025</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-100">Confidence Level</span>
                  <span className="font-medium">87%</span>
                </div>
                <Progress value={87} className="mt-2 bg-white/20" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">AI Insights</h3>
              <div className="space-y-3">
                {[
                  { text: 'Seasonal uptick expected in HVAC services (March)', type: 'opportunity' },
                  { text: 'Labor costs trending 5% above industry average', type: 'warning' },
                  { text: 'Material costs stabilizing after Q4 increases', type: 'info' },
                ].map((insight, i) => (
                  <div key={i} className={cn(
                    "p-3 rounded-lg text-sm",
                    insight.type === 'opportunity' && "bg-emerald-50 text-emerald-700",
                    insight.type === 'warning' && "bg-amber-50 text-amber-700",
                    insight.type === 'info' && "bg-blue-50 text-blue-700"
                  )}>
                    {insight.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}