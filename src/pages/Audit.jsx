import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  Search,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Audit() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAudit = async () => {
    setLoading(true);
    const r = await safeGet('/api/audit');
    if (r.ok) {
      setEvents(r.data.logs || r.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAudit();
  }, []);

  const filteredEvents = events.filter(e => 
    e.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.entity_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Trail</h1>
          <p className="text-slate-500 mt-1">Security and compliance event log</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search audit events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={loadAudit} variant="outline">
          Refresh
        </Button>
      </div>



      {/* Audit Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(15).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">User</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Action</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Entity</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Time</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Department</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Risk</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((e, idx) => (
                <tr key={e.id || idx} className="hover:bg-slate-50 transition-colors text-sm">
                  <td className="py-3 px-6">
                    <div>
                      <div className="text-slate-900 font-medium">{e.user_name || e.user_email}</div>
                      {e.user_email && e.user_name && (
                        <div className="text-xs text-slate-500">{e.user_email}</div>
                      )}
                      {e.ip_address && (
                        <div className="text-xs text-slate-400 font-mono">IP: {e.ip_address}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <code className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                      {e.action}
                    </code>
                  </td>
                  <td className="py-3 px-6 text-slate-700">{e.entity_type || '—'}</td>
                  <td className="py-3 px-6 text-slate-600 text-xs">
                    {e.created_at ? new Date(e.created_at).toLocaleString() : '—'}
                  </td>
                  <td className="py-3 px-6 text-slate-600">{e.department || '—'}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      e.risk_level === 'critical' ? 'bg-rose-100 text-rose-700' :
                      e.risk_level === 'high' ? 'bg-orange-100 text-orange-700' :
                      e.risk_level === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {e.risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      e.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No audit events</h3>
          <p className="text-slate-500">
            {searchQuery ? 'Try adjusting your search' : 'No events recorded yet'}
          </p>
        </div>
      )}
    </div>
  );
}