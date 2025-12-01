import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const nodeConfigs = {
  trigger: [
    { key: 'description', label: 'Description', type: 'textarea' }
  ],
  schedule: [
    { key: 'frequency', label: 'Frequency', type: 'select', options: ['Every minute', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'Custom'] },
    { key: 'time', label: 'Time', type: 'text', placeholder: '09:00' },
    { key: 'timezone', label: 'Timezone', type: 'select', options: ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'] }
  ],
  email: [
    { key: 'to', label: 'To', type: 'text', placeholder: 'recipient@example.com' },
    { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Email subject' },
    { key: 'body', label: 'Body', type: 'textarea', placeholder: 'Email content...' },
    { key: 'attachments', label: 'Include Attachments', type: 'switch' }
  ],
  webhook: [
    { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'] },
    { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/webhook' },
    { key: 'headers', label: 'Headers', type: 'textarea', placeholder: '{"Authorization": "Bearer ..."}' }
  ],
  database: [
    { key: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Read', 'Update', 'Delete', 'Query'] },
    { key: 'entity', label: 'Entity', type: 'text', placeholder: 'Entity name' },
    { key: 'query', label: 'Query/Data', type: 'textarea', placeholder: '{"field": "value"}' }
  ],
  condition: [
    { key: 'field', label: 'Field', type: 'text', placeholder: 'data.status' },
    { key: 'operator', label: 'Operator', type: 'select', options: ['equals', 'not equals', 'contains', 'greater than', 'less than', 'is empty', 'is not empty'] },
    { key: 'value', label: 'Value', type: 'text', placeholder: 'Expected value' }
  ],
  notification: [
    { key: 'channel', label: 'Channel', type: 'select', options: ['In-app', 'Email', 'Slack', 'SMS', 'Push'] },
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Notification title' },
    { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Notification content...' }
  ],
  api: [
    { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
    { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/endpoint' },
    { key: 'headers', label: 'Headers', type: 'textarea', placeholder: '{"Content-Type": "application/json"}' },
    { key: 'body', label: 'Body', type: 'textarea', placeholder: '{"key": "value"}' }
  ],
  filter: [
    { key: 'field', label: 'Field', type: 'text', placeholder: 'data.items' },
    { key: 'condition', label: 'Condition', type: 'text', placeholder: 'item.active === true' }
  ],
  loop: [
    { key: 'source', label: 'Source Array', type: 'text', placeholder: 'data.items' },
    { key: 'variable', label: 'Item Variable', type: 'text', placeholder: 'item' }
  ],
  calculate: [
    { key: 'expression', label: 'Expression', type: 'text', placeholder: 'data.price * data.quantity' },
    { key: 'output', label: 'Output Variable', type: 'text', placeholder: 'total' }
  ],
  approval: [
    { key: 'approvers', label: 'Approvers', type: 'text', placeholder: 'user@example.com' },
    { key: 'timeout', label: 'Timeout (hours)', type: 'text', placeholder: '24' },
    { key: 'escalate', label: 'Auto-escalate on timeout', type: 'switch' }
  ],
  user: [
    { key: 'assignee', label: 'Assignee', type: 'text', placeholder: 'user@example.com' },
    { key: 'role', label: 'Or Role', type: 'select', options: ['admin', 'manager', 'user'] }
  ],
  alert: [
    { key: 'severity', label: 'Severity', type: 'select', options: ['info', 'warning', 'error', 'critical'] },
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Alert title' },
    { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Alert details...' }
  ],
  document: [
    { key: 'template', label: 'Template', type: 'select', options: ['Invoice', 'Report', 'Contract', 'Custom'] },
    { key: 'format', label: 'Format', type: 'select', options: ['PDF', 'DOCX', 'HTML'] },
    { key: 'data', label: 'Data Mapping', type: 'textarea', placeholder: '{"field": "value"}' }
  ]
};

export default function WorkflowProperties({ node, onUpdate, onDelete, onClose }) {
  if (!node) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-slate-500">Select a node to configure</p>
        </div>
      </div>
    );
  }

  const config = nodeConfigs[node.type] || [];

  const handleChange = (key, value) => {
    onUpdate({
      ...node,
      config: { ...node.config, [key]: value }
    });
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">{node.name}</h3>
          <p className="text-xs text-slate-400 capitalize">{node.type} Configuration</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Node Name</Label>
            <Input
              value={node.name}
              onChange={(e) => onUpdate({ ...node, name: e.target.value })}
              className="mt-1.5 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <Separator className="bg-slate-800" />

          {config.map((field) => (
            <div key={field.key}>
              <Label className="text-slate-300">{field.label}</Label>
              {field.type === 'text' && (
                <Input
                  value={node.config?.[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="mt-1.5 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              )}
              {field.type === 'textarea' && (
                <Textarea
                  value={node.config?.[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="mt-1.5 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
                />
              )}
              {field.type === 'select' && (
                <Select
                  value={node.config?.[field.key] || ''}
                  onValueChange={(value) => handleChange(field.key, value)}
                >
                  <SelectTrigger className="mt-1.5 bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === 'switch' && (
                <div className="mt-1.5 flex items-center gap-2">
                  <Switch
                    checked={node.config?.[field.key] || false}
                    onCheckedChange={(checked) => handleChange(field.key, checked)}
                  />
                  <span className="text-sm text-slate-400">
                    {node.config?.[field.key] ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-800">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => onDelete(node.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}