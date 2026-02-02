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
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function Copilot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Gather context from backend
      const [workflows, runs, alerts, financial] = await Promise.all([
        getWorkflows(),
        getRecentRuns(),
        getAlerts(),
        getFinancial()
      ]);

      // Build context for AI
      const contextPrompt = `You are an AI assistant for OpsVanta operations platform. Here's the current system state:

WORKFLOWS: ${JSON.stringify(workflows.slice(0, 5))}
RECENT RUNS: ${JSON.stringify(runs.slice(0, 10))}
ALERTS: ${JSON.stringify(alerts)}
FINANCIAL: ${JSON.stringify(financial)}

User question: ${input}

Provide a helpful, concise response based on this data.`;

      const user = await base44.auth.me().catch(() => ({ email: 'guest' }));
      
      const aiResponse = await safePost('/api/ai/chat', {
        user: user.email,
        prompt: contextPrompt
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse.ok ? (aiResponse.data.reply || 'No response') : 'Unable to connect to AI service.'
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
    const res = await safeGet('/api/workflows');
    return res.ok ? (res.data.workflows || res.data || []).slice(0, 10) : [];
  };

  const getRecentRuns = async () => {
    const res = await safeGet('/api/runs', { limit: 20 });
    return res.ok ? (res.data.runs || res.data || []).slice(0, 20) : [];
  };

  const getAlerts = async () => {
    const res = await safeGet('/api/alerts', { status: 'active' });
    return res.ok ? (res.data.alerts || res.data || []).slice(0, 10) : [];
  };

  const getFinancial = async () => {
    const res = await safeGet('/api/money/now');
    return res.ok ? res.data : null;
  };

  const executeAction = async (action) => {
    if (action.type === 'run_workflow' && action.workflow_id) {
      const res = await safePost(`/api/workflows/${action.workflow_id}/run`, {});
      const msg = res.ok ? `✅ Workflow started successfully` : `❌ Failed to start workflow`;
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
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
                <div className="flex gap-2 ml-11">
                  {msg.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant="outline"
                      onClick={() => executeAction(action)}
                      className="text-xs"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {action.label || 'Execute'}
                    </Button>
                  ))}
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
    </div>
  );
}