import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus, Trash2, Edit, Play, Code, GitBranch, AlertCircle, CheckCircle
} from 'lucide-react';

const CONDITIONS = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'greater_than', label: '>' },
  { value: 'less_than', label: '<' },
  { value: 'contains', label: 'contains' },
  { value: 'exists', label: 'exists' }
];

const ACTIONS = [
  { value: 'update_field', label: 'Update field' },
  { value: 'send_email', label: 'Send email' },
  { value: 'create_alert', label: 'Create alert' },
  { value: 'call_webhook', label: 'Call webhook' },
  { value: 'execute_function', label: 'Execute function' },
  { value: 'update_status', label: 'Update status' },
  { value: 'branch', label: 'Branch logic' },
  { value: 'loop', label: 'Loop/iterate' }
];

export default function WorkflowRulesBuilder() {
  const queryClient = useQueryClient();
  const [editingRule, setEditingRule] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'event',
    conditions: [{ field: '', condition: 'equals', value: '' }],
    actions: [{ type: 'update_field', config: {} }],
    enabled: true
  });

  const { data: automations = [] } = useQuery({
    queryKey: ['automations'],
    queryFn: () => base44.entities.Automation.list('-created_date', 50)
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Automation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        trigger: 'event',
        conditions: [{ field: '', condition: 'equals', value: '' }],
        actions: [{ type: 'update_field', config: {} }],
        enabled: true
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Automation.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['automations'] })
  });

  const handleAddCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { field: '', condition: 'equals', value: '' }]
    });
  };

  const handleAddAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { type: 'update_field', config: {} }]
    });
  };

  const handleRemoveCondition = (idx) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== idx)
    });
  };

  const handleRemoveAction = (idx) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== idx)
    });
  };

  const handleConditionChange = (idx, key, value) => {
    const newConditions = [...formData.conditions];
    newConditions[idx] = { ...newConditions[idx], [key]: value };
    setFormData({ ...formData, conditions: newConditions });
  };

  const handleActionChange = (idx, key, value) => {
    const newActions = [...formData.actions];
    newActions[idx] = { ...newActions[idx], [key]: value };
    setFormData({ ...formData, actions: newActions });
  };

  const handleSave = () => {
    if (!formData.name) return;
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workflow Rules Builder</h1>
          <p className="text-slate-500 mt-1">Advanced conditional automation without code</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Rule Creator Form */}
      {showForm && (
        <Card className="bg-slate-50 border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Create Automation Rule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-900">Rule Name</label>
                <Input
                  placeholder="e.g., Auto-complete low-value jobs"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-900">Description</label>
                <Textarea
                  placeholder="What does this rule do?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 h-20"
                />
              </div>
            </div>

            {/* Trigger */}
            <div>
              <label className="text-sm font-medium text-slate-900 mb-2 block">Trigger Type</label>
              <Select value={formData.trigger} onValueChange={(value) => setFormData({ ...formData, trigger: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event-based</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditions */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Conditions (If)</h3>
              <div className="space-y-3 mb-3">
                {formData.conditions.map((cond, idx) => (
                  <div key={idx} className="flex gap-2 items-end bg-white p-3 rounded-lg border">
                    <Input
                      placeholder="Field name"
                      value={cond.field}
                      onChange={(e) => handleConditionChange(idx, 'field', e.target.value)}
                      className="flex-1"
                    />
                    <Select value={cond.condition} onValueChange={(value) => handleConditionChange(idx, 'condition', value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Value"
                      value={cond.value}
                      onChange={(e) => handleConditionChange(idx, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCondition(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddCondition}
                className="text-blue-600"
              >
                + Add Condition
              </Button>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Actions (Then)</h3>
              <div className="space-y-3 mb-3">
                {formData.actions.map((action, idx) => (
                  <div key={idx} className="flex gap-2 items-end bg-white p-3 rounded-lg border">
                    <Select value={action.type} onValueChange={(value) => handleActionChange(idx, 'type', value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIONS.map(a => (
                          <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Config details"
                      className="flex-1"
                      onChange={(e) => handleActionChange(idx, 'config', { detail: e.target.value })}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAction(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAction}
                className="text-blue-600"
              >
                + Add Action
              </Button>
            </div>

            {/* Save */}
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={createMutation.isPending}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Rule
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Rules ({automations.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({automations.filter(a => a.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-3">
            {automations.map(rule => (
              <Card key={rule.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{rule.name}</h3>
                        <Badge className={rule.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}>
                          {rule.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{rule.description}</p>

                      <div className="grid grid-cols-3 gap-4 text-xs text-slate-600">
                        <div>
                          <p className="font-medium">Trigger</p>
                          <p>{rule.trigger}</p>
                        </div>
                        <div>
                          <p className="font-medium">Run Count</p>
                          <p>{rule.run_count || 0} times</p>
                        </div>
                        <div>
                          <p className="font-medium">Success Rate</p>
                          <p>{rule.success_rate ? `${rule.success_rate}%` : 'N/A'}</p>
                        </div>
                      </div>

                      {rule.last_run && (
                        <p className="text-xs text-slate-500 mt-2">
                          Last run: {new Date(rule.last_run).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="w-24">
                        <Play className="w-3 h-3 mr-1" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm" className="w-24">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(rule.id)}
                        className="w-24 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {automations.length === 0 && (
              <Card className="text-center py-12">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">No rules yet. Create one to get started!</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {automations.filter(a => a.status === 'active').length === 0 ? (
                <p className="text-slate-500 text-center py-6">No active rules</p>
              ) : (
                <div className="space-y-2">
                  {automations.filter(a => a.status === 'active').map(rule => (
                    <div key={rule.id} className="p-3 border rounded-lg bg-emerald-50">
                      <p className="font-semibold text-slate-900">{rule.name}</p>
                      <p className="text-xs text-slate-600 mt-1">Runs: {rule.run_count || 0} | Success: {rule.success_rate || 'N/A'}%</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {automations.slice(0, 5).map((rule, idx) => (
                  <div key={idx} className="p-3 border rounded-lg text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{rule.name}</span>
                      <Badge className="bg-emerald-100 text-emerald-800">Success</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Executed at {rule.last_run ? new Date(rule.last_run).toLocaleString() : 'Never'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}