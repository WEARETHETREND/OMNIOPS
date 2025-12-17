import React, { useState, useEffect } from 'react';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Share2,
  Plus,
  Users,
  Lock,
  Globe,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function SharedDashboards() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadDashboards = async () => {
    setLoading(true);
    const r = await safeGet('/dashboards/shared');
    if (r.ok) setDashboards(r.data.dashboards || []);
    setLoading(false);
  };

  const copyShareLink = (dashboard) => {
    navigator.clipboard.writeText(dashboard.share_url);
    toast.success('Link copied to clipboard');
  };

  useEffect(() => {
    loadDashboards();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shared Dashboards</h1>
          <p className="text-slate-500 mt-1">Create public dashboards for stakeholders</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-slate-900">
          <Plus className="w-4 h-4 mr-2" />
          New Dashboard
        </Button>
      </div>

      {/* Dashboards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : dashboards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map(dashboard => (
            <div key={dashboard.id} className="bg-white rounded-xl border border-slate-200/60 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  {dashboard.visibility === 'public' ? (
                    <>
                      <Globe className="w-3 h-3" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Private
                    </>
                  )}
                </span>
              </div>
              
              <h3 className="font-semibold text-slate-900 mb-2">{dashboard.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{dashboard.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {dashboard.viewers || 0} viewers
                </span>
                <span>{dashboard.widgets || 0} widgets</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => copyShareLink(dashboard)}
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy Link
                </Button>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Share2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No shared dashboards</h3>
          <p className="text-slate-500">Create a dashboard to share with your team</p>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Shared Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Dashboard Name</Label>
              <Input placeholder="Operations Overview" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Real-time operations metrics" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-slate-900">
                Create Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}