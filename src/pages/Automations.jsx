import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bot,
  Users,
  ShoppingCart,
  Layers,
  Clock,
  FileText,
  Mic,
  TrendingDown,
  UserPlus,
  Phone,
  Plus,
  Search,
  Play,
  Pause,
  Zap,
  CheckCircle,
  Timer,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const automationTemplates = [
  {
    type: 'worker_assignment',
    name: 'Auto-Assign Workers',
    description: 'Automatically assign the best available worker to new jobs based on skills, location, and workload',
    icon: Users,
    color: 'from-blue-500 to-indigo-600',
    trigger: 'event',
    time_saved_hours: 2
  },
  {
    type: 'purchase_orders',
    name: 'Auto-Generate Purchase Orders',
    description: 'Create purchase orders when inventory drops below threshold or for job-specific materials',
    icon: ShoppingCart,
    color: 'from-emerald-500 to-teal-600',
    trigger: 'event',
    time_saved_hours: 3
  },
  {
    type: 'job_batching',
    name: 'Auto-Batch Small Jobs',
    description: 'Group nearby small jobs together to optimize routes and technician time',
    icon: Layers,
    color: 'from-violet-500 to-purple-600',
    trigger: 'scheduled',
    schedule: 'Daily at 6:00 AM',
    time_saved_hours: 4
  },
  {
    type: 'schedule_adjustment',
    name: 'Auto-Adjust for Traffic',
    description: 'Dynamically adjust schedules based on real-time traffic conditions and ETAs',
    icon: Clock,
    color: 'from-amber-500 to-orange-600',
    trigger: 'realtime',
    time_saved_hours: 1.5
  },
  {
    type: 'report_generation',
    name: 'Daily Ops Report',
    description: 'Generate and distribute daily operations summary with KPIs, issues, and recommendations',
    icon: FileText,
    color: 'from-cyan-500 to-blue-600',
    trigger: 'scheduled',
    schedule: 'Daily at 7:00 PM',
    time_saved_hours: 1
  },
  {
    type: 'voice_to_notes',
    name: 'Voice to Job Notes',
    description: 'Transcribe and structure technician voice recordings into formatted job notes',
    icon: Mic,
    color: 'from-pink-500 to-rose-600',
    trigger: 'event',
    time_saved_hours: 2
  },
  {
    type: 'failure_analysis',
    name: 'Failure Pattern Analysis',
    description: 'Analyze job failures to identify trends, root causes, and preventive recommendations',
    icon: TrendingDown,
    color: 'from-rose-500 to-red-600',
    trigger: 'scheduled',
    schedule: 'Weekly on Monday',
    time_saved_hours: 5
  },
  {
    type: 'employee_onboarding',
    name: 'Auto-Onboard Employees',
    description: 'Automate new employee setup: accounts, training assignments, equipment allocation',
    icon: UserPlus,
    color: 'from-green-500 to-emerald-600',
    trigger: 'event',
    time_saved_hours: 8
  },
  {
    type: 'call_summarization',
    name: 'Call Summarization',
    description: 'Automatically summarize customer calls with action items and sentiment analysis',
    icon: Phone,
    color: 'from-indigo-500 to-violet-600',
    trigger: 'event',
    time_saved_hours: 1.5
  }
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  paused: { label: 'Paused', color: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
  draft: { label: 'Draft', color: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' }
};

export default function Automations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const queryClient = useQueryClient();

  const { data: automations = [], isLoading } = useQuery({
    queryKey: ['automations'],
    queryFn: () => base44.entities.Automation.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Automation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      setIsCreateOpen(false);
      setSelectedTemplate(null);
      toast.success('Automation created');
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Automation.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast.success('Automation updated');
    }
  });

  const handleToggle = (automation) => {
    const newStatus = automation.status === 'active' ? 'paused' : 'active';
    toggleMutation.mutate({ id: automation.id, status: newStatus });
  };

  const handleCreateFromTemplate = (template) => {
    setSelectedTemplate(template);
    setIsCreateOpen(true);
  };

  const handleCreate = () => {
    if (!selectedTemplate) return;
    createMutation.mutate({
      name: selectedTemplate.name,
      description: selectedTemplate.description,
      type: selectedTemplate.type,
      trigger: selectedTemplate.trigger,
      schedule: selectedTemplate.schedule || '',
      status: 'draft',
      time_saved_hours: selectedTemplate.time_saved_hours,
      run_count: 0,
      success_rate: 100
    });
  };

  const filteredAutomations = automations.filter(a =>
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: automations.length,
    active: automations.filter(a => a.status === 'active').length,
    totalRuns: automations.reduce((acc, a) => acc + (a.run_count || 0), 0),
    hoursSaved: automations.filter(a => a.status === 'active').reduce((acc, a) => acc + (a.time_saved_hours || 0) * (a.run_count || 0), 0)
  };

  const getTemplateIcon = (type) => {
    const template = automationTemplates.find(t => t.type === type);
    return template?.icon || Bot;
  };

  const getTemplateColor = (type) => {
    const template = automationTemplates.find(t => t.type === type);
    return template?.color || 'from-slate-500 to-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Automations', value: stats.total, icon: Bot, color: 'from-slate-500 to-slate-700' },
          { label: 'Active', value: stats.active, icon: Zap, color: 'from-emerald-500 to-teal-600' },
          { label: 'Total Runs', value: stats.totalRuns.toLocaleString(), icon: CheckCircle, color: 'from-blue-500 to-indigo-600' },
          { label: 'Hours Saved', value: stats.hoursSaved.toFixed(0), icon: Timer, color: 'from-violet-500 to-purple-600' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Automation Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {automationTemplates.map(template => {
              const Icon = template.icon;
              const isCreated = automations.some(a => a.type === template.type);
              return (
                <div
                  key={template.type}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    isCreated ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer"
                  )}
                  onClick={() => !isCreated && handleCreateFromTemplate(template)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0", template.color)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 truncate">{template.name}</h4>
                        {isCreated && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{template.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span className="capitalize">{template.trigger}</span>
                        <span>~{template.time_saved_hours}h saved/run</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* My Automations */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">My Automations</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search automations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : filteredAutomations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAutomations.map(automation => {
            const Icon = getTemplateIcon(automation.type);
            const gradient = getTemplateColor(automation.type);
            const status = statusConfig[automation.status] || statusConfig.draft;
            
            return (
              <Card key={automation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", gradient)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{automation.name}</h3>
                        <Badge className={cn("mt-1", status.badge)}>{status.label}</Badge>
                      </div>
                    </div>
                    <Switch
                      checked={automation.status === 'active'}
                      onCheckedChange={() => handleToggle(automation)}
                    />
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{automation.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900">{automation.run_count || 0}</p>
                      <p className="text-xs text-slate-400">Runs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900">{automation.success_rate || 100}%</p>
                      <p className="text-xs text-slate-400">Success</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900">{automation.time_saved_hours || 0}h</p>
                      <p className="text-xs text-slate-400">Saved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Bot className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No automations yet</h3>
            <p className="text-slate-500">Select a template above to create your first automation</p>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Automation</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center", selectedTemplate.color)}>
                  <selectedTemplate.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedTemplate.name}</h3>
                  <p className="text-sm text-slate-500">{selectedTemplate.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Trigger</p>
                  <p className="font-medium text-slate-900 capitalize">{selectedTemplate.trigger}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Est. Time Saved</p>
                  <p className="font-medium text-slate-900">{selectedTemplate.time_saved_hours} hours/run</p>
                </div>
              </div>
              
              {selectedTemplate.schedule && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Schedule</p>
                  <p className="font-medium text-slate-900">{selectedTemplate.schedule}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Automation'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}