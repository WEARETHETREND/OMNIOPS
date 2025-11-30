import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Server,
  Database,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const statusColors = {
  healthy: { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle },
  warning: { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
  critical: { color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', icon: XCircle },
  offline: { color: 'text-slate-400', bg: 'bg-slate-100', border: 'border-slate-200', icon: XCircle }
};

export default function SystemHealth() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: integrations = [], refetch: refetchIntegrations } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => base44.entities.Integration.list()
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts-health'],
    queryFn: () => base44.entities.Alert.filter({ status: 'new' })
  });

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refetchIntegrations();
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, refetchIntegrations]);

  const handleRefresh = () => {
    refetchIntegrations();
    setLastRefresh(new Date());
  };

  // Mock system metrics
  const systemMetrics = {
    cpu: { value: 45, trend: 'stable' },
    memory: { value: 72, trend: 'up' },
    disk: { value: 58, trend: 'stable' },
    network: { value: 23, trend: 'down' }
  };

  // Mock performance history
  const performanceHistory = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    cpu: 30 + Math.random() * 40,
    memory: 60 + Math.random() * 25,
    requests: Math.floor(1000 + Math.random() * 5000)
  }));

  // Mock service status
  const services = [
    { name: 'API Gateway', status: 'healthy', uptime: '99.99%', latency: '12ms', region: 'US-East' },
    { name: 'Database Cluster', status: integrations.find(i => i.type === 'database')?.status === 'error' ? 'critical' : 'healthy', uptime: '99.95%', latency: '8ms', region: 'US-East' },
    { name: 'Cache Layer', status: 'healthy', uptime: '100%', latency: '2ms', region: 'Global' },
    { name: 'Message Queue', status: 'healthy', uptime: '99.98%', latency: '5ms', region: 'US-East' },
    { name: 'Storage Service', status: 'healthy', uptime: '99.99%', latency: '45ms', region: 'Multi-Region' },
    { name: 'Auth Service', status: 'healthy', uptime: '100%', latency: '15ms', region: 'Global' },
    { name: 'Analytics Engine', status: 'warning', uptime: '99.5%', latency: '150ms', region: 'EU-West' },
    { name: 'Notification Service', status: 'healthy', uptime: '99.97%', latency: '25ms', region: 'US-East' }
  ];

  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
  const errorIntegrations = integrations.filter(i => i.status === 'error').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;

  const overallHealth = errorIntegrations > 0 || criticalAlerts > 0 ? 'warning' : 'healthy';
  const healthConfig = statusColors[overallHealth];
  const HealthIcon = healthConfig.icon;

  const getMetricStatus = (value) => {
    if (value >= 90) return 'critical';
    if (value >= 75) return 'warning';
    return 'healthy';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center",
            healthConfig.bg
          )}>
            <HealthIcon className={cn("w-7 h-7", healthConfig.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">System Status</h2>
              <Badge className={cn("capitalize", healthConfig.bg, healthConfig.color)}>
                {overallHealth === 'healthy' ? 'All Systems Operational' : 'Issues Detected'}
              </Badge>
            </div>
            <p className="text-slate-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(autoRefresh && "border-emerald-500 text-emerald-600")}
          >
            <Clock className="w-4 h-4 mr-2" />
            Auto-refresh {autoRefresh ? 'On' : 'Off'}
          </Button>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Services Online', value: services.filter(s => s.status === 'healthy').length, total: services.length, icon: Server, color: 'emerald' },
          { label: 'Integrations', value: connectedIntegrations, total: integrations.length, icon: Wifi, color: 'blue' },
          { label: 'Active Alerts', value: alerts.length, total: null, icon: AlertTriangle, color: alerts.length > 0 ? 'amber' : 'slate' },
          { label: 'Uptime', value: '99.97', total: '%', icon: Activity, color: 'violet' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}{stat.total && typeof stat.total === 'string' ? stat.total : stat.total ? `/${stat.total}` : ''}
                  </p>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  `bg-${stat.color}-100`
                )}>
                  <stat.icon className={cn("w-6 h-6", `text-${stat.color}-500`)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { name: 'CPU Usage', icon: Cpu, ...systemMetrics.cpu },
              { name: 'Memory', icon: MemoryStick, ...systemMetrics.memory },
              { name: 'Disk Usage', icon: HardDrive, ...systemMetrics.disk },
              { name: 'Network I/O', icon: Wifi, ...systemMetrics.network }
            ].map((metric, i) => {
              const status = getMetricStatus(metric.value);
              const config = statusColors[status];
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <metric.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{metric.name}</span>
                    </div>
                    <span className={cn("text-sm font-semibold", config.color)}>
                      {metric.value}%
                    </span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className={cn(
                      "h-2",
                      status === 'critical' ? '[&>div]:bg-rose-500' :
                      status === 'warning' ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'
                    )}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Performance (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceHistory}>
                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#10b981" fill="url(#cpuGradient)" strokeWidth={2} name="CPU" />
                  <Area type="monotone" dataKey="memory" stroke="#3b82f6" fill="url(#memGradient)" strokeWidth={2} name="Memory" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="w-4 h-4" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, i) => {
              const config = statusColors[service.status];
              const StatusIcon = config.icon;
              return (
                <div 
                  key={i} 
                  className={cn(
                    "p-4 rounded-xl border transition-all hover:shadow-md",
                    config.border,
                    config.bg
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={cn("w-4 h-4", config.color)} />
                      <span className="font-medium text-slate-900">{service.name}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Uptime</span>
                      <span className="font-medium text-slate-700">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Latency</span>
                      <span className="font-medium text-slate-700">{service.latency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Region</span>
                      <span className="font-medium text-slate-700">{service.region}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integration Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            Integration Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Integration</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Last Sync</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Records</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {integrations.map(integration => {
                  const status = integration.status === 'connected' ? 'healthy' : 
                                integration.status === 'error' ? 'critical' : 'warning';
                  const config = statusColors[status];
                  const StatusIcon = config.icon;
                  return (
                    <tr key={integration.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                            {integration.provider?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{integration.name}</p>
                            <p className="text-xs text-slate-500">{integration.provider}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="capitalize">
                          {integration.type?.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={cn("w-4 h-4", config.color)} />
                          <span className={cn("text-sm font-medium capitalize", config.color)}>
                            {integration.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {integration.last_sync 
                          ? new Date(integration.last_sync).toLocaleString()
                          : 'Never'
                        }
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">
                        {integration.data_synced?.toLocaleString() || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}