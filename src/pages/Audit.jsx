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
    setError('');
    const r = await safeGet('/audit', { limit: 200 });
    if (!r.ok) {
      setError(r.error);
    } else {
      setEvents(r.data.events || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAudit();
  }, []);

  const filteredEvents = events.filter(e => 
    e.actor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.target?.toLowerCase().includes(searchQuery.toLowerCase())
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

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

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
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Time</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Actor</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Tenant</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Action</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Target</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">IP Address</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map(e => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors text-sm">
                  <td className="py-3 px-6 text-slate-600">
                    {new Date(e.time).toLocaleString()}
                  </td>
                  <td className="py-3 px-6">
                    <span className="text-slate-900 font-medium">{e.actor}</span>
                  </td>
                  <td className="py-3 px-6 text-slate-600">{e.tenant || '—'}</td>
                  <td className="py-3 px-6">
                    <code className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                      {e.action}
                    </code>
                  </td>
                  <td className="py-3 px-6 text-slate-600">{e.target || '—'}</td>
                  <td className="py-3 px-6">
                    <span className="font-mono text-xs text-slate-500">{e.ip || '—'}</span>
                  </td>
                  <td className="py-3 px-6">
                    {e.metadata ? (
                      <details className="cursor-pointer">
                        <summary className="text-blue-600 hover:text-blue-700">View</summary>
                        <pre className="mt-2 text-xs bg-slate-50 p-2 rounded overflow-auto max-w-xs">
                          {JSON.stringify(e.metadata, null, 2)}
                        </pre>
                      </details>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
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