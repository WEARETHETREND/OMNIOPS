import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  Package,
  Search,
  TrendingDown,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    setLoading(true);
    const r = await safeGet('/inventory/items');
    if (r.ok) setItems(r.data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filtered = items.filter(i => 
    i.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: items.length,
    lowStock: items.filter(i => i.quantity < i.reorder_point).length,
    outOfStock: items.filter(i => i.quantity === 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500 mt-1">Stock management and tracking</p>
        </div>
        <Button className="bg-slate-900">
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Total Items</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-amber-600">{stats.lowStock}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-rose-600">{stats.outOfStock}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Items Table */}
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
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Item</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">SKU</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Quantity</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Reorder Point</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-slate-700">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{item.sku}</td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-slate-900">{item.quantity}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{item.reorder_point}</td>
                  <td className="py-4 px-6">
                    {item.quantity === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
                        <AlertTriangle className="w-3 h-3" />
                        Out of Stock
                      </span>
                    ) : item.quantity < item.reorder_point ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        <TrendingDown className="w-3 h-3" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        <TrendingUp className="w-3 h-3" />
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-slate-900">
                    ${((item.quantity || 0) * (item.unit_price || 0)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No items found</h3>
          <p className="text-slate-500">Add inventory items to get started</p>
        </div>
      )}
    </div>
  );
}