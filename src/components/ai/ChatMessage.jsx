import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Bot, User, Zap, CheckCircle2, AlertCircle, Loader2, ChevronRight, Clock } from 'lucide-react';

const FunctionDisplay = ({ toolCall }) => {
  const [expanded, setExpanded] = useState(false);
  const name = toolCall?.name || 'Function';
  const status = toolCall?.status || 'pending';
  const results = toolCall?.results;

  const parsedResults = (() => {
    if (!results) return null;
    try {
      return typeof results === 'string' ? JSON.parse(results) : results;
    } catch {
      return results;
    }
  })();

  const isError = results && (
    (typeof results === 'string' && /error|failed/i.test(results)) ||
    (parsedResults?.success === false)
  );

  const statusConfig = {
    pending: { icon: Clock, color: 'text-slate-400', text: 'Pending' },
    running: { icon: Loader2, color: 'text-emerald-500', text: 'Running...', spin: true },
    in_progress: { icon: Loader2, color: 'text-emerald-500', text: 'Running...', spin: true },
    completed: isError
      ? { icon: AlertCircle, color: 'text-rose-500', text: 'Failed' }
      : { icon: CheckCircle2, color: 'text-emerald-600', text: 'Done' },
    success: { icon: CheckCircle2, color: 'text-emerald-600', text: 'Done' },
    failed: { icon: AlertCircle, color: 'text-rose-500', text: 'Failed' },
    error: { icon: AlertCircle, color: 'text-rose-500', text: 'Failed' }
  }[status] || { icon: Zap, color: 'text-slate-500', text: '' };

  const Icon = statusConfig.icon;
  const formattedName = name.split('.').pop().replace(/([A-Z])/g, ' $1').trim();

  return (
    <div className="mt-2 text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
          "hover:bg-slate-700/50",
          expanded ? "bg-slate-700/50 border-slate-600" : "bg-slate-800/50 border-slate-700"
        )}
      >
        <Icon className={cn("h-3 w-3", statusConfig.color, statusConfig.spin && "animate-spin")} />
        <span className="text-slate-300">{formattedName}</span>
        {statusConfig.text && (
          <span className={cn("text-slate-500", isError && "text-rose-400")}>
            • {statusConfig.text}
          </span>
        )}
        {!statusConfig.spin && (toolCall.arguments_string || results) && (
          <ChevronRight className={cn("h-3 w-3 text-slate-500 transition-transform ml-auto",
            expanded && "rotate-90")} />
        )}
      </button>

      {expanded && !statusConfig.spin && parsedResults && (
        <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-700">
          <pre className="bg-slate-800/50 rounded-md p-2 text-xs text-slate-400 whitespace-pre-wrap max-h-32 overflow-auto">
            {typeof parsedResults === 'object'
              ? JSON.stringify(parsedResults, null, 2)
              : parsedResults}
          </pre>
        </div>
      )}
    </div>
  );
};

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) return null;

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={cn("max-w-[80%]", isUser && "flex flex-col items-end")}>
        {message.content && (
          <div className={cn(
            "rounded-2xl px-4 py-2.5",
            isUser
              ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white"
              : "bg-slate-800 text-slate-100 border border-slate-700"
          )}>
            {isUser ? (
              <p className="text-sm leading-relaxed">{message.content}</p>
            ) : (
              <ReactMarkdown
                className="text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                components={{
                  code: ({ inline, children }) => (
                    <code className={cn(
                      "px-1 py-0.5 rounded text-xs",
                      inline ? "bg-slate-700 text-emerald-400" : "block bg-slate-900 p-2 my-2"
                    )}>
                      {children}
                    </code>
                  ),
                  p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                  ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
                  li: ({ children }) => <li className="my-0.5">{children}</li>,
                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}

        {message.tool_calls?.length > 0 && (
          <div className="space-y-1 mt-1">
            {message.tool_calls.map((toolCall, idx) => (
              <FunctionDisplay key={idx} toolCall={toolCall} />
            ))}
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      )}
    </div>
  );
}