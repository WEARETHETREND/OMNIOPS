import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff,
  Sparkles,
  Calendar,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Zap,
  Loader2,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

const suggestedCommands = [
  { icon: Calendar, text: "Schedule John for the Smith job tomorrow at 9am", category: "Scheduling" },
  { icon: Users, text: "Who's available this Friday afternoon?", category: "Crew" },
  { icon: TrendingUp, text: "Show me revenue forecast for next month", category: "Analytics" },
  { icon: MapPin, text: "Optimize today's routes for Team A", category: "Routing" },
  { icon: FileText, text: "Create an estimate for HVAC installation at 123 Main St", category: "Sales" },
  { icon: DollarSign, text: "What's the profit margin on the Johnson project?", category: "Finance" },
];

const actionTypes = {
  schedule: { icon: Calendar, color: 'bg-blue-100 text-blue-700' },
  crew: { icon: Users, color: 'bg-violet-100 text-violet-700' },
  analytics: { icon: TrendingUp, color: 'bg-emerald-100 text-emerald-700' },
  routing: { icon: MapPin, color: 'bg-amber-100 text-amber-700' },
  estimate: { icon: FileText, color: 'bg-cyan-100 text-cyan-700' },
  finance: { icon: DollarSign, color: 'bg-green-100 text-green-700' },
};

export default function AICopilot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your OmniOps AI Copilot. I can help you schedule jobs, manage crews, analyze data, optimize routes, and more. Just tell me what you need in plain English.",
      actions: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are OmniOps AI Copilot, an intelligent assistant for field service management software.
        
User request: "${userMessage}"

Analyze the request and respond with:
1. A helpful response addressing their request
2. Any specific actions you would take (scheduling, creating estimates, analyzing data, etc.)
3. Relevant insights or suggestions

Be conversational but efficient. If you can perform an action, describe what you're doing.
Format your response in markdown for readability.`,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string" }
                }
              }
            },
            insights: { type: "array", items: { type: "string" } }
          }
        }
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.response,
        actions: response.actions || [],
        insights: response.insights || []
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I encountered an issue processing that request. Please try again or rephrase your question.",
        actions: []
      }]);
    }

    setIsLoading(false);
  };

  const handleVoice = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  const handleSuggestion = (text) => {
    setInput(text);
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-7 h-7 text-violet-600" />
            AI Copilot
          </h1>
          <p className="text-slate-500">Natural language commands for OmniOps</p>
        </div>
        <Badge className="bg-violet-100 text-violet-700">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by AI
        </Badge>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/60 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, i) => (
            <div key={i} className={cn("flex", message.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.role === 'user' 
                  ? "bg-slate-900 text-white" 
                  : "bg-slate-100 text-slate-900"
              )}>
                {message.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm max-w-none prose-slate">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
                
                {/* Actions */}
                {message.actions?.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                    <p className="text-xs font-medium text-slate-500">Actions Performed:</p>
                    {message.actions.map((action, j) => {
                      const config = actionTypes[action.type] || actionTypes.schedule;
                      const Icon = config.icon;
                      return (
                        <div key={j} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs", config.color)}>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{action.description}</span>
                          <CheckCircle className="w-3.5 h-3.5 ml-auto" />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Insights */}
                {message.insights?.length > 0 && (
                  <div className="mt-3 space-y-1 border-t border-slate-200 pt-3">
                    <p className="text-xs font-medium text-slate-500">💡 Insights:</p>
                    {message.insights.map((insight, j) => (
                      <p key={j} className="text-xs text-slate-600">• {insight}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                <span className="text-sm text-slate-600">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <p className="text-xs text-slate-500 mb-2">Try saying:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedCommands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(cmd.text)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-xs text-slate-600 transition-colors"
                >
                  <cmd.icon className="w-3 h-3" />
                  {cmd.text.slice(0, 40)}...
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoice}
              className={cn(isListening && "bg-rose-50 border-rose-200 text-rose-600")}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tell me what you need..."
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}