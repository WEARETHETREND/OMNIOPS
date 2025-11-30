import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Server,
  Activity,
  FileText,
  Send,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  Copy,
  Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const severityConfig = {
  critical: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', gradient: 'from-rose-500 to-pink-600' },
  error: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', gradient: 'from-orange-500 to-red-600' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-600' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', gradient: 'from-blue-500 to-cyan-600' }
};

const statusConfig = {
  new: { label: 'New', color: 'bg-rose-500' },
  acknowledged: { label: 'Acknowledged', color: 'bg-amber-500' },
  resolved: { label: 'Resolved', color: 'bg-emerald-500' },
  dismissed: { label: 'Dismissed', color: 'bg-slate-400' }
};

export default function AlertDetails() {
  const [note, setNote] = useState('');
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const alertId = urlParams.get('id');

  const { data: alert, isLoading } = useQuery({
    queryKey: ['alert', alertId],
    queryFn: async () => {
      const alerts = await base44.entities.Alert.filter({ id: alertId });
      return alerts[0];
    },
    enabled: !!alertId
  });

  const { data: relatedAlerts = [] } = useQuery({
    queryKey: ['relatedAlerts', alert?.source],
    queryFn: () => base44.entities.Alert.filter({ source: alert.source }, '-created_date', 5),
    enabled: !!alert?.source
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Alert.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert', alertId] });
      toast.success('Alert updated');
    }
  });

  const handleStatusChange = (newStatus) => {
    const data = { status: newStatus };
    if (newStatus === 'resolved') {
      data.resolved_at = new Date().toISOString();
    }
    updateMutation.mutate({ id: alertId, data });
  };

  const handleEscalate = async () => {
    try {
      await base44.integrations.Core.SendEmail({
        to: 'admin@company.com',
        subject: `[ESCALATED] ${alert.severity.toUpperCase()}: ${alert.title}`,
        body: `
Alert has been escalated and requires immediate attention.

Title: ${alert.title}
Severity: ${alert.severity}
Category: ${alert.category}
Source: ${alert.source || 'N/A'}

Message:
${alert.message}

Time: ${new Date(alert.created_date).toLocaleString()}

Please investigate immediately.
        `
      });
      toast.success('Alert escalated via email');
    } catch (e) {
      toast.error('Failed to escalate');
    }
  };

  const copyDiagnostics = () => {
    const diagnostics = `
Alert ID: ${alert.id}
Title: ${alert.title}
Severity: ${alert.severity}
Category: ${alert.category}
Source: ${alert.source}
Status: ${alert.status}
Created: ${alert.created_date}
Message: ${alert.message}
    `.trim();
    navigator.clipboard.writeText(diagnostics);
    toast.success('Diagnostics copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full" />
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Alert not found</h2>
        <Link to={createPageUrl('Alerts')}>
          <Button variant="outline">Back to Alerts</Button>
        </Link>
      </div>
    );
  }

  const config = severityConfig[alert.severity] || severityConfig.info;
  const Icon = config.icon;
  const status = statusConfig[alert.status] || statusConfig.new;

  // Mock diagnostic data
  const diagnostics = {
    timestamp: alert.created_date,
    server: 'prod-db-01.region-east.internal',
    ip: '10.0.1.45',
    port: 5432,
    connectionAttempts: 3,
    lastSuccessful: '2024-01-15T08:30:00Z',
    errorCode: 'ETIMEDOUT',
    latency: '30000ms',
    metrics: [
      { name: 'CPU Usage', value: '78%', status: 'warning' },
      { name: 'Memory', value: '85%', status: 'critical' },
      { name: 'Disk I/O', value: '45%', status: 'normal' },
      { name: 'Network', value: '12ms', status: 'normal' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={createPageUrl('Alerts')}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{alert.title}</h1>
            <Badge className={cn("capitalize", config.bg, config.color)}>
              {alert.severity}
            </Badge>
            <Badge variant="outline" className="capitalize">
              <span className={cn("w-2 h-2 rounded-full mr-2", status.color)} />
              {status.label}
            </Badge>
          </div>
          <p className="text-slate-500 mt-1">
            Alert ID: {alert.id} • Created {new Date(alert.created_date).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyDiagnostics}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Diagnostics
          </Button>
          {alert.status === 'new' && (
            <Button 
              variant="outline" 
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
              onClick={handleEscalate}
            >
              <Send className="w-4 h-4 mr-2" />
              Escalate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alert Message */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Alert Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("p-4 rounded-xl border", config.bg, config.border)}>
                <div className="flex items-start gap-3">
                  <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0", config.gradient)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-700">{alert.message}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Category</p>
                  <p className="font-medium text-slate-900 capitalize">{alert.category?.replace('_', ' ')}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Source</p>
                  <p className="font-medium text-slate-900">{alert.source || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Created</p>
                  <p className="font-medium text-slate-900">{new Date(alert.created_date).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Time</p>
                  <p className="font-medium text-slate-900">{new Date(alert.created_date).toLocaleTimeString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagnostics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Diagnostic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {diagnostics.metrics.map((metric, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-400">{metric.name}</p>
                    <p className={cn(
                      "font-semibold",
                      metric.status === 'critical' ? 'text-rose-600' :
                      metric.status === 'warning' ? 'text-amber-600' : 'text-slate-900'
                    )}>
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-300 overflow-x-auto">
                <div className="space-y-1">
                  <p><span className="text-slate-500"># Connection Details</span></p>
                  <p>Server: <span className="text-emerald-400">{diagnostics.server}</span></p>
                  <p>IP: <span className="text-cyan-400">{diagnostics.ip}</span></p>
                  <p>Port: <span className="text-cyan-400">{diagnostics.port}</span></p>
                  <p></p>
                  <p><span className="text-slate-500"># Error Information</span></p>
                  <p>Error Code: <span className="text-rose-400">{diagnostics.errorCode}</span></p>
                  <p>Latency: <span className="text-amber-400">{diagnostics.latency}</span></p>
                  <p>Connection Attempts: <span className="text-amber-400">{diagnostics.connectionAttempts}</span></p>
                  <p></p>
                  <p><span className="text-slate-500"># Last Successful Connection</span></p>
                  <p>Timestamp: <span className="text-slate-400">{new Date(diagnostics.lastSuccessful).toLocaleString()}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: alert.created_date, action: 'Alert created', user: 'System', type: 'create' },
                  ...(alert.status === 'acknowledged' || alert.status === 'resolved' ? [
                    { time: new Date().toISOString(), action: 'Alert acknowledged', user: 'Admin', type: 'acknowledge' }
                  ] : []),
                  ...(alert.status === 'resolved' ? [
                    { time: alert.resolved_at || new Date().toISOString(), action: 'Alert resolved', user: alert.resolved_by || 'Admin', type: 'resolve' }
                  ] : [])
                ].map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        event.type === 'create' ? 'bg-rose-100 text-rose-600' :
                        event.type === 'acknowledge' ? 'bg-amber-100 text-amber-600' :
                        'bg-emerald-100 text-emerald-600'
                      )}>
                        {event.type === 'create' ? <AlertCircle className="w-4 h-4" /> :
                         event.type === 'acknowledge' ? <Check className="w-4 h-4" /> :
                         <CheckCircle className="w-4 h-4" />}
                      </div>
                      {i < 2 && <div className="w-px h-8 bg-slate-200 mt-2" />}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-slate-900">{event.action}</p>
                      <p className="text-sm text-slate-500">
                        {event.user} • {new Date(event.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alert.status === 'new' && (
                <>
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600"
                    onClick={() => handleStatusChange('acknowledged')}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Acknowledge
                  </Button>
                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => handleStatusChange('resolved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolve
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleStatusChange('dismissed')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Dismiss
                  </Button>
                </>
              )}
              {alert.status === 'acknowledged' && (
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => handleStatusChange('resolved')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}
              {(alert.status === 'resolved' || alert.status === 'dismissed') && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleStatusChange('new')}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reopen Alert
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Related Alerts */}
          {relatedAlerts.filter(a => a.id !== alert.id).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Related Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedAlerts.filter(a => a.id !== alert.id).slice(0, 4).map(related => {
                  const relConfig = severityConfig[related.severity] || severityConfig.info;
                  return (
                    <Link 
                      key={related.id} 
                      to={createPageUrl(`AlertDetails?id=${related.id}`)}
                      className="block p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <relConfig.icon className={cn("w-4 h-4 mt-0.5", relConfig.color)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{related.title}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(related.created_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to={createPageUrl('Integrations')}>
                <Button variant="ghost" className="w-full justify-start">
                  <Server className="w-4 h-4 mr-2" />
                  View Integrations
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
              </Link>
              <Link to={createPageUrl('SystemHealth')}>
                <Button variant="ghost" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  System Health
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}