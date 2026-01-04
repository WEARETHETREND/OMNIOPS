import React from 'react';
import { Calendar, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const automationData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 72 },
  { month: 'Mar', value: 78 },
  { month: 'Apr', value: 85 },
  { month: 'May', value: 95 },
  { month: 'Jun', value: 110 },
];

const savingsData = [
  { month: 'Jan', value: 28 },
  { month: 'Feb', value: 32 },
  { month: 'Mar', value: 36 },
  { month: 'Apr', value: 38 },
  { month: 'May', value: 42 },
  { month: 'Jun', value: 45 },
];

const metricsData = [
  { name: 'Efficiency', value: 40, color: '#10b981' },
  { name: 'Cost', value: 30, color: '#3b82f6' },
  { name: 'Quality', value: 30, color: '#8b5cf6' },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500">Wednesday, December 4, 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Monthly
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Automation Rate" value="82%" change="+5%" positive />
        <KPICard title="Cost Reduction" value="$45.2K" change="+23%" positive />
        <KPICard title="Project Efficiency" value="94%" change="+2%" positive />
        <KPICard title="Error Rate" value="0.3%" change="-0.2%" positive />
        <KPICard title="Avg Response Time" value="1.2s" change="-15%" positive />
        <KPICard title="Uptime" value="99.9%" change="0%" neutral />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automation vs Manual Tasks */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">Automation vs Manual Tasks</h3>
            <p className="text-sm text-slate-500">Percentage distribution over time</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={automationData}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
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
              <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Savings Trend */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">Cost Savings Trend</h3>
            <p className="text-sm text-slate-500">Monthly savings from automation</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={savingsData}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
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
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Performance + Metrics by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">Department Performance</h3>
            <p className="text-sm text-slate-500">Efficiency scores by department</p>
          </div>
          <div className="h-8 w-full bg-gradient-to-r from-purple-500 via-blue-500 via-emerald-500 via-cyan-500 to-orange-500 rounded-lg"></div>
        </div>

        {/* Metrics by Category */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">Metrics by Category</h3>
            <p className="text-sm text-slate-500">Distribution of tracked metrics</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={metricsData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {metricsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
      </div>
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