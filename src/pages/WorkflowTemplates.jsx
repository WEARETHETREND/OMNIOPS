import React, { useState } from 'react';
import { safePost } from '@/components/api/apiClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Sparkles,
  Search,
  Play,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const templates = [
  {
    id: 'employee-onboarding',
    name: 'Employee Onboarding',
    description: 'Automate new hire paperwork, account creation, and welcome emails',
    category: 'HR',
    nodes: 12,
    color: 'emerald'
  },
  {
    id: 'invoice-processing',
    name: 'Invoice Processing',
    description: 'Extract invoice data, validate, and sync to accounting system',
    category: 'Finance',
    nodes: 8,
    color: 'blue'
  },
  {
    id: 'customer-support',
    name: 'Customer Support Ticket',
    description: 'Route tickets, assign to team, send auto-responses',
    category: 'Support',
    nodes: 10,
    color: 'violet'
  },
  {
    id: 'lead-scoring',
    name: 'Lead Scoring & Routing',
    description: 'Score incoming leads and route to sales reps automatically',
    category: 'Sales',
    nodes: 15,
    color: 'rose'
  },
  {
    id: 'inventory-alert',
    name: 'Inventory Low Stock Alert',
    description: 'Monitor stock levels and alert team when inventory is low',
    category: 'Operations',
    nodes: 6,
    color: 'amber'
  },
  {
    id: 'project-kickoff',
    name: 'Project Kickoff',
    description: 'Create project workspace, assign tasks, notify team',
    category: 'Projects',
    nodes: 14,
    color: 'cyan'
  },
];

export default function WorkflowTemplates() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const useTemplate = async (template) => {
    const r = await safePost('/workflows/from-template', { template_id: template.id });
    if (!r.ok) {
      toast.error(`Failed: ${r.error}`);
    } else {
      toast.success('Template applied! Opening builder...');
      setTimeout(() => {
        window.location.href = createPageUrl('WorkflowBuilder');
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workflow Templates</h1>
          <p className="text-slate-500 mt-1">Pre-built automation templates to get started fast</p>
        </div>
        <Link to={createPageUrl('WorkflowBuilder')}>
          <Button className="bg-slate-900">
            <Sparkles className="w-4 h-4 mr-2" />
            Create From Scratch
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(template => (
          <div key={template.id} className="bg-white rounded-xl border border-slate-200/60 p-6 hover:shadow-lg transition-all">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${template.color}-500 to-${template.color}-600 flex items-center justify-center mb-4`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">{template.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{template.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
              <span className={`px-2 py-1 bg-${template.color}-50 text-${template.color}-700 rounded`}>
                {template.category}
              </span>
              <span>{template.nodes} nodes</span>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => useTemplate(template)}
                className="flex-1 bg-slate-900"
                size="sm"
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                Use Template
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}