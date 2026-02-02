import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Settings, Trash2, Play
} from 'lucide-react';
import { createPageUrl } from '../utils';
import { toast } from 'sonner';

export default function IntegrationDetails() {
  const [integrationId, setIntegrationId] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIntegrationId(params.get('id'));
  }, []);

  const { data: integration, isLoading } = useQuery({
    queryKey: ['integration', integrationId],
    queryFn: () => base44.entities.Integration.filter({ id: integrationId }).then(res => res[0]),
    enabled: !!integrationId
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      await base44.functions.invoke('syncIntegration', { integration_id: integrationId });
    },
    onSuccess: () => {
      toast.success('Sync completed successfully');
      queryClient.invalidateQueries(['integration', integrationId]);
    },
    onError: () => {
      toast.error('Sync failed');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Integration.update(integrationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['integration', integrationId]);
      toast.success('Settings updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Integration.delete(integrationId),
    onSuccess: () => {
      toast.success('Integration deleted');
      window.location.href = createPageUrl('IntegrationMarketplace');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full" />
      </div>
    );
  }

  if (!integration) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Integration not found</h3>
        <Button onClick={() => window.location.href = createPageUrl('IntegrationMarketplace')}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = createPageUrl('IntegrationMarketplace')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{integration.name}</h1>
            <p className="text-slate-600">{integration.type} integration</p>
          </div>
        </div>
        <Badge className={
          integration.status === 'connected' ? 'bg-green-100 text-green-700' :
          integration.status === 'error' ? 'bg-red-100 text-red-700' :
          'bg-slate-100 text-slate-700'
        }>
          {integration.status}
        </Badge>
      </div>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Last Sync</p>
              <p className="text-sm text-slate-600">
                {integration.last_sync 
                  ? new Date(integration.last_sync).toLocaleString()
                  : 'Never synced'}
              </p>
            </div>
            <Button
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              Sync Now
            </Button>
          </div>
          
          {integration.data_synced && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Records synced</p>
              <p className="text-2xl font-bold text-slate-900">{integration.data_synced.toLocaleString()}</p>
            </div>
          )}

          {integration.error_message && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Sync Error</p>
                  <p className="text-sm text-red-700">{integration.error_message}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Auto-sync</Label>
              <p className="text-sm text-slate-600">Automatically sync data at intervals</p>
            </div>
            <Switch
              checked={integration.sync_frequency !== 'manual'}
              onCheckedChange={(checked) => 
                updateMutation.mutate({ 
                  sync_frequency: checked ? 'hourly' : 'manual' 
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Sync Frequency</Label>
            <select
              value={integration.sync_frequency || 'daily'}
              onChange={(e) => updateMutation.mutate({ sync_frequency: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-slate-200"
            >
              <option value="realtime">Real-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="manual">Manual only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Delete Integration</p>
              <p className="text-sm text-slate-600">This will remove all connection settings</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to delete this integration?')) {
                  deleteMutation.mutate();
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}