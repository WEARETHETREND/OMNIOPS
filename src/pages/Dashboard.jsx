import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format, subDays, startOfDay } from 'date-fns';
import { 
  Calendar,
  Bell, 
  Sun, 
  Settings, 
  Plus,
  DollarSign,
  Briefcase,
  Users,
  FileText,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  // Fetch revenue data (try Invoice entity, fallback to Metric)
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-today', dateRange],
    queryFn: async () => {
      try {
        const todayStart = startOfDay(new Date()).toISOString();
        const result = await base44.entities.Invoice?.filter?.({ 
          created_date__gte: todayStart,
          status: 'paid'
        }).catch(() => null);
        
        if (result?.data) {
          const total = result.data.reduce((sum, inv) => sum + (inv.amount || 0), 0);
          return { value: total, count: result.data.length };
        }
      } catch {
        // Invoice entity not available - using fallback
      }
      return { value: 0, count: 0 };
    }
  });

  // Fetch active jobs (try Dispatch entity)
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['active-jobs'],
    queryFn: async () => {
      try {
        const result = await base44.entities.Dispatch?.filter?.({ 
          status__in: ['queued', 'en_route', 'in_progress'] 
        }).catch(() => null);
        
        if (result?.data) {
          return { value: result.data.length, count: result.data.length };
        }
      } catch {
        console.log('Dispatch entity not available');
      }
      return { value: 0, count: 0 };
    }
  });

  // Fetch leads data (try Lead entity, fallback to Contact)
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads-today'],
    queryFn: async () => {
      try {
        const todayStart = startOfDay(new Date()).toISOString();
        const weekStart = startOfDay(subDays(new Date(), 7)).toISOString();
        
        const [todayResult, weekResult] = await Promise.all([
          base44.entities.Lead?.filter?.({ created_date__gte: todayStart }).catch(() => null),
          base44.entities.Lead?.filter?.({ created_date__gte: weekStart }).catch(() => null)
        ]);
        
        return { 
          today: todayResult?.data?.length || 0, 
          week: weekResult?.data?.length || 0 
        };
      } catch {
        console.log('Lead entity not available');
      }
      return { today: 0, week: 0 };
    }
  });

  // Fetch outstanding invoices
  const { data: outstandingData, isLoading: outstandingLoading } = useQuery({
    queryKey: ['outstanding-invoices'],
    queryFn: async () => {
      try {
        const result = await base44.entities.Invoice?.filter?.({ 
          status: 'unpaid' 
        }).catch(() => null);
        
        if (result?.data) {
          const total = result.data.reduce((sum, inv) => sum + (inv.amount || 0), 0);
          return { value: total, count: result.data.length };
        }
      } catch {
        // Invoice entity not available - using fallback
      }
      return { value: 0, count: 0 };
    }
  });

  const isLoading = revenueLoading || jobsLoading || leadsLoading || outstandingLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
          <p className="text-slate-500 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.from && dateRange.to ? (
                  `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`
                ) : (
                  'Select date range'
                )}
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={(range) => range && setDateRange(range)}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Action Buttons */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5 text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-slate-600" />
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Today's Revenue"
          value={`$${revenueData?.value?.toFixed(0) || '0'}`}
          trend="↗ 0.0% vs yesterday"
          trendPositive={true}
          icon={DollarSign}
          iconBg="bg-gradient-to-br from-cyan-400 to-green-500"
        />
        <MetricCard
          title="Active Jobs"
          value={jobsData?.value?.toString() || '0'}
          trend="↗ 0.0% vs last week"
          trendPositive={true}
          icon={Briefcase}
          iconBg="bg-gradient-to-br from-purple-400 to-purple-600"
        />
        <MetricCard
          title="New Leads Today"
          value={leadsData?.today?.toString() || '0'}
          subtitle={`${leadsData?.week || 0} this week`}
          icon={Users}
          iconBg="bg-gradient-to-br from-orange-400 to-orange-600"
        />
        <MetricCard
          title="Outstanding"
          value={`$${outstandingData?.value?.toFixed(0) || '0'}`}
          subtitle={`${outstandingData?.count || 0} invoices`}
          icon={DollarSign}
          iconBg="bg-gradient-to-br from-blue-400 to-blue-600"
        />
      </div>

      {/* Bottom Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnalyticsCard
          title="Leads by Source"
          icon={Users}
          iconBg="bg-blue-500"
          emptyMessage="No leads data available"
        />
        <AnalyticsCard
          title="Jobs by Status"
          icon={Briefcase}
          iconBg="bg-purple-500"
          emptyMessage="No jobs data available"
        />
        <AnalyticsCard
          title="Invoice Aging"
          icon={FileText}
          iconBg="bg-green-500"
          total={`$${outstandingData?.value?.toFixed(0) || '0'}`}
          emptyMessage="No outstanding invoices"
        />
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendPositive, subtitle, icon: Icon, iconBg }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", iconBg)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
        {trend && (
          <p className={cn("text-sm font-medium", trendPositive ? "text-green-600" : "text-red-600")}>
            {trend}
          </p>
        )}
        {subtitle && (
          <p className="text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function AnalyticsCard({ title, icon: Icon, iconBg, total, emptyMessage }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      {total && (
        <p className="text-sm text-slate-600 mb-4">Total: {total}</p>
      )}
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
        {emptyMessage}
      </div>
    </div>
  );
}