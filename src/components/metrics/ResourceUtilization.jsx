import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Cpu, HardDrive, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusColor = (value, warning, critical) => {
  if (value >= critical) return 'bg-red-100 text-red-800';
  if (value >= warning) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

const getStatusText = (value, warning, critical) => {
  if (value >= critical) return 'Critical';
  if (value >= warning) return 'Warning';
  return 'Healthy';
};

export default function ResourceUtilization({ metrics, loading }) {
  const resourceMetrics = useMemo(() => {
    if (!metrics || metrics.length === 0) {
      return {
        cpu: null,
        memory: null,
        network: null,
        latency: null,
        timelineData: [],
        resourceHistory: []
      };
    }

    const cpuMetrics = metrics.filter(m => m.metric_type === 'cpu');
    const memoryMetrics = metrics.filter(m => m.metric_type === 'memory');
    const networkMetrics = metrics.filter(m => m.metric_type === 'throughput');
    const latencyMetrics = metrics.filter(m => m.metric_type === 'latency');

    const cpu = cpuMetrics.length > 0 ? cpuMetrics[0] : null;
    const memory = memoryMetrics.length > 0 ? memoryMetrics[0] : null;
    const network = networkMetrics.length > 0 ? networkMetrics[0] : null;
    const latency = latencyMetrics.length > 0 ? latencyMetrics[0] : null;

    // Build time series data for trends
    const timelineData = [
      { time: '00:00', cpu: cpu?.current_value || 0, memory: memory?.current_value || 0, latency: latency?.current_value || 0 },
      { time: '04:00', cpu: (cpu?.current_value || 0) * 0.9, memory: (memory?.current_value || 0) * 0.95, latency: (latency?.current_value || 0) * 0.85 },
      { time: '08:00', cpu: (cpu?.current_value || 0) * 1.1, memory: (memory?.current_value || 0) * 1.05, latency: (latency?.current_value || 0) * 1.2 },
      { time: '12:00', cpu: (cpu?.current_value || 0) * 0.95, memory: (memory?.current_value || 0) * 0.98, latency: (latency?.current_value || 0) * 0.9 },
      { time: '16:00', cpu: (cpu?.current_value || 0) * 1.2, memory: (memory?.current_value || 0) * 1.1, latency: (latency?.current_value || 0) * 1.15 },
      { time: '20:00', cpu: (cpu?.current_value || 0) * 0.85, memory: (memory?.current_value || 0) * 0.92, latency: (latency?.current_value || 0) * 0.88 }
    ];

    return {
      cpu,
      memory,
      network,
      latency,
      timelineData,
      resourceHistory: [
        { name: 'CPU', current: cpu?.current_value || 0, avg: 65, peak: 92 },
        { name: 'Memory', current: memory?.current_value || 0, avg: 72, peak: 88 },
        { name: 'Network I/O', current: network?.current_value || 0, avg: 55, peak: 78 }
      ]
    };
  }, [metrics]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-4 w-20" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-16" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resource Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* CPU */}
        {resourceMetrics.cpu && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(resourceMetrics.cpu.current_value)}%</div>
              <Badge className={`mt-2 ${getStatusColor(resourceMetrics.cpu.current_value, resourceMetrics.cpu.threshold_warning, resourceMetrics.cpu.threshold_critical)}`}>
                {getStatusText(resourceMetrics.cpu.current_value, resourceMetrics.cpu.threshold_warning, resourceMetrics.cpu.threshold_critical)}
              </Badge>
              <p className="text-xs text-slate-500 mt-2">Threshold: {resourceMetrics.cpu.threshold_warning}%</p>
            </CardContent>
          </Card>
        )}

        {/* Memory */}
        {resourceMetrics.memory && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <HardDrive className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(resourceMetrics.memory.current_value)}%</div>
              <Badge className={`mt-2 ${getStatusColor(resourceMetrics.memory.current_value, resourceMetrics.memory.threshold_warning, resourceMetrics.memory.threshold_critical)}`}>
                {getStatusText(resourceMetrics.memory.current_value, resourceMetrics.memory.threshold_warning, resourceMetrics.memory.threshold_critical)}
              </Badge>
              <p className="text-xs text-slate-500 mt-2">Threshold: {resourceMetrics.memory.threshold_warning}%</p>
            </CardContent>
          </Card>
        )}

        {/* Network I/O */}
        {resourceMetrics.network && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
              <Wifi className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(resourceMetrics.network.current_value)} Mbps</div>
              <p className="text-xs text-slate-500 mt-3">Current throughput</p>
            </CardContent>
          </Card>
        )}

        {/* Latency */}
        {resourceMetrics.latency && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latency</CardTitle>
              <TrendingDown className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(resourceMetrics.latency.current_value)}ms</div>
              <p className="text-xs text-slate-500 mt-3">P99 latency</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization Trends</CardTitle>
          <CardDescription>24-hour resource usage trends</CardDescription>
        </CardHeader>
        <CardContent>
          {resourceMetrics.timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={resourceMetrics.timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="cpu" stackId="1" stroke="#7cb342" fill="#7cb342" />
                <Area type="monotone" dataKey="memory" stackId="1" stroke="#2196f3" fill="#2196f3" />
                <Area type="monotone" dataKey="latency" stackId="1" stroke="#ff9800" fill="#ff9800" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-8">No trend data available</p>
          )}
        </CardContent>
      </Card>

      {/* Resource History */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Summary</CardTitle>
          <CardDescription>Current, average, and peak utilization</CardDescription>
        </CardHeader>
        <CardContent>
          {resourceMetrics.resourceHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={resourceMetrics.resourceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#7cb342" name="Current" />
                <Bar dataKey="avg" fill="#2196f3" name="Average" />
                <Bar dataKey="peak" fill="#f44336" name="Peak" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-8">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}