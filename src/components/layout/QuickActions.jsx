import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Zap, FileText, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  { icon: Plus, label: 'New Workflow', href: 'WorkflowBuilder', color: 'text-emerald-400 hover:bg-emerald-500/10' },
  { icon: Zap, label: 'Quick Action', href: 'Automations', color: 'text-amber-400 hover:bg-amber-500/10' },
  { icon: FileText, label: 'View Reports', href: 'Analytics', color: 'text-blue-400 hover:bg-blue-500/10' },
];

export default function QuickActions() {
  return (
    <div className="px-4 py-3 border-t border-slate-800">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-2">Quick Actions</p>
      <div className="space-y-1">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={createPageUrl(action.href)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
              action.color
            )}
          >
            <action.icon className="w-4 h-4" />
            <span className="text-slate-300">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}