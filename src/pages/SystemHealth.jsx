import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  AlertCircle
} from 'lucide-react';

export default function SystemHealth() {
  const [metrics, setMetrics] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data: observability, isLoading } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: async () => {
      try {
        return await base44.entities.SystemObservability.list('-updated_date', 50);
      } catch {
        return [];
      }
    },
    refetchInterval: 30000
  });

  useEffect(() => {
    if (observability) {
      setMetrics(observability);
    }
  }, [observability]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'degrading') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const fresh = await base44.entities.SystemObservability.list('-updated_date', 50);
      setMetrics(fresh);
    } catch (error) {
      console.error('Error refreshing metrics:', error);
    }
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Loading system metrics...</p>
        </div>
      </div>
    );
  }

  const criticalCount = metrics.filter(m => m.status === 'critical').length;
  const warningCount = metrics.filter(m => m.status === 'warning').length;
  const healthyCount = metrics.filter(m => m.status === 'healthy').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Healthy Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{healthyCount}</div>
            <p className="text-xs text-slate-500 mt-1">Operating normally</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-xs text-slate-500 mt-1">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-slate-500 mt-1">Immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{metrics.length}</div>
            <p className="text-xs text-slate-500 mt-1">Monitored</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        {metrics.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-500">No metrics available</p>
            </CardContent>
          </Card>
        ) : (
          metrics.map((metric) => (
            <Card
              key={metric.id}
              className={`border-2 ${getStatusColor(metric.status)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(metric.status)}
                    <div className="flex-1">
                      <CardTitle className="text-base capitalize">
                        {metric.metric_type.replace(/_/g, ' ')}
                      </CardTitle>
                      <CardDescription>
                        {metric.service_component}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={metric.status === 'healthy' ? 'default' : 'outline'}
                    className={
                      metric.status === 'critical' ? 'bg-red-100 text-red-800 border-red-300' :
                      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      'bg-green-100 text-green-800 border-green-300'
                    }
                  >
                    {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Metric Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Current Value</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {metric.current_value.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Status Trend</p>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend)}
                      <span className="text-sm font-medium capitalize text-slate-700">
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thresholds */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600">Warning Threshold</p>
                    <p className="text-sm font-medium text-slate-900">
                      {metric.threshold_warning?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Critical Threshold</p>
                    <p className="text-sm font-medium text-red-700">
                      {metric.threshold_critical?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Latency Info */}
                {(metric.ttfb || metric.p99_latency) && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    {metric.ttfb && (
                      <div>
                        <p className="text-xs text-slate-600">TTFB</p>
                        <p className="text-sm font-medium">{metric.ttfb}ms</p>
                      </div>
                    )}
                    {metric.p99_latency && (
                      <div>
                        <p className="text-xs text-slate-600">P99 Latency</p>
                        <p className="text-sm font-medium">{metric.p99_latency}ms</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Last Incident */}
                {metric.last_incident && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-600">Last Incident</p>
                    <p className="text-sm text-slate-700">
                      {new Date(metric.last_incident).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}