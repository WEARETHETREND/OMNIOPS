import React, { useState, useEffect } from 'react';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Search,
  Bell,
  AlertTriangle,
  Check
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

  const acknowledgeAlert = async (id) => {
    const r = await safePost(`/alerts/${id}/ack`);
    if (!r.ok) {
      toast.error(`Failed to acknowledge: ${r.error}`);
    } else {
      toast.success('Alert acknowledged');
      await loadAlerts();
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const filteredAlerts = alerts.filter(a => 
    a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.service?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: alerts.length,
    open: alerts.filter(a => a.status === 'open').length,
    high: alerts.filter(a => a.severity === 'high').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-slate-900" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Alerts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-amber-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.open}</p>
              <p className="text-sm text-slate-500">Open</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-rose-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.high}</p>
              <p className="text-sm text-slate-500">High Severity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={loadAlerts} variant="outline">
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Alerts Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Severity</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Title</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Service</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Created At</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      a.severity === 'high' || a.severity === 'critical' ? 'bg-rose-50 text-rose-700' :
                      a.severity === 'medium' ? 'bg-amber-50 text-amber-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                      {a.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{a.title}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{a.service || '—'}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      a.status === 'open' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        a.status === 'open' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      {a.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end">
                      {a.status === 'open' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => acknowledgeAlert(a.id)}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Bell className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No alerts</h3>
          <p className="text-slate-500">
            {searchQuery ? 'Try adjusting your search' : 'All clear!'}
          </p>
        </div>
      )}
    </div>
  );
}