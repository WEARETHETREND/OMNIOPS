import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Trash2 } from 'lucide-react';

export default function WorkflowProperties({ node, onUpdate, onDelete, onClose }) {
  const [config, setConfig] = useState(node.config || {});

  const handleUpdate = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onUpdate({ config: newConfig });
  };

  const renderConfigFields = () => {
    switch (node.type) {
      case 'webhook':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-slate-300">Webhook URL</Label>
              <Input
                value={config.url || ''}
                onChange={(e) => handleUpdate('url', e.target.value)}
                placeholder="https://api.example.com/webhook"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Method</Label>
              <Select value={config.method || 'POST'} onValueChange={(v) => handleUpdate('method', v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Headers (JSON)</Label>
              <Textarea
                value={config.headers || ''}
                onChange={(e) => handleUpdate('headers', e.target.value)}
                placeholder='{"Authorization": "Bearer token"}'
                className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
              />
            </div>
          </>
        );

      case 'schedule':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-slate-300">Schedule Type</Label>
              <Select value={config.scheduleType || 'cron'} onValueChange={(v) => handleUpdate('scheduleType', v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cron">Cron Expression</SelectItem>
                  <SelectItem value="interval">Interval</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.scheduleType === 'cron' ? (
              <div className="space-y-2">
                <Label className="text-slate-300">Cron Expression</Label>
                <Input
                  value={config.cron || ''}
                  onChange={(e) => handleUpdate('cron', e.target.value)}
                  placeholder="0 0 * * *"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                />
                <p className="text-xs text-slate-500">Example: 0 0 * * * (daily at midnight)</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-slate-300">Interval (minutes)</Label>
                <Input
                  type="number"
                  value={config.interval || 60}
                  onChange={(e) => handleUpdate('interval', parseInt(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            )}
          </>
        );

      case 'email':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-slate-300">To</Label>
              <Input
                value={config.to || ''}
                onChange={(e) => handleUpdate('to', e.target.value)}
                placeholder="user@example.com"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Subject</Label>
              <Input
                value={config.subject || ''}
                onChange={(e) => handleUpdate('subject', e.target.value)}
                placeholder="Email subject"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Body</Label>
              <Textarea
                value={config.body || ''}
                onChange={(e) => handleUpdate('body', e.target.value)}
                placeholder="Email content..."
                className="bg-slate-800 border-slate-700 text-white h-32"
              />
            </div>
          </>
        );

      case 'api':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-slate-300">API Endpoint</Label>
              <Input
                value={config.endpoint || ''}
                onChange={(e) => handleUpdate('endpoint', e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Method</Label>
              <Select value={config.method || 'GET'} onValueChange={(v) => handleUpdate('method', v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Request Body (JSON)</Label>
              <Textarea
                value={config.body || ''}
                onChange={(e) => handleUpdate('body', e.target.value)}
                placeholder='{"key": "value"}'
                className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
              />
            </div>
          </>
        );

      case 'condition':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-slate-300">Condition Type</Label>
              <Select value={config.conditionType || 'equals'} onValueChange={(v) => handleUpdate('conditionType', v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="notEquals">Not Equals</SelectItem>
                  <SelectItem value="greaterThan">Greater Than</SelectItem>
                  <SelectItem value="lessThan">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Field</Label>
              <Input
                value={config.field || ''}
                onChange={(e) => handleUpdate('field', e.target.value)}
                placeholder="status"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Value</Label>
              <Input
                value={config.value || ''}
                onChange={(e) => handleUpdate('value', e.target.value)}
                placeholder="completed"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </>
        );

      case 'database':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-slate-300">Operation</Label>
              <Select value={config.operation || 'create'} onValueChange={(v) => handleUpdate('operation', v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Entity</Label>
              <Input
                value={config.entity || ''}
                onChange={(e) => handleUpdate('entity', e.target.value)}
                placeholder="Dispatch"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Data (JSON)</Label>
              <Textarea
                value={config.data || ''}
                onChange={(e) => handleUpdate('data', e.target.value)}
                placeholder='{"field": "value"}'
                className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
              />
            </div>
          </>
        );

      default:
        return (
          <div className="space-y-2">
            <Label className="text-slate-300">Description</Label>
            <Textarea
              value={config.description || ''}
              onChange={(e) => handleUpdate('description', e.target.value)}
              placeholder="Add description..."
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        );
    }
  };

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold text-white">Properties</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Node Name</Label>
            <Input
              value={node.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Node Type</Label>
            <Input
              value={node.type}
              disabled
              className="bg-slate-800/50 border-slate-700 text-slate-400"
            />
          </div>

          {renderConfigFields()}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-800">
        <Button
          variant="destructive"
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}