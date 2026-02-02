import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Zap,
  Play,
  MoreVertical,
  TrendingUp,
  Clock,
  BarChart2,
  Grid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function Workflows() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: 'operations',
    trigger_type: 'manual',
    status: 'draft',
    priority: 'medium'
  });

  const queryClient = useQueryClient();

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => base44.entities.Workflow.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Workflow.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['workflows']);
      setShowCreateDialog(false);
      setFormData({
        name: '',
        description: '',
        department: 'operations',
        trigger_type: 'manual',
        status: 'draft',
        priority: 'medium'
      });
      toast.success('Workflow created successfully');
    },
  });

  const filteredWorkflows = workflows.filter(w => 
    w.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    paused: workflows.filter(w => w.status === 'paused').length,
    drafts: workflows.filter(w => w.status === 'draft').length,
  };

  const handleCreate = () => {
    const payload = {
      ...formData,
      run_count: 0,
      success_rate: 0,
      steps: []
    };
    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workflows</h1>
          <p className="text-sm text-slate-500">Wednesday, December 4, 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to={createPageUrl('WorkflowBuilder')}>
            <Button variant="outline" size="sm">
              <Grid className="w-4 h-4 mr-2" />
              Visual Builder
            </Button>
          </Link>
          <Button onClick={() => setShowCreateDialog(true)} size="sm" className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Quick Create
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>🏠</span>
        <span>/</span>
        <span className="text-slate-900">Workflows</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 rounded-full bg-slate-900" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Workflows</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 rounded-full bg-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 rounded-full bg-amber-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.paused}</p>
              <p className="text-xs text-slate-500">Paused</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 rounded-full bg-slate-400" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.drafts}</p>
              <p className="text-xs text-slate-500">Drafts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option>All Departments</option>
          <option>HR</option>
          <option>Finance</option>
          <option>IT</option>
        </select>
        <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Paused</option>
        </select>
        <div className="flex items-center border border-slate-200 rounded-lg">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>



      {/* Workflows Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredWorkflows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredWorkflows.map(w => (
            <WorkflowCard key={w.id} workflow={w} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200/60">
          <Zap className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">No workflows found</h3>
          <p className="text-sm text-slate-500 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Create your first workflow'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateDialog(true)} size="sm" className="bg-slate-900">
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          )}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Workflow Name *</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Invoice Processing"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What does this workflow do?"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department *</Label>
                <Select value={formData.department} onValueChange={(v) => setFormData({...formData, department: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="customer_service">Customer Service</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Trigger Type *</Label>
                <Select value={formData.trigger_type} onValueChange={(v) => setFormData({...formData, trigger_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="event_based">Event Based</SelectItem>
                    <SelectItem value="api_triggered">API Triggered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!formData.name || !formData.department || !formData.trigger_type || createMutation.isPending}
              className="bg-slate-900"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Workflow'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WorkflowCard({ workflow }) {
  const trendData = [
    { value: 12 },
    { value: 19 },
    { value: 15 },
    { value: 25 },
    { value: 22 },
    { value: 30 },
    { value: 28 },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-5 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          workflow.status === 'active' ? 'bg-emerald-100' :
          workflow.status === 'paused' ? 'bg-amber-100' :
          'bg-slate-100'
        }`}>
          <Zap className={`w-5 h-5 ${
            workflow.status === 'active' ? 'text-emerald-600' :
            workflow.status === 'paused' ? 'text-amber-600' :
            'text-slate-600'
          }`} />
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
          workflow.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
          workflow.status === 'paused' ? 'bg-amber-100 text-amber-700' :
          'bg-slate-100 text-slate-600'
        }`}>
          <div className={`w-1 h-1 rounded-full ${
            workflow.status === 'active' ? 'bg-emerald-500' :
            workflow.status === 'paused' ? 'bg-amber-500' :
            'bg-slate-400'
          }`} />
          {workflow.status}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="font-semibold text-slate-900 mb-2 text-sm">{workflow.name}</h3>
      <p className="text-xs text-slate-500 mb-4 line-clamp-2">
        {workflow.description || 'Extracts data from invoices and updates accounting systems automatically'}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-xs text-slate-500">Runs</p>
          <p className="text-base font-bold text-slate-900">{workflow.run_count || 567}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Success</p>
          <p className="text-base font-bold text-emerald-600">
            {typeof workflow.successRate === 'number' ? `${Math.round(workflow.successRate * 100)}%` : '97.8%'}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Avg Time</p>
          <p className="text-base font-bold text-slate-900">
            {typeof workflow.avgDurationMs === 'number' ? `${Math.round(workflow.avgDurationMs / 1000)}s` : '28s'}
          </p>
        </div>
      </div>

      {/* Trend */}
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={40}>
          <LineChart data={trendData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-emerald-600 font-medium mt-1">↗ +45% 7-day trend</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link to={createPageUrl('WorkflowBuilder')} className="flex-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
          >
            <Play className="w-3 h-3 mr-1" />
            Configure
          </Button>
        </Link>
        <Button variant="ghost" size="sm" className="px-2">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}