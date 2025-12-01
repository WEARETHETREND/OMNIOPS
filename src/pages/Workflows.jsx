import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Zap,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import WorkflowCard from '@/components/dashboard/WorkflowCard';

const departments = [
  { value: 'all', label: 'All Departments' },
  { value: 'hr', label: 'HR' },
  { value: 'finance', label: 'Finance' },
  { value: 'it', label: 'IT' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
];

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

const triggerTypes = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'event_based', label: 'Event Based' },
  { value: 'manual', label: 'Manual' },
  { value: 'api_triggered', label: 'API Triggered' },
];

export default function Workflows() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    department: 'it',
    trigger_type: 'manual',
    status: 'draft',
    priority: 'medium'
  });

  const queryClient = useQueryClient();

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => base44.entities.Workflow.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Workflow.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setIsCreateOpen(false);
      setNewWorkflow({
        name: '',
        description: '',
        department: 'it',
        trigger_type: 'manual',
        status: 'draft',
        priority: 'medium'
      });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Workflow.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] })
  });

  const handleToggle = (workflow) => {
    const newStatus = workflow.status === 'active' ? 'paused' : 'active';
    toggleMutation.mutate({ id: workflow.id, status: newStatus });
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || workflow.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    paused: workflows.filter(w => w.status === 'paused').length,
    draft: workflows.filter(w => w.status === 'draft').length
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Workflows', value: stats.total, color: 'bg-slate-900' },
          { label: 'Active', value: stats.active, color: 'bg-emerald-500' },
          { label: 'Paused', value: stats.paused, color: 'bg-amber-500' },
          { label: 'Drafts', value: stats.draft, color: 'bg-slate-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-8 rounded-full ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map(d => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Link to={createPageUrl('WorkflowBuilder')}>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
              <Wand2 className="w-4 h-4 mr-2" />
              Visual Builder
            </Button>
          </Link>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Quick Create
          </Button>
        </div>
      </div>

      {/* Workflows Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : filteredWorkflows.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          : "space-y-3"
        }>
          {filteredWorkflows.map(workflow => (
            <WorkflowCard 
              key={workflow.id} 
              workflow={workflow}
              onToggle={handleToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Zap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No workflows found</h3>
          <p className="text-slate-500 mb-6">
            {searchQuery || departmentFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first workflow to start automating'}
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Workflow Name</Label>
              <Input
                placeholder="e.g., Monthly Report Generation"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="What does this workflow do?"
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select 
                  value={newWorkflow.department} 
                  onValueChange={(v) => setNewWorkflow({ ...newWorkflow, department: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.filter(d => d.value !== 'all').map(d => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trigger Type</Label>
                <Select 
                  value={newWorkflow.trigger_type} 
                  onValueChange={(v) => setNewWorkflow({ ...newWorkflow, trigger_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => createMutation.mutate(newWorkflow)}
                disabled={!newWorkflow.name || createMutation.isPending}
                className="bg-slate-900 hover:bg-slate-800"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Workflow'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}