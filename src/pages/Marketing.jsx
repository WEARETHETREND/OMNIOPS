import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Megaphone,
  Plus,
  Search,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function Marketing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'email',
    status: 'draft',
    budget: '',
    start_date: '',
    end_date: ''
  });

  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Campaign.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
      setShowCreateDialog(false);
      setFormData({
        name: '',
        description: '',
        type: 'email',
        status: 'draft',
        budget: '',
        start_date: '',
        end_date: ''
      });
    },
  });

  const filtered = campaigns.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    impressions: campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0),
    totalBudget: campaigns.reduce((sum, c) => sum + (c.budget || 0), 0)
  };

  const handleCreate = () => {
    const payload = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      impressions: 0,
      clicks: 0,
      conversions: 0
    };
    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketing</h1>
          <p className="text-slate-500 mt-1">Campaigns, analytics, and automation</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-slate-900">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Total Campaigns</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Total Impressions</p>
          <p className="text-2xl font-bold text-blue-600">{stats.impressions.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-violet-600">${stats.totalBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Campaigns Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-xl border border-slate-200/60 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  campaign.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                  campaign.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {campaign.status}
                </span>
              </div>
              
              <h3 className="font-semibold text-slate-900 mb-2">{campaign.name}</h3>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{campaign.description || 'No description'}</p>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <span className="px-2 py-1 bg-slate-100 rounded">{campaign.type}</span>
                {campaign.budget && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {campaign.budget.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <Eye className="w-3.5 h-3.5" />
                    Impressions
                  </div>
                  <p className="font-semibold text-slate-900">
                    {(campaign.impressions || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <MousePointer className="w-3.5 h-3.5" />
                    Clicks
                  </div>
                  <p className="font-semibold text-slate-900">
                    {(campaign.clicks || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {campaign.ctr !== undefined && campaign.ctr > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-600">CTR:</span>
                  <span className="font-semibold text-emerald-600">{(campaign.ctr * 100).toFixed(2)}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Megaphone className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No campaigns found</h3>
          <p className="text-slate-500 mb-6">Launch your first marketing campaign</p>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-slate-900">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Campaign Name *</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Summer Sale 2026"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Campaign objectives and details..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="ads">Paid Ads</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="seo">SEO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Budget ($)</Label>
              <Input 
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                placeholder="5000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input 
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input 
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!formData.name || createMutation.isPending}
              className="bg-slate-900"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}