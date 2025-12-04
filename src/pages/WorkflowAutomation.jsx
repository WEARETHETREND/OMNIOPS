import React, { useState } from 'react';
import { 
  Zap,
  Plus,
  Play,
  Pause,
  Settings,
  ChevronRight,
  Mail,
  Bell,
  Calendar,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Copy,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const triggers = [
  { id: 'job_complete', label: 'Job Completed', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700' },
  { id: 'estimate_sent', label: 'Estimate Sent', icon: FileText, color: 'bg-blue-100 text-blue-700' },
  { id: 'invoice_overdue', label: 'Invoice Overdue', icon: AlertTriangle, color: 'bg-amber-100 text-amber-700' },
  { id: 'appointment_scheduled', label: 'Appointment Scheduled', icon: Calendar, color: 'bg-violet-100 text-violet-700' },
  { id: 'customer_created', label: 'New Customer', icon: Users, color: 'bg-cyan-100 text-cyan-700' },
  { id: 'time_based', label: 'Time/Schedule', icon: Clock, color: 'bg-slate-100 text-slate-700' },
];

const actions = [
  { id: 'send_email', label: 'Send Email', icon: Mail },
  { id: 'send_notification', label: 'Send Notification', icon: Bell },
  { id: 'create_task', label: 'Create Task', icon: CheckCircle },
  { id: 'schedule_followup', label: 'Schedule Follow-up', icon: Calendar },
  { id: 'update_status', label: 'Update Status', icon: Settings },
  { id: 'assign_user', label: 'Assign to User', icon: Users },
];

const sampleAutomations = [
  {
    id: 1,
    name: 'Job Completion Workflow',
    description: 'Send invoice and request review when job completes',
    trigger: 'job_complete',
    actions: ['send_email', 'create_task', 'schedule_followup'],
    active: true,
    runs: 156,
    lastRun: '2 hours ago'
  },
  {
    id: 2,
    name: 'Overdue Invoice Reminder',
    description: 'Auto-send reminders for overdue invoices',
    trigger: 'invoice_overdue',
    actions: ['send_email', 'send_notification'],
    active: true,
    runs: 42,
    lastRun: '1 day ago'
  },
  {
    id: 3,
    name: 'New Customer Welcome',
    description: 'Send welcome email and create onboarding tasks',
    trigger: 'customer_created',
    actions: ['send_email', 'create_task'],
    active: false,
    runs: 89,
    lastRun: '3 days ago'
  },
  {
    id: 4,
    name: 'Appointment Confirmation',
    description: 'Send confirmation and reminder 24h before',
    trigger: 'appointment_scheduled',
    actions: ['send_email', 'send_notification'],
    active: true,
    runs: 324,
    lastRun: '30 min ago'
  },
];

export default function WorkflowAutomation() {
  const [automations, setAutomations] = useState(sampleAutomations);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    trigger: '',
    actions: [],
    conditions: []
  });

  const toggleAutomation = (id) => {
    setAutomations(prev => prev.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
  };

  const getTriggerConfig = (triggerId) => triggers.find(t => t.id === triggerId);
  const getActionConfig = (actionId) => actions.find(a => a.id === actionId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-7 h-7 text-amber-500" />
            Workflow Automation
          </h1>
          <p className="text-slate-500">Visual trigger builder for automated workflows</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Automations', value: automations.filter(a => a.active).length, color: 'bg-emerald-500' },
          { label: 'Total Runs Today', value: '47', color: 'bg-blue-500' },
          { label: 'Time Saved', value: '12.5h', color: 'bg-violet-500' },
          { label: 'Success Rate', value: '99.2%', color: 'bg-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-8 rounded-full", stat.color)} />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Automation Templates */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
        <h3 className="font-semibold text-amber-900 mb-3">Quick Start Templates</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            'Job Complete → Invoice → Review Request',
            'Estimate Accepted → Schedule Job',
            'Invoice Overdue → 3 Email Sequence',
            'New Lead → Assign Sales Rep',
          ].map((template, i) => (
            <button
              key={i}
              className="px-4 py-2 bg-white rounded-lg border border-amber-200 text-sm text-amber-800 hover:bg-amber-50 whitespace-nowrap"
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {automations.map(automation => {
          const triggerConfig = getTriggerConfig(automation.trigger);
          const TriggerIcon = triggerConfig?.icon || Zap;
          
          return (
            <div 
              key={automation.id}
              className={cn(
                "bg-white rounded-xl border p-5 transition-all",
                automation.active ? "border-slate-200" : "border-slate-100 opacity-60"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", triggerConfig?.color)}>
                    <TriggerIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{automation.name}</h3>
                    <p className="text-sm text-slate-500">{automation.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{automation.runs} runs</span>
                      <span>•</span>
                      <span>Last: {automation.lastRun}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={automation.active}
                    onCheckedChange={() => toggleAutomation(automation.id)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-rose-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Workflow Visual */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm", triggerConfig?.color)}>
                  <TriggerIcon className="w-4 h-4" />
                  {triggerConfig?.label}
                </div>
                {automation.actions.map((actionId, i) => {
                  const actionConfig = getActionConfig(actionId);
                  const ActionIcon = actionConfig?.icon || Zap;
                  return (
                    <React.Fragment key={i}>
                      <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-sm text-slate-700">
                        <ActionIcon className="w-4 h-4" />
                        {actionConfig?.label}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Automation</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label>Automation Name</Label>
              <Input 
                placeholder="e.g., Job Completion Follow-up"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>When this happens (Trigger)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {triggers.map(trigger => {
                  const Icon = trigger.icon;
                  return (
                    <button
                      key={trigger.id}
                      onClick={() => setNewAutomation({ ...newAutomation, trigger: trigger.id })}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border text-left transition-colors",
                        newAutomation.trigger === trigger.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", trigger.color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{trigger.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Then do this (Actions)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {actions.map(action => {
                  const Icon = action.icon;
                  const isSelected = newAutomation.actions.includes(action.id);
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        setNewAutomation({
                          ...newAutomation,
                          actions: isSelected
                            ? newAutomation.actions.filter(a => a !== action.id)
                            : [...newAutomation.actions, action.id]
                        });
                      }}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border text-left transition-colors",
                        isSelected
                          ? "border-amber-500 bg-amber-50"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{action.label}</span>
                      {isSelected && (
                        <Badge className="ml-auto bg-amber-100 text-amber-700 text-xs">
                          {newAutomation.actions.indexOf(action.id) + 1}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button 
                className="bg-amber-500 hover:bg-amber-600"
                disabled={!newAutomation.name || !newAutomation.trigger || newAutomation.actions.length === 0}
              >
                Create Automation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}