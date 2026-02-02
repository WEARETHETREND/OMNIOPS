import React, { useState } from 'react';
import { safeGet, safePost } from '@/components/api/apiClient';
import { base44 } from '@/api/base44Client';
import { 
  Send,
  Bot,
  User,
  Workflow,
  AlertTriangle,
  DollarSign,
  Play,
  Download,
  CheckCircle,
  Settings,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Copilot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Gather context from backend
      const [workflows, runs, alerts, financial, failures, impacts] = await Promise.all([
        getWorkflows(),
        getRecentRuns(),
        getAlerts(),
        getFinancial(),
        getFailureAnalyses(),
        getFinancialImpacts()
      ]);

      // Build context for AI
      const contextPrompt = `You are an AI assistant for OpsVanta operations platform with action execution capabilities. 

CURRENT SYSTEM STATE:
WORKFLOWS: ${JSON.stringify(workflows.slice(0, 5))}
RECENT RUNS: ${JSON.stringify(runs.slice(0, 10))}
ALERTS: ${JSON.stringify(alerts)}
FINANCIAL: ${JSON.stringify(financial)}
ACTIVE FAILURES: ${JSON.stringify(failures.slice(0, 5))}
FINANCIAL IMPACTS: ${JSON.stringify(impacts.slice(0, 5))}

AVAILABLE ACTIONS (you can suggest these):
- analyze_failures: Analyze recent failures with AI root cause detection
- calculate_impact: Calculate current financial impact of issues
- recover_failures: Attempt automated failure recovery
- request_export: Request tenant data export for compliance
- request_deletion: Request tenant data deletion for compliance
- approve_request: Approve a compliance request (requires request_id)
- scale_operation: Scale workers for an operation (requires operation_id and scale_factor)
- run_workflow: Execute a workflow (requires workflow_id)

User question: ${input}

If the user wants to perform an action, respond with text AND include a JSON block at the end with format:
ACTIONS: [{"type": "action_type", "params": {...}, "label": "Button Label", "description": "What this will do"}]

Provide a helpful, concise response based on this data.`;

      const user = await base44.auth.me().catch(() => ({ email: 'guest' }));
      
      // Use Base44 InvokeLLM instead of external API
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: contextPrompt
      });

      const reply = aiResponse || 'Unable to generate response.';
      
      // Parse actions from AI response
      let actions = [];
      let cleanContent = reply;
      
      const actionsMatch = reply.match(/ACTIONS:\s*(\[.*?\])/s);
      if (actionsMatch) {
        try {
          actions = JSON.parse(actionsMatch[1]);
          cleanContent = reply.replace(/ACTIONS:\s*\[.*?\]/s, '').trim();
        } catch (e) {
          console.error('Failed to parse actions:', e);
        }
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanContent,
        actions: actions
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }]);
    }

    setLoading(false);
  };

  const getWorkflows = async () => {
    try {
      return await base44.entities.Workflow.list('-updated_date', 10);
    } catch {
      return [];
    }
  };

  const getRecentRuns = async () => {
    try {
      return await base44.entities.Metric.filter({ category: 'performance' }, '-updated_date', 20);
    } catch {
      return [];
    }
  };

  const getAlerts = async () => {
    try {
      return await base44.entities.Alert.filter({ status: 'new' }, '-created_date', 10);
    } catch {
      return [];
    }
  };

  const getFinancial = async () => {
    try {
      const metrics = await base44.entities.Metric.filter({ category: 'cost' }, '-updated_date', 5);
      return {
        burn_rate: metrics.find(m => m.name === 'Burn Rate')?.value || 0,
        total_cost: metrics.find(m => m.name === 'Total Cost')?.value || 0
      };
    } catch {
      return null;
    }
  };

  const getFailureAnalyses = async () => {
    try {
      return await base44.entities.FailureAnalysis.filter({ recovery_status: 'pending' }, '-created_date', 10);
    } catch {
      return [];
    }
  };

  const getFinancialImpacts = async () => {
    try {
      return await base44.entities.FinancialImpact.filter({ status: 'active' }, '-amount_usd', 10);
    } catch {
      return [];
    }
  };

  const getWorkflowOptimizations = async () => {
    try {
      const response = await base44.functions.invoke('analyzeWorkflowOptimizations', {});
      return response.data || { optimizations: [] };
    } catch {
      return { optimizations: [] };
    }
  };

  const confirmAction = (action) => {
    setPendingAction(action);
  };

  const executeAction = async () => {
    if (!pendingAction) return;
    
    const action = pendingAction;
    setPendingAction(null);
    
    setMessages(prev => [...prev, { role: 'assistant', content: `⏳ Executing: ${action.label}...` }]);
    
    try {
      let result;
      
      switch (action.type) {
        case 'request_export':
          result = await safePost('/api/compliance/request', {
            tenant_id: action.params.tenant_id,
            request_type: 'export'
          });
          break;
          
        case 'request_deletion':
          result = await safePost('/api/compliance/request', {
            tenant_id: action.params.tenant_id,
            request_type: 'deletion'
          });
          break;
          
        case 'approve_request':
          result = await safePost(`/api/compliance/requests/${action.params.request_id}/approve`, {
            notes: action.params.notes || 'Approved via AI Copilot'
          });
          break;
          
        case 'scale_operation':
          result = await safePost('/api/operations/scale', {
            operation_id: action.params.operation_id,
            scale_factor: action.params.scale_factor
          });
          break;
          
        case 'run_workflow':
          result = await safePost(`/api/workflows/${action.params.workflow_id}/run`, {});
          break;

        case 'analyze_failures':
          result = await base44.functions.invoke('analyzeFailures', {
            failure_ids: action.params.failure_ids
          });
          break;

        case 'calculate_impact':
          result = await base44.functions.invoke('calculateFinancialImpact', {});
          break;

        case 'recover_failures':
          result = await base44.functions.invoke('autoRecoverFailures', {});
          break;
          
        default:
          result = { ok: false, error: 'Unknown action type' };
      }
      
      const msg = result.ok 
        ? `✅ Success: ${action.label} completed` 
        : `❌ Failed: ${action.label} - ${result.error || 'Unknown error'}`;
      
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Error executing ${action.label}: ${error.message}` 
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">AI Copilot</h1>
        <p className="text-slate-500 mt-1">Ask about your operations, workflows, and system status</p>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200/60 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">How can I help you today?</h3>
            <p className="text-slate-500 max-w-md">
              Ask me about workflows, dispatches, system health, or request summaries and insights.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="space-y-3">
              <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-2xl rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-50 text-slate-900'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 ml-11">
                  {msg.actions.map((action, idx) => {
                    const iconMap = {
                      'request_export': Download,
                      'approve_request': CheckCircle,
                      'scale_operation': TrendingUp,
                      'run_workflow': Play,
                      'analyze_failures': AlertTriangle,
                      'calculate_impact': DollarSign,
                      'recover_failures': Zap
                    };
                    const Icon = iconMap[action.type] || Settings;
                    
                    return (
                      <Button
                        key={idx}
                        size="sm"
                        variant="outline"
                        onClick={() => confirmAction(action)}
                        className="text-xs hover:bg-emerald-50 hover:border-emerald-300"
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {action.label || 'Execute'}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-50 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 bg-white rounded-xl border border-slate-200/60 p-4">
        <div className="flex gap-3">
          <Textarea
            placeholder="Ask me anything about your operations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 min-h-[60px] resize-none"
            disabled={loading}
          />
          <Button 
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.description || 'Are you sure you want to execute this action?'}
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-900">{pendingAction?.label}</p>
                {pendingAction?.params && (
                  <pre className="mt-2 text-xs text-slate-600">
                    {JSON.stringify(pendingAction.params, null, 2)}
                  </pre>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeAction}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Execute
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}