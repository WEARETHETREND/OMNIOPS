import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search,
  Plug,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import IntegrationCard from '@/components/dashboard/IntegrationCard';

const integrationTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'crm', label: 'CRM' },
  { value: 'erp', label: 'ERP' },
  { value: 'database', label: 'Database' },
  { value: 'api', label: 'API' },
  { value: 'cloud_service', label: 'Cloud Service' },
  { value: 'communication', label: 'Communication' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'storage', label: 'Storage' }
];

const syncFrequencies = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'manual', label: 'Manual' }
];

const popularIntegrations = [
  { name: 'Salesforce', provider: 'Salesforce', type: 'crm' },
  { name: 'SAP', provider: 'SAP', type: 'erp' },
  { name: 'HubSpot', provider: 'HubSpot', type: 'crm' },
  { name: 'Slack', provider: 'Slack', type: 'communication' },
  { name: 'Google Analytics', provider: 'Google', type: 'analytics' },
  { name: 'AWS S3', provider: 'Amazon', type: 'storage' },
  { name: 'PostgreSQL', provider: 'PostgreSQL', type: 'database' },
  { name: 'Stripe', provider: 'Stripe', type: 'api' }
];

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    provider: '',
    type: 'api',
    sync_frequency: 'daily',
    status: 'pending'
  });

  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => base44.entities.Integration.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Integration.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setIsCreateOpen(false);
      setNewIntegration({
        name: '',
        provider: '',
        type: 'api',
        sync_frequency: 'daily',
        status: 'pending'
      });
    }
  });

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.provider?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || integration.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.status === 'connected').length,
    error: integrations.filter(i => i.status === 'error').length,
    pending: integrations.filter(i => i.status === 'pending').length
  };

  const selectPopular = (integration) => {
    setNewIntegration({
      ...newIntegration,
      name: integration.name,
      provider: integration.provider,
      type: integration.type
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Integrations', value: stats.total, icon: Plug, color: 'text-slate-600' },
          { label: 'Connected', value: stats.connected, icon: CheckCircle, color: 'text-emerald-500' },
          { label: 'Errors', value: stats.error, icon: AlertCircle, color: 'text-rose-500' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {integrationTypes.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Integrations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : filteredIntegrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredIntegrations.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Plug className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No integrations found</h3>
          <p className="text-slate-500 mb-6">
            {searchQuery || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Connect your first integration to get started'}
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Integration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Popular Integrations */}
            <div>
              <Label className="text-xs text-slate-500">Popular Integrations</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {popularIntegrations.map(pi => (
                  <button
                    key={pi.name}
                    onClick={() => selectPopular(pi)}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-colors",
                      newIntegration.name === pi.name 
                        ? "border-slate-900 bg-slate-50" 
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-bold text-sm">
                      {pi.provider[0]}
                    </div>
                    <p className="text-xs font-medium text-slate-700 truncate">{pi.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <Label>Integration Name</Label>
                <Input
                  placeholder="e.g., Production Database"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Provider</Label>
                <Input
                  placeholder="e.g., PostgreSQL"
                  value={newIntegration.provider}
                  onChange={(e) => setNewIntegration({ ...newIntegration, provider: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={newIntegration.type} 
                    onValueChange={(v) => setNewIntegration({ ...newIntegration, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {integrationTypes.filter(t => t.value !== 'all').map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <Select 
                    value={newIntegration.sync_frequency} 
                    onValueChange={(v) => setNewIntegration({ ...newIntegration, sync_frequency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {syncFrequencies.map(f => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => createMutation.mutate(newIntegration)}
                disabled={!newIntegration.name || !newIntegration.provider || createMutation.isPending}
                className="bg-slate-900 hover:bg-slate-800"
              >
                {createMutation.isPending ? 'Adding...' : 'Add Integration'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}