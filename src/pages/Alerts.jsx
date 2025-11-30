import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search,
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Check,
  X,
  Filter,
  ExternalLink,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const severities = [
  { value: 'all', label: 'All Severity' },
  { value: 'critical', label: 'Critical' },
  { value: 'error', label: 'Error' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' }
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'system', label: 'System' },
  { value: 'workflow', label: 'Workflow' },
  { value: 'security', label: 'Security' },
  { value: 'performance', label: 'Performance' },
  { value: 'integration', label: 'Integration' },
  { value: 'compliance', label: 'Compliance' }
];

const severityConfig = {
  critical: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
  error: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' }
};

export default function Alerts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusTab, setStatusTab] = useState('new');

  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list('-created_date')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Alert.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] })
  });

  const handleAcknowledge = (alertId) => {
    updateMutation.mutate({ id: alertId, data: { status: 'acknowledged' } });
  };

  const handleResolve = (alertId) => {
    updateMutation.mutate({ 
      id: alertId, 
      data: { status: 'resolved', resolved_at: new Date().toISOString() } 
    });
  };

  const handleDismiss = (alertId) => {
    updateMutation.mutate({ id: alertId, data: { status: 'dismissed' } });
  };

  const handleEscalate = async (alert) => {
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

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;
    const matchesStatus = alert.status === statusTab;
    return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
  });

  const stats = {
    new: alerts.filter(a => a.status === 'new').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'new').length
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'New Alerts', value: stats.new, color: 'from-rose-500 to-pink-600' },
          { label: 'Acknowledged', value: stats.acknowledged, color: 'from-amber-500 to-orange-600' },
          { label: 'Resolved', value: stats.resolved, color: 'from-emerald-500 to-teal-600' },
          { label: 'Critical', value: stats.critical, color: 'from-rose-600 to-rose-700' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-10 rounded-full bg-gradient-to-b", stat.color)} />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <Tabs value={statusTab} onValueChange={setStatusTab} className="w-full lg:w-auto">
            <TabsList className="grid grid-cols-4 w-full lg:w-auto">
              <TabsTrigger value="new" className="relative">
                New
                {stats.new > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                    {stats.new}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {severities.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="space-y-3">
          {filteredAlerts.map(alert => {
            const config = severityConfig[alert.severity] || severityConfig.info;
            const Icon = config.icon;
            return (
              <div 
                key={alert.id} 
                className={cn(
                  "bg-white rounded-xl border p-5 transition-all hover:shadow-md",
                  config.border
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", config.bg)}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {alert.category?.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {new Date(alert.created_date).toLocaleString()}
                          </span>
                          {alert.source && (
                            <span className="text-xs text-slate-400">• {alert.source}</span>
                          )}
                        </div>
                      </div>
                      <Badge className={cn("capitalize flex-shrink-0", config.bg, config.color)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{alert.message}</p>
                    {statusTab === 'new' && (
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledge(alert.id)}
                          className="text-amber-600 border-amber-200 hover:bg-amber-50"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolve(alert.id)}
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Resolve
                        </Button>
                        {alert.severity === 'critical' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEscalate(alert)}
                            className="text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            <Send className="w-3.5 h-3.5 mr-1" />
                            Escalate
                          </Button>
                        )}
                        <Link to={createPageUrl(`AlertDetails?id=${alert.id}`)}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-slate-600"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                            Details
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismiss(alert.id)}
                          className="text-slate-500"
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                    {statusTab === 'acknowledged' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(alert.id)}
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Bell className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No alerts</h3>
          <p className="text-slate-500">
            {searchQuery || severityFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : `No ${statusTab} alerts at the moment`}
          </p>
        </div>
      )}
    </div>
  );
}