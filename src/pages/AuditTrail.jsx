import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Filter,
  Download,
  Clock,
  User,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Play,
  FileUp,
  FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { toast } from 'sonner';
import ExportButton from '@/components/ui/ExportButton';

const actionIcons = {
  create: { icon: Edit, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  read: { icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
  update: { icon: Edit, color: 'text-amber-500', bg: 'bg-amber-50' },
  delete: { icon: Trash2, color: 'text-rose-500', bg: 'bg-rose-50' },
  login: { icon: LogIn, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  logout: { icon: LogOut, color: 'text-slate-500', bg: 'bg-slate-100' },
  export: { icon: FileDown, color: 'text-violet-500', bg: 'bg-violet-50' },
  import: { icon: FileUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  approve: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  reject: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  execute: { icon: Play, color: 'text-cyan-500', bg: 'bg-cyan-50' }
};

const riskColors = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-rose-100 text-rose-700'
};

export default function AuditTrail() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => base44.entities.AuditLog.list('-created_date', 100)
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.entity_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesRisk = riskFilter === 'all' || log.risk_level === riskFilter;
    return matchesSearch && matchesAction && matchesRisk;
  });

  const stats = {
    total: logs.length,
    today: logs.filter(l => new Date(l.created_date).toDateString() === new Date().toDateString()).length,
    highRisk: logs.filter(l => l.risk_level === 'high' || l.risk_level === 'critical').length,
    failures: logs.filter(l => l.status === 'failure').length
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Entity', 'Status', 'Risk Level', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.created_date,
        log.user_email,
        log.action,
        log.entity_type || '-',
        log.status,
        log.risk_level,
        log.ip_address || '-'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: stats.total, icon: Activity, color: 'from-slate-500 to-slate-700' },
          { label: 'Today', value: stats.today, icon: Clock, color: 'from-blue-500 to-indigo-600' },
          { label: 'High Risk', value: stats.highRisk, icon: AlertTriangle, color: 'from-rose-500 to-pink-600' },
          { label: 'Failures', value: stats.failures, icon: XCircle, color: 'from-amber-500 to-orange-600' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full md:w-auto flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by user, entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="export">Export</SelectItem>
              <SelectItem value="execute">Execute</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ExportButton 
          data={filteredLogs}
          filename={`audit-log-${format(new Date(), 'yyyy-MM-dd')}`}
          columns={[
            { key: 'created_date', label: 'Timestamp' },
            { key: 'user_email', label: 'User' },
            { key: 'action', label: 'Action' },
            { key: 'entity_type', label: 'Entity' },
            { key: 'status', label: 'Status' },
            { key: 'risk_level', label: 'Risk Level' },
            { key: 'ip_address', label: 'IP Address' }
          ]}
        />
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array(10).fill(0).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : filteredLogs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredLogs.map(log => {
                const actionConfig = actionIcons[log.action] || actionIcons.read;
                const ActionIcon = actionConfig.icon;
                return (
                  <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", actionConfig.bg)}>
                      <ActionIcon className={cn("w-5 h-5", actionConfig.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{log.user_name || log.user_email}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 capitalize">{log.action}</span>
                        {log.entity_type && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500">{log.entity_type}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>{format(new Date(log.created_date), 'MMM d, yyyy HH:mm:ss')}</span>
                        {log.ip_address && <span>IP: {log.ip_address}</span>}
                        {log.department && <span>{log.department}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("capitalize", riskColors[log.risk_level])}>
                        {log.risk_level}
                      </Badge>
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="capitalize">
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Activity className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No audit logs found</h3>
              <p className="text-slate-500">Activity will appear here as users interact with the system</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}