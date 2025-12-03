import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ExportButton from '@/components/ui/ExportButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AreaChartCard from '@/components/charts/AreaChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const periods = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

export default function Analytics() {
  const [period, setPeriod] = useState('monthly');

  const { data: metrics = [], isLoading, refetch } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => base44.entities.Metric.list()
  });

  // Mock data for charts
  const efficiencyData = [
    { month: 'Jan', automation: 65, manual: 35 },
    { month: 'Feb', automation: 68, manual: 32 },
    { month: 'Mar', automation: 72, manual: 28 },
    { month: 'Apr', automation: 75, manual: 25 },
    { month: 'May', automation: 80, manual: 20 },
    { month: 'Jun', automation: 82, manual: 18 }
  ];

  const costSavingsData = [
    { month: 'Jan', savings: 12000 },
    { month: 'Feb', savings: 15000 },
    { month: 'Mar', savings: 18000 },
    { month: 'Apr', savings: 22000 },
    { month: 'May', savings: 28000 },
    { month: 'Jun', savings: 35000 }
  ];

  const departmentPerformance = [
    { name: 'HR', score: 92 },
    { name: 'Finance', score: 88 },
    { name: 'IT', score: 95 },
    { name: 'Sales', score: 85 },
    { name: 'Marketing', score: 78 },
    { name: 'Operations', score: 90 }
  ];

  const categoryDistribution = [
    { name: 'Efficiency', value: 35 },
    { name: 'Cost', value: 25 },
    { name: 'Performance', value: 20 },
    { name: 'Quality', value: 12 },
    { name: 'Compliance', value: 8 }
  ];

  const trendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-rose-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const keyMetrics = [
    { name: 'Automation Rate', value: '82%', change: '+5%', trend: 'up', color: 'from-emerald-500 to-teal-600' },
    { name: 'Cost Reduction', value: '$45.2K', change: '+23%', trend: 'up', color: 'from-blue-500 to-cyan-600' },
    { name: 'Process Efficiency', value: '94%', change: '+2%', trend: 'up', color: 'from-violet-500 to-purple-600' },
    { name: 'Error Rate', value: '0.3%', change: '-0.2%', trend: 'down', color: 'from-amber-500 to-orange-600' },
    { name: 'Avg Response Time', value: '1.2s', change: '-15%', trend: 'down', color: 'from-pink-500 to-rose-600' },
    { name: 'Uptime', value: '99.9%', change: '0%', trend: 'stable', color: 'from-slate-500 to-slate-700' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <p className="text-slate-500">Track your operational performance and efficiency metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => { refetch(); toast.success('Data refreshed'); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <ExportButton 
            data={metrics} 
            filename="analytics-metrics"
            columns={[
              { key: 'name', label: 'Metric' },
              { key: 'category', label: 'Category' },
              { key: 'value', label: 'Value' },
              { key: 'target', label: 'Target' },
              { key: 'trend', label: 'Trend' }
            ]}
          />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {keyMetrics.map((metric, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-slate-500 mb-2">{metric.name}</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                metric.trend === 'up' ? 'text-emerald-500' : metric.trend === 'down' ? 'text-rose-500' : 'text-slate-400'
              )}>
                {trendIcon(metric.trend)}
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Efficiency Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <h3 className="font-semibold text-slate-900 mb-1">Automation vs Manual Tasks</h3>
          <p className="text-sm text-slate-500 mb-6">Percentage distribution over time</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="automation" fill="#10b981" radius={[4, 4, 0, 0]} name="Automated" />
                <Bar dataKey="manual" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Manual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Savings */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <h3 className="font-semibold text-slate-900 mb-1">Cost Savings Trend</h3>
          <p className="text-sm text-slate-500 mb-6">Monthly savings from automation</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costSavingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `$${v/1000}K`} />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Savings']}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6">
          <h3 className="font-semibold text-slate-900 mb-1">Department Performance</h3>
          <p className="text-sm text-slate-500 mb-6">Efficiency scores by department</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} width={80} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <DonutChartCard
          title="Metrics by Category"
          subtitle="Distribution of tracked metrics"
          data={categoryDistribution}
        />
      </div>

      {/* Metrics Table */}
      {metrics.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">All Metrics</h3>
            <p className="text-sm text-slate-500">Detailed breakdown of all tracked metrics</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Metric</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Current</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.map(metric => (
                  <tr key={metric.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{metric.name}</p>
                      <p className="text-sm text-slate-500 capitalize">{metric.department?.replace('_', ' ')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                        {metric.category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {metric.value}{metric.unit}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {metric.target}{metric.unit}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {trendIcon(metric.trend)}
                        <span className={cn(
                          "text-sm font-medium",
                          metric.trend === 'up' ? 'text-emerald-500' : metric.trend === 'down' ? 'text-rose-500' : 'text-slate-400'
                        )}>
                          {metric.trend === 'up' ? 'Improving' : metric.trend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}