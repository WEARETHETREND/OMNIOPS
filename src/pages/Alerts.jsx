import React, { useState, useEffect } from 'react';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Search,
  AlertTriangle,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('new');

  const loadAlerts = async () => {
    setLoading(true);
    setError('');
    const r = await safeGet('/alerts');
    if (!r.ok) {
      setError(r.error);
    } else {
      setAlerts(r.data.alerts || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.service?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'new' ? a.status === 'open' :
                      activeTab === 'acknowledged' ? a.status === 'acknowledged' :
                      activeTab === 'resolved' ? a.status === 'resolved' :
                      activeTab === 'dismissed' ? a.status === 'dismissed' : true;
    return matchesSearch && matchesTab;
  });

  const stats = {
    new: alerts.filter(a => a.status === 'open').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'open').length,
  };

  const tabs = [
    { id: 'new', label: 'New', count: stats.new },
    { id: 'acknowledged', label: 'Acknowledged', count: stats.acknowledged },
    { id: 'resolved', label: 'Resolved', count: stats.resolved },
    { id: 'dismissed', label: 'Dismissed', count: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
        <p className="text-sm text-slate-500">Wednesday, December 4, 2025</p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>🏠</span>
        <span>/</span>
        <span className="text-slate-900">Alerts</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-10 rounded-full bg-slate-900" />
            <p className="text-xs text-slate-500">New Alerts</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.new}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-10 rounded-full bg-amber-500" />
            <p className="text-xs text-slate-500">Acknowledged</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.acknowledged}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-10 rounded-full bg-emerald-500" />
            <p className="text-xs text-slate-500">Resolved</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-10 rounded-full bg-rose-500" />
            <p className="text-xs text-slate-500">Critical</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.critical}</p>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-xl border border-slate-200/60">
        <div className="border-b border-slate-200 px-6">
          <div className="flex items-center gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-4">
              <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option>All Severity</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option>All Categories</option>
                <option>System</option>
                <option>Workflow</option>
                <option>Security</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : filteredAlerts.length > 0 ? (
            <div className="space-y-3">
              {filteredAlerts.map(alert => (
                <div key={alert.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                    alert.severity === 'critical' || alert.severity === 'high' ? 'text-rose-500' :
                    alert.severity === 'medium' ? 'text-amber-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{alert.title}</h4>
                    <p className="text-sm text-slate-500">{alert.service || 'System'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-sm text-slate-500">
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 mb-1">No alerts</h3>
              <p className="text-sm text-slate-500">
                {searchQuery ? 'Try adjusting your search' : 'All clear!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}