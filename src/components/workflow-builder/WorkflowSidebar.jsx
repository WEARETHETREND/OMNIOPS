import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Play, Clock, Mail, Webhook, Database, GitBranch, Bell, Zap,
  FileText, Users, Calculator, Filter, Repeat, CheckCircle, AlertTriangle, Globe
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const nodeCategories = [
  {
    name: 'Triggers',
    nodes: [
      { type: 'trigger', name: 'Start', icon: Play, description: 'Workflow entry point' },
      { type: 'schedule', name: 'Schedule', icon: Clock, description: 'Time-based trigger' },
      { type: 'webhook', name: 'Webhook', icon: Webhook, description: 'HTTP webhook trigger' },
    ]
  },
  {
    name: 'Actions',
    nodes: [
      { type: 'email', name: 'Send Email', icon: Mail, description: 'Send an email' },
      { type: 'notification', name: 'Notification', icon: Bell, description: 'Send notification' },
      { type: 'database', name: 'Database', icon: Database, description: 'Database operation' },
      { type: 'api', name: 'API Call', icon: Globe, description: 'External API request' },
      { type: 'document', name: 'Document', icon: FileText, description: 'Generate document' },
    ]
  },
  {
    name: 'Logic',
    nodes: [
      { type: 'condition', name: 'Condition', icon: GitBranch, description: 'If/else branch' },
      { type: 'filter', name: 'Filter', icon: Filter, description: 'Filter data' },
      { type: 'loop', name: 'Loop', icon: Repeat, description: 'Iterate over items' },
      { type: 'calculate', name: 'Calculate', icon: Calculator, description: 'Math operations' },
    ]
  },
  {
    name: 'Approvals',
    nodes: [
      { type: 'approval', name: 'Approval', icon: CheckCircle, description: 'Wait for approval' },
      { type: 'user', name: 'Assign User', icon: Users, description: 'Assign to user' },
      { type: 'alert', name: 'Alert', icon: AlertTriangle, description: 'Create alert' },
    ]
  }
];

const nodeColors = {
  trigger: 'from-emerald-500 to-teal-600',
  schedule: 'from-blue-500 to-indigo-600',
  email: 'from-pink-500 to-rose-600',
  webhook: 'from-orange-500 to-red-600',
  database: 'from-violet-500 to-purple-600',
  condition: 'from-amber-500 to-orange-600',
  notification: 'from-cyan-500 to-blue-600',
  action: 'from-emerald-500 to-cyan-600',
  document: 'from-slate-500 to-slate-600',
  user: 'from-indigo-500 to-violet-600',
  calculate: 'from-green-500 to-emerald-600',
  filter: 'from-yellow-500 to-amber-600',
  loop: 'from-teal-500 to-cyan-600',
  approval: 'from-emerald-500 to-green-600',
  alert: 'from-rose-500 to-red-600',
  api: 'from-blue-500 to-cyan-600'
};

export default function WorkflowSidebar({ onAddNode }) {
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', JSON.stringify(nodeType));
  };

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h3 className="font-semibold text-white">Components</h3>
        <p className="text-xs text-slate-400 mt-1">Drag nodes to the canvas</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {nodeCategories.map((category) => (
            <div key={category.name}>
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                {category.name}
              </h4>
              <div className="space-y-2">
                {category.nodes.map((node) => {
                  const Icon = node.icon;
                  const gradient = nodeColors[node.type];
                  return (
                    <div
                      key={node.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, node)}
                      onClick={() => onAddNode(node)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-all group"
                    >
                      <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center", gradient)}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{node.name}</p>
                        <p className="text-xs text-slate-500 truncate">{node.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}