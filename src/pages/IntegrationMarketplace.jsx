import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Search, Star, CheckCircle2, Settings, Zap, RefreshCw, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const integrations = [
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'accounting',
    description: 'Sync invoices, expenses, and financial data',
    icon: '💰',
    features: ['Automatic invoice sync', 'Expense tracking', 'Financial reporting'],
    popular: true,
    requiresOAuth: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    description: 'Connect your CRM data and sales pipeline',
    icon: '☁️',
    features: ['Contact sync', 'Deal tracking', 'Lead management'],
    popular: true,
    requiresOAuth: true
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'productivity',
    description: 'Schedule and sync appointments automatically',
    icon: '📅',
    features: ['Event creation', 'Calendar sync', 'Reminder management'],
    popular: true,
    requiresOAuth: true
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    description: 'Send notifications and updates to Slack channels',
    icon: '💬',
    features: ['Channel notifications', 'Direct messages', 'Workflow alerts'],
    popular: true,
    requiresOAuth: true
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    description: 'Marketing automation and CRM integration',
    icon: '🎯',
    features: ['Contact sync', 'Email campaigns', 'Lead scoring'],
    requiresOAuth: true
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    description: 'Sync documentation and project data',
    icon: '📝',
    features: ['Database sync', 'Page creation', 'Task management'],
    requiresOAuth: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payments',
    description: 'Process payments and manage subscriptions',
    icon: '💳',
    features: ['Payment processing', 'Subscription management', 'Invoice generation'],
    requiresOAuth: false
  },
  {
    id: 'twilio',
    name: 'Twilio',
    category: 'communication',
    description: 'Send SMS and make voice calls',
    icon: '📱',
    features: ['SMS messaging', 'Voice calls', 'WhatsApp integration'],
    requiresOAuth: false
  }
];

export default function IntegrationMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [configuring, setConfiguring] = useState(false);
  const queryClient = useQueryClient();

  const { data: installedIntegrations = [] } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => base44.entities.Integration.list()
  });

  const createIntegrationMutation = useMutation({
    mutationFn: (data) => base44.entities.Integration.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['integrations']);
      toast.success('Integration connected successfully');
      setConfiguring(false);
      setSelectedIntegration(null);
    }
  });

  const updateIntegrationMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Integration.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['integrations']);
      toast.success('Integration updated');
    }
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'crm', label: 'CRM' },
    { id: 'accounting', label: 'Accounting' },
    { id: 'communication', label: 'Communication' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'payments', label: 'Payments' }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isInstalled = (integrationId) => {
    return installedIntegrations.some(i => i.provider.toLowerCase() === integrationId);
  };

  const handleConnect = async (integration) => {
    if (integration.requiresOAuth) {
      const integrationTypeMap = {
        'salesforce': 'salesforce',
        'google-calendar': 'googlecalendar',
        'slack': 'slack',
        'hubspot': 'hubspot',
        'notion': 'notion'
      };
      
      const integrationType = integrationTypeMap[integration.id];
      if (integrationType) {
        toast.info('Opening OAuth authorization...');
        // OAuth flow would be handled by Base44 platform
        window.open(`/oauth/authorize/${integrationType}`, '_blank');
      } else {
        setSelectedIntegration(integration);
        setConfiguring(true);
      }
    } else {
      setSelectedIntegration(integration);
      setConfiguring(true);
    }
  };

  const handleSaveConfig = async (config) => {
    await createIntegrationMutation.mutateAsync({
      name: selectedIntegration.name,
      type: selectedIntegration.category,
      provider: selectedIntegration.id,
      status: 'connected',
      config,
      sync_frequency: 'daily'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Integration Marketplace</h1>
        <p className="text-slate-600">Connect OpsVanta with your favorite tools and services</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Installed Integrations */}
      {installedIntegrations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {installedIntegrations.map(integration => (
              <Card key={integration.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {integrations.find(i => i.id === integration.provider)?.icon || '🔌'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                        <Badge className={
                          integration.status === 'connected' ? 'bg-green-100 text-green-700' :
                          integration.status === 'error' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }>
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  {integration.last_sync && (
                    <p className="text-xs text-slate-500">
                      Last sync: {new Date(integration.last_sync).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {selectedCategory === 'all' ? 'All Integrations' : `${categories.find(c => c.id === selectedCategory)?.label} Integrations`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map(integration => (
            <Card key={integration.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{integration.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      {integration.popular && (
                        <Badge variant="outline" className="text-xs mt-1">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isInstalled(integration.id) && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">{integration.description}</p>
                <ul className="space-y-2 mb-4">
                  {integration.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                      <Zap className="w-3 h-3 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleConnect(integration)}
                  disabled={isInstalled(integration.id)}
                  className="w-full"
                  variant={isInstalled(integration.id) ? 'outline' : 'default'}
                >
                  {isInstalled(integration.id) ? 'Connected' : 'Connect'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Configuration Dialog */}
      <Dialog open={configuring} onOpenChange={setConfiguring}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input placeholder="Enter your API key" />
            </div>
            <div className="space-y-2">
              <Label>Sync Frequency</Label>
              <select className="w-full h-10 px-3 rounded-md border border-slate-200">
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Auto-sync enabled</Label>
              <Switch />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setConfiguring(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => handleSaveConfig({})} className="flex-1">
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}