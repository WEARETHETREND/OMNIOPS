import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  Megaphone,
  Plus,
  Search,
  TrendingUp,
  Eye,
  MousePointer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Marketing() {
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCampaigns = async () => {
    setLoading(true);
    const r = await safeGet('/marketing/campaigns');
    if (r.ok) setCampaigns(r.data.campaigns || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const filtered = campaigns.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    impressions: campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketing</h1>
          <p className="text-slate-500 mt-1">Campaigns, analytics, and automation</p>
        </div>
        <Button className="bg-slate-900">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
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
      {loading ? (
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
              <p className="text-sm text-slate-600 mb-4">{campaign.description}</p>
              
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

              {campaign.ctr !== undefined && (
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
          <p className="text-slate-500">Launch your first marketing campaign</p>
        </div>
      )}
    </div>
  );
}