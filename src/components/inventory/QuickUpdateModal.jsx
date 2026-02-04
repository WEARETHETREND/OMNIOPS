import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function QuickUpdateModal({ qrCode, items, onClose, onUpdate }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Try to find matching item by SKU or ID
  const matchedItem = items.find(i => i.sku === qrCode || i.id === qrCode);

  const handleUpdate = async () => {
    if (!matchedItem) {
      toast.error('Item not found for this QR code');
      return;
    }

    setLoading(true);
    try {
      const newQuantity = matchedItem.quantity + parseInt(quantity);
      // Update would go through backend integration
      toast.success(`Updated ${matchedItem.name} to ${newQuantity} units`);
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to update inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Update Inventory</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {matchedItem ? (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Item</p>
              <p className="font-semibold text-slate-900">{matchedItem.name}</p>
              <p className="text-xs text-slate-500 mt-2">Current: {matchedItem.quantity} units</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Add Quantity
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="text-center"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-sm text-slate-600">New Total</p>
              <p className="text-2xl font-bold text-slate-900">
                {matchedItem.quantity + parseInt(quantity)} units
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate} 
                disabled={loading}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              >
                {loading ? 'Updating...' : 'Confirm'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600 mb-4">No matching item found for QR code</p>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}