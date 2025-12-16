import React, { useState, useEffect } from 'react';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Compliance() {
  const [controls, setControls] = useState([]);
  const [framework, setFramework] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadControls = async () => {
    setLoading(true);
    setError('');
    const r = await safeGet('/compliance/controls', { 
      framework: framework === 'all' ? undefined : framework 
    });
    if (!r.ok) {
      setError(r.error);
    } else {
      setControls(r.data.controls || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadControls();
  }, [framework]);

  const updateStatus = async (id, status) => {
    const r = await safePost(`/compliance/controls/${id}`, { status });
    if (!r.ok) {
      toast.error(`Failed to update: ${r.error}`);
    } else {
      toast.success('Control updated');
      await loadControls();
    }
  };

  const stats = {
    total: controls.length,
    compliant: controls.filter(c => c.status === 'compliant').length,
    nonCompliant: controls.filter(c => c.status === 'non_compliant').length,
    partial: controls.filter(c => c.status === 'partial').length,
  };

  const complianceScore = stats.total > 0 
    ? Math.round((stats.compliant / stats.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance Dashboard</h1>
          <p className="text-slate-500 mt-1">Track SOC2, GDPR, HIPAA, ISO27001, and PCI-DSS compliance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadControls} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Compliance Score */}
      <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 mb-2">Overall Compliance Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold">{complianceScore}%</span>
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-emerald-100 mb-4">Controls Status</p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {stats.compliant} Compliant
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {stats.partial} Partial
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {stats.nonCompliant} Non-Compliant
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Framework Filter */}
      <div className="flex gap-4 items-center">
        <Select value={framework} onValueChange={setFramework}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Frameworks</SelectItem>
            <SelectItem value="SOC2">SOC2</SelectItem>
            <SelectItem value="GDPR">GDPR</SelectItem>
            <SelectItem value="HIPAA">HIPAA</SelectItem>
            <SelectItem value="ISO27001">ISO27001</SelectItem>
            <SelectItem value="PCI-DSS">PCI-DSS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Controls Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(10).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : controls.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Framework</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Control ID</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Name</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Category</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Last Assessed</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {controls.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {c.framework}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <code className="text-sm font-mono text-slate-600">{c.control_id}</code>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{c.name}</p>
                    {c.description && (
                      <p className="text-sm text-slate-500 mt-1">{c.description}</p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 capitalize">
                    {c.category?.replace(/_/g, ' ')}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      c.status === 'compliant' ? 'bg-emerald-50 text-emerald-700' :
                      c.status === 'partial' ? 'bg-amber-50 text-amber-700' :
                      c.status === 'non_compliant' ? 'bg-rose-50 text-rose-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {c.status === 'compliant' && <CheckCircle className="w-3 h-3" />}
                      {c.status === 'partial' && <AlertTriangle className="w-3 h-3" />}
                      {c.status === 'non_compliant' && <XCircle className="w-3 h-3" />}
                      {c.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {c.last_assessed ? new Date(c.last_assessed).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end">
                      <Select 
                        value={c.status} 
                        onValueChange={(status) => updateStatus(c.id, status)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compliant">Compliant</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                          <SelectItem value="not_applicable">N/A</SelectItem>
                          <SelectItem value="pending_review">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Shield className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No controls found</h3>
          <p className="text-slate-500">Select a framework to view controls</p>
        </div>
      )}
    </div>
  );
}