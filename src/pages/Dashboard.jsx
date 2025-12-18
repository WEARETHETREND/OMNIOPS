import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
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
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const activityData = [
  { name: 'Mon', value: 245 },
  { name: 'Tue', value: 312 },
  { name: 'Wed', value: 289 },
  { name: 'Thu', value: 356 },
  { name: 'Fri', value: 423 },
  { name: 'Sat', value: 198 },
  { name: 'Sun', value: 167 },
];

const deptData = [
  { name: 'HR', value: 145, color: '#10b981' },
  { name: 'Finance', value: 223, color: '#3b82f6' },
  { name: 'IT', value: 189, color: '#8b5cf6' },
  { name: 'Operations', value: 267, color: '#f59e0b' },
  { name: 'Sales', value: 198, color: '#ec4899' },
];

const workflows = [
  { id: 1, name: 'Employee Onboarding', status: 'active', successRate: 98, avgDuration: 45 },
  { id: 2, name: 'Invoice Processing', status: 'active', successRate: 95, avgDuration: 23 },
  { id: 3, name: 'Inventory Alerts', status: 'active', successRate: 100, avgDuration: 12 },
  { id: 4, name: 'Customer Support', status: 'active', successRate: 92, avgDuration: 67 },
];

const alerts = [
  { id: 1, title: 'High API latency detected', service: 'Payment Gateway', severity: 'high', createdAt: new Date() },
  { id: 2, title: 'Low inventory warning', service: 'Warehouse System', severity: 'medium', createdAt: new Date() },
  { id: 3, title: 'Scheduled maintenance', service: 'Database', severity: 'low', createdAt: new Date() },
];

export default function Dashboard() {
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
            All systems operational
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Workflows"
          value="24"
          icon={WorkflowIcon}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Alerts"
          value="3"
          icon={AlertTriangle}
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          title="Operations Today"
          value="1,247"
          icon={Activity}
          gradient="from-violet-500 to-purple-600"
        />
        <StatCard
          title="Cost Savings"
          value="$42.5K"
          unit="/mo"
          icon={DollarSign}
          gradient="from-blue-500 to-cyan-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Operations Activity</h3>
            <p className="text-sm text-slate-500">Total automated operations this week</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">By Department</h3>
            <p className="text-sm text-slate-500">Workflow distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={deptData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {deptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {deptData.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                  <span className="text-slate-700">{dept.name}</span>
                </div>
                <span className="font-medium text-slate-900">{dept.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Workflows */}
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
          {workflows.map(wf => (
            <div key={wf.id} className="bg-white rounded-xl border border-slate-200/60 p-4 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900">{wf.name}</h3>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <p className="text-sm text-slate-500 mb-3">{wf.status}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>{wf.successRate}% success</span>
                <span>{wf.avgDuration}s avg</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
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
          {alerts.map(alert => (
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
                  {alert.createdAt.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
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