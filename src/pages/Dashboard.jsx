import { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  DollarSign, 
  Briefcase, 
  Users, 
  Receipt,
  Bell,
  Settings,
  Moon,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Mock data for Command Center
const mockData = {
  revenue: { today: 0, change: 0, trending: 'up' },
  activeJobs: { count: 0, change: 0, trending: 'up' },
  newLeads: { today: 0, week: 0, trending: 'neutral' },
  outstanding: { amount: 0, invoices: 0, trending: 'neutral' },
  leadsBySource: [
    { name: 'Website', value: 0, color: '#06B6D4' },
    { name: 'Referral', value: 0, color: '#8B5CF6' },
    { name: 'Social Media', value: 0, color: '#F59E0B' },
    { name: 'Other', value: 0, color: '#64748B' }
  ],
  jobsByStatus: [
    { name: 'Scheduled', value: 0, color: '#06B6D4' },
    { name: 'In Progress', value: 0, color: '#8B5CF6' },
    { name: 'Completed', value: 0, color: '#10B981' },
    { name: 'Cancelled', value: 0, color: '#EF4444' }
  ],
  invoiceAging: [
    { name: 'Current', value: 0, color: '#10B981' },
    { name: '1-30 days', value: 0, color: '#F59E0B' },
    { name: '31-60 days', value: 0, color: '#F97316' },
    { name: '60+ days', value: 0, color: '#EF4444' }
  ]
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(mockData);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    
    try {
      // Try to fetch data from APIs
      const [revenueRes, jobsRes, leadsRes, invoicesRes] = await Promise.all([
        safeGet('/api/revenue'),
        safeGet('/api/jobs'),
        safeGet('/api/leads'),
        safeGet('/api/invoices')
      ]);

      // Use backend data if available, otherwise use mock data
      const newData = { ...mockData };
      
      if (revenueRes.ok && revenueRes.data) {
        newData.revenue = revenueRes.data;
      }
      if (jobsRes.ok && jobsRes.data) {
        newData.activeJobs = jobsRes.data.activeJobs || mockData.activeJobs;
        newData.jobsByStatus = jobsRes.data.byStatus || mockData.jobsByStatus;
      }
      if (leadsRes.ok && leadsRes.data) {
        newData.newLeads = leadsRes.data.newLeads || mockData.newLeads;
        newData.leadsBySource = leadsRes.data.bySource || mockData.leadsBySource;
      }
      if (invoicesRes.ok && invoicesRes.data) {
        newData.outstanding = invoicesRes.data.outstanding || mockData.outstanding;
        newData.invoiceAging = invoicesRes.data.aging || mockData.invoiceAging;
      }

      setData(newData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setData(mockData);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-80" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
            <p className="text-slate-600 mt-1">Welcome back. Here's what's happening today.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Selector */}
            <Button variant="outline" className="bg-white">
              Jan 8 - Feb 7, 2026
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            
            {/* Action Icons */}
            <Button variant="ghost" size="icon" className="bg-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-white">
              <Moon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-white">
              <Settings className="w-5 h-5" />
            </Button>
            
            {/* Quick Actions Button */}
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={() => setShowQuickActions(!showQuickActions)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Quick Actions
            </Button>

            {/* Refresh Button */}
            <Button variant="outline" size="icon" onClick={loadDashboard}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Today's Revenue"
            value={`$${data.revenue.today.toLocaleString()}`}
            change={data.revenue.change}
            trending={data.revenue.trending}
            icon={DollarSign}
            iconColor="bg-cyan-500"
          />
          <MetricCard
            title="Active Jobs"
            value={data.activeJobs.count.toString()}
            change={data.activeJobs.change}
            trending={data.activeJobs.trending}
            icon={Briefcase}
            iconColor="bg-purple-500"
          />
          <MetricCard
            title="New Leads Today"
            value={data.newLeads.today.toString()}
            subtitle={`${data.newLeads.week} this week`}
            icon={Users}
            iconColor="bg-orange-500"
          />
          <MetricCard
            title="Outstanding"
            value={`$${data.outstanding.amount.toLocaleString()}`}
            subtitle={`${data.outstanding.invoices} invoices`}
            icon={DollarSign}
            iconColor="bg-blue-500"
          />
        </div>

        {/* Bottom Section - Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Leads by Source */}
          <ChartCard
            title="Leads by Source"
            icon={Users}
            iconColor="text-orange-500"
          >
            <PieChartComponent data={data.leadsBySource} />
          </ChartCard>

          {/* Jobs by Status */}
          <ChartCard
            title="Jobs by Status"
            icon={Briefcase}
            iconColor="text-purple-500"
          >
            <PieChartComponent data={data.jobsByStatus} />
          </ChartCard>

          {/* Invoice Aging */}
          <ChartCard
            title="Invoice Aging"
            icon={Receipt}
            iconColor="text-blue-500"
            subtitle={`Total: $${data.invoiceAging.reduce((sum, item) => sum + item.value, 0).toLocaleString()}`}
          >
            <PieChartComponent data={data.invoiceAging} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, change, trending, icon: Icon, iconColor }) {
  return (
    <Card className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trending === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : trending === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
              <span>{change >= 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${iconColor} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}

function ChartCard({ title, icon: Icon, iconColor, subtitle, children }) {
  return (
    <Card className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      {subtitle && (
        <p className="text-sm text-slate-600 mb-4">{subtitle}</p>
      )}
      <div className="h-64">
        {children}
      </div>
    </Card>
  );
}

function PieChartComponent({ data }) {
  const hasData = data.some(item => item.value > 0);
  
  if (!hasData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-400 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}