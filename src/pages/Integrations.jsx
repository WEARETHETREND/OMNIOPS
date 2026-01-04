import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  Search, 
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const loadIntegrations = async () => {
    setLoading(true);
    setError('');
    const r = await safeGet('/integrations');
    if (!r.ok) {
      setError(r.error);
    } else {
      setIntegrations(r.data.integrations || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const filteredIntegrations = integrations.filter(i => {
    const matchesSearch = i.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         i.provider?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || i.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.status === 'connected').length,
    errors: integrations.filter(i => i.status === 'error').length,
    pending: integrations.filter(i => i.status === 'pending').length,
  };

  const getStatusIcon = (status) => {
    if (status === 'connected') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-rose-500" />;
    return <Clock className="w-4 h-4 text-amber-500" />;
  };

  const getStatusBadge = (status) => {
    if (status === 'connected') {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Connected
      </span>;
    }
    if (status === 'error') {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Error
      </span>;
    }
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Pending
    </span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
          <p className="text-sm text-slate-500">Wednesday, December 4, 2025</p>
        </div>
        <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>🏠</span>
        <span>/</span>
        <span className="text-slate-900">Integrations</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <p className="text-xs text-slate-500 mb-2">Total Integrations</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <p className="text-xs text-slate-500">Connected</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.connected}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <p className="text-xs text-slate-500">Errors</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.errors}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <p className="text-xs text-slate-500">Pending</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="crm">CRM</option>
          <option value="database">Database</option>
          <option value="analytics">Analytics</option>
        </select>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Integrations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : filteredIntegrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredIntegrations.map(integration => (
            <div key={integration.id} className="bg-white rounded-xl border border-slate-200/60 p-5 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg ${
                  integration.provider === 'PostgreSQL' ? 'bg-blue-600' :
                  integration.provider === 'Amazon' ? 'bg-orange-500' :
                  integration.provider === 'Salesforce' ? 'bg-cyan-500' :
                  integration.provider === 'Slack' ? 'bg-purple-600' :
                  integration.provider === 'Google' ? 'bg-red-500' :
                  'bg-slate-600'
                }`}>
                  {integration.provider?.[0] || 'P'}
                </div>
                {getStatusBadge(integration.status)}
              </div>
              
              <h3 className="font-semibold text-slate-900 mb-1">{integration.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{integration.provider}</p>
              
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Records synced</span>
                  <span className="font-medium text-slate-900">{integration.data_synced?.toLocaleString() || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Never synced</span>
                  <button className="text-slate-900 hover:text-slate-700 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Sync
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200/60">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">No integrations found</h3>
          <p className="text-sm text-slate-500">
            {searchQuery ? 'Try adjusting your search' : 'Connect your first integration'}
          </p>
        </div>
      )}
    </div>
  );
}