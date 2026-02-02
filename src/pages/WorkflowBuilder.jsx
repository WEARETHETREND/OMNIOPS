import React, { useState } from 'react';
import { safePost } from '@/components/api/apiClient';
import { 
  Plus,
  Save,
  Play,
  Zap,
  Database,
  Mail,
  MessageSquare,
  FileText,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const nodeTypes = [
  { id: 'trigger', label: 'Trigger', icon: Zap, color: 'emerald' },
  { id: 'action', label: 'Action', icon: Play, color: 'blue' },
  { id: 'condition', label: 'Condition', icon: Code, color: 'amber' },
  { id: 'database', label: 'Database', icon: Database, color: 'violet' },
  { id: 'email', label: 'Email', icon: Mail, color: 'rose' },
  { id: 'notification', label: 'Notification', icon: MessageSquare, color: 'cyan' },
  { id: 'api', label: 'API Call', icon: FileText, color: 'indigo' },
];

export default function WorkflowBuilder() {
  const [workflow, setWorkflow] = useState({
    name: '',
    description: '',
    nodes: [],
    connections: []
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [saving, setSaving] = useState(false);

  const addNode = (type) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: type.id,
      label: type.label,
      x: 100 + workflow.nodes.length * 50,
      y: 100 + workflow.nodes.length * 30,
      config: {}
    };
    setWorkflow({ ...workflow, nodes: [...workflow.nodes, newNode] });
    setSelectedNode(newNode);
  };

  const saveWorkflow = async () => {
    if (!workflow.name) {
      toast.error('Please enter a workflow name');
      return;
    }
    setSaving(true);
    const r = await safePost('/api/workflows', workflow);
    if (!r.ok) {
      toast.error('Failed to save workflow');
    } else {
      toast.success('Workflow saved successfully');
    }
    setSaving(false);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Sidebar - Node Palette */}
      <div className="w-64 bg-white rounded-xl border border-slate-200/60 p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Components</h3>
        <div className="space-y-2">
          {nodeTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => addNode(type)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-${type.color}-500 hover:bg-${type.color}-50 transition-colors`}
              >
                <div className={`w-8 h-8 rounded-lg bg-${type.color}-100 flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 text-${type.color}-600`} />
                </div>
                <span className="text-sm font-medium text-slate-900">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200/60 p-6 relative overflow-hidden">
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex gap-2 flex-1 max-w-md">
            <Input
              placeholder="Workflow name"
              value={workflow.name}
              onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
              className="bg-white"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={saveWorkflow} disabled={saving} className="bg-slate-900">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Test Run
            </Button>
          </div>
        </div>

        {/* Canvas Grid */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {workflow.nodes.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Start Building</h3>
                <p className="text-slate-500">Drag components from the sidebar to begin</p>
              </div>
            </div>
          ) : (
            <div className="relative h-full p-20">
              {workflow.nodes.map((node, i) => {
                const nodeType = nodeTypes.find(t => t.id === node.type);
                const Icon = nodeType?.icon || Zap;
                return (
                  <div
                    key={node.id}
                    className={`absolute bg-white rounded-xl border-2 p-4 cursor-move shadow-lg ${
                      selectedNode?.id === node.id ? 'border-blue-500' : 'border-slate-200'
                    }`}
                    style={{ left: node.x, top: node.y, width: 200 }}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-slate-700" />
                      <span className="font-medium text-slate-900">{node.label}</span>
                    </div>
                    <p className="text-xs text-slate-500">Node {i + 1}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white rounded-xl border border-slate-200/60 p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Properties</h3>
        {selectedNode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Node Type</Label>
              <Input value={selectedNode.label} disabled />
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">Create Record</SelectItem>
                  <SelectItem value="update">Update Record</SelectItem>
                  <SelectItem value="delete">Delete Record</SelectItem>
                  <SelectItem value="send">Send</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Configuration</Label>
              <Input placeholder="Enter config..." />
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Select a node to edit properties</p>
        )}
      </div>
    </div>
  );
}