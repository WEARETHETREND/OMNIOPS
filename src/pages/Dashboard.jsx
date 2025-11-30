import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, 
  Zap, 
  DollarSign, 
  Users, 
  ArrowRight,
  Workflow as WorkflowIcon,
  Plug,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import StatCard from '@/components/dashboard/StatCard';
import AlertBanner from '@/components/dashboard/AlertBanner';
import WorkflowCard from '@/components/dashboard/WorkflowCard';
import IntegrationCard from '@/components/dashboard/IntegrationCard';
import AreaChartCard from '@/components/charts/AreaChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';

export default function Dashboard() {
  const { data: workflows = [], isLoading: loadingWorkflows } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => base44.entities.Workflow.list('-created_date', 4)
  });

  const { data: alerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.filter({ status: 'new' }, '-created_date', 3)
  });

  const { data: integrations = [], isLoading: loadingIntegrations } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => base44.entities.Integration.list('-last_sync', 4)
  });

  const { data: metrics = [], isLoading: loadingMetrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => base44.entities.Metric.list()
  });

  // Generate mock chart data
  const activityData = [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
    { name: 'Sat', value: 3800 },
    { name: 'Sun', value: 4300 }
  ];

  const departmentData = [
    { name: 'HR', value: 15 },
    { name: 'Finance', value: 25 },
    { name: 'IT', value: 30 },
    { name: 'Sales', value: 20 },
    { name: 'Marketing', value: 10 }
  ];

  // Calculate stats
  const activeWorkflows = workflows.filter(w => w.status === 'active').length;
  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;

  const handleDismissAlert = async (alertId) => {
    await base44.entities.Alert.update(alertId, { status: 'dismissed' });
  };

  const handleToggleWorkflow = async (workflow) => {
    const newStatus = workflow.status === 'active' ? 'paused' : 'active';
    await base44.entities.Workflow.update(workflow.id, { status: newStatus });
  };

  return (
    <div className="space-y-8">
      {/* Critical Alerts Banner */}
      {criticalAlerts > 0 && alerts.filter(a => a.severity === 'critical').slice(0, 1).map(alert => (
        <AlertBanner key={alert.id} alert={alert} onDismiss={handleDismissAlert} />
      ))}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Workflows"
          value={loadingWorkflows ? '...' : activeWorkflows}
          change={12}
          trend="up"
          icon={WorkflowIcon}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Connected Integrations"
          value={loadingIntegrations ? '...' : connectedIntegrations}
          change={5}
          trend="up"
          icon={Plug}
          gradient="from-blue-500 to-cyan-600"
        />
        <StatCard
          title="Operations Today"
          value="12,847"
          change={8}
          trend="up"
          icon={Activity}
          gradient="from-violet-500 to-purple-600"
        />
        <StatCard
          title="Cost Savings"
          value="$45.2K"
          unit="/mo"
          change={23}
          trend="up"
          icon={DollarSign}
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AreaChartCard
            title="Operations Activity"
            subtitle="Total automated operations this week"
            data={activityData}
            color="#10b981"
          />
        </div>
        <DonutChartCard
          title="By Department"
          subtitle="Workflow distribution"
          data={departmentData}
        />
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Alerts</h2>
              <p className="text-sm text-slate-500">Requiring your attention</p>
            </div>
            <Link to={createPageUrl('Alerts')}>
              <Button variant="ghost" className="text-slate-600">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loadingAlerts ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))
            ) : (
              alerts.slice(0, 3).map(alert => (
                <AlertBanner key={alert.id} alert={alert} onDismiss={handleDismissAlert} />
              ))
            )}
          </div>
        </div>
      )}

      {/* Workflows Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Active Workflows</h2>
            <p className="text-sm text-slate-500">Your automated processes</p>
          </div>
          <Link to={createPageUrl('Workflows')}>
            <Button variant="ghost" className="text-slate-600">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {loadingWorkflows ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))
          ) : workflows.length > 0 ? (
            workflows.map(workflow => (
              <WorkflowCard 
                key={workflow.id} 
                workflow={workflow} 
                onToggle={handleToggleWorkflow}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200/60">
              <WorkflowIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No workflows yet</p>
              <Link to={createPageUrl('Workflows')}>
                <Button className="mt-4 bg-slate-900 hover:bg-slate-800">
                  Create your first workflow
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Integrations Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Integrations</h2>
            <p className="text-sm text-slate-500">Connected services</p>
          </div>
          <Link to={createPageUrl('Integrations')}>
            <Button variant="ghost" className="text-slate-600">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {loadingIntegrations ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))
          ) : integrations.length > 0 ? (
            integrations.map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200/60">
              <Plug className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No integrations connected</p>
              <Link to={createPageUrl('Integrations')}>
                <Button className="mt-4 bg-slate-900 hover:bg-slate-800">
                  Connect your first integration
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}