import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Clock, 
  Mail, 
  Webhook, 
  Database, 
  GitBranch, 
  Bell, 
  Zap,
  FileText,
  Users,
  Calculator,
  Filter,
  Repeat,
  CheckCircle,
  AlertTriangle,
  Globe
} from 'lucide-react';

const nodeIcons = {
  trigger: Play,
  schedule: Clock,
  email: Mail,
  webhook: Webhook,
  database: Database,
  condition: GitBranch,
  notification: Bell,
  action: Zap,
  document: FileText,
  user: Users,
  calculate: Calculator,
  filter: Filter,
  loop: Repeat,
  approval: CheckCircle,
  alert: AlertTriangle,
  api: Globe
};

const nodeColors = {
  trigger: 'from-emerald-500 to-teal-600',
  schedule: 'from-blue-500 to-indigo-600',
  email: 'from-pink-500 to-rose-600',
  webhook: 'from-orange-500 to-red-600',
  database: 'from-violet-500 to-purple-600',
  condition: 'from-amber-500 to-orange-600',
  notification: 'from-cyan-500 to-blue-600',
  action: 'from-emerald-500 to-cyan-600',
  document: 'from-slate-500 to-slate-600',
  user: 'from-indigo-500 to-violet-600',
  calculate: 'from-green-500 to-emerald-600',
  filter: 'from-yellow-500 to-amber-600',
  loop: 'from-teal-500 to-cyan-600',
  approval: 'from-emerald-500 to-green-600',
  alert: 'from-rose-500 to-red-600',
  api: 'from-blue-500 to-cyan-600'
};

export default function WorkflowNode({ 
  node, 
  isSelected, 
  isConnecting,
  onSelect, 
  onMove,
  onStartConnect,
  onEndConnect
}) {
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const Icon = nodeIcons[node.type] || Zap;
  const gradient = nodeColors[node.type] || nodeColors.action;

  const handleMouseDown = (e) => {
    if (e.target.closest('.connect-handle')) return;
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    };
    onSelect();

    const handleMouseMove = (e) => {
      onMove({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={nodeRef}
      className={cn(
        "absolute w-60 bg-slate-800 rounded-xl border-2 transition-all cursor-move select-none",
        isSelected ? "border-emerald-500 shadow-lg shadow-emerald-500/20" : "border-slate-700 hover:border-slate-600",
        isDragging && "opacity-80",
        isConnecting && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900"
      )}
      style={{ left: node.position.x, top: node.position.y }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Input handle */}
      {node.type !== 'trigger' && (
        <div 
          className="connect-handle absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-600 hover:border-cyan-400 hover:bg-cyan-500/20 cursor-crosshair flex items-center justify-center transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEndConnect();
          }}
        >
          <div className="w-2 h-2 rounded-full bg-slate-500" />
        </div>
      )}

      {/* Output handle */}
      <div 
        className="connect-handle absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-600 hover:border-emerald-400 hover:bg-emerald-500/20 cursor-crosshair flex items-center justify-center transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onStartConnect();
        }}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>

      {/* Node content */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", gradient)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{node.name}</p>
            <p className="text-xs text-slate-400 capitalize">{node.type}</p>
          </div>
        </div>
        {node.config?.description && (
          <p className="mt-2 text-xs text-slate-500 line-clamp-2">{node.config.description}</p>
        )}
      </div>
    </div>
  );
}