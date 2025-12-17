import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  DollarSign,
  Plus,
  Search,
  FileText,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    setLoading(true);
    const r = await safeGet('/billing/invoices');
    if (r.ok) setInvoices(r.data.invoices || []);
    setLoading(false);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const filtered = invoices.filter(i => 
    i.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.customer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: invoices.reduce((sum, i) => sum + (i.amount || 0), 0),
    paid: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0),
    pending: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales & Billing</h1>
          <p className="text-slate-500 mt-1">Invoices, payments, and revenue</p>
        </div>
        <Button className="bg-slate-900">
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900">${stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Paid</p>
          <p className="text-2xl font-bold text-emerald-600">${stats.paid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-600">${stats.pending.toLocaleString()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(10).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Invoice</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Date</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-slate-700">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{inv.invoice_number}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{inv.customer}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {inv.date ? new Date(inv.date).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                      inv.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      inv.status === 'overdue' ? 'bg-rose-50 text-rose-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {inv.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                      {inv.status === 'pending' && <Clock className="w-3 h-3" />}
                      {inv.status === 'overdue' && <XCircle className="w-3 h-3" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-semibold text-slate-900">${inv.amount?.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <DollarSign className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No invoices found</h3>
          <p className="text-slate-500">Create your first invoice</p>
        </div>
      )}
    </div>
  );
}