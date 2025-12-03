import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const colors = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
];

export default function CollaboratorAvatars({ 
  collaborators = [], 
  maxVisible = 4,
  size = 'md',
  showOnlineStatus = true 
}) {
  const visible = collaborators.slice(0, maxVisible);
  const remaining = collaborators.length - maxVisible;

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {visible.map((collaborator, i) => (
          <Tooltip key={collaborator.id || i}>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar className={cn(
                  "border-2 border-white",
                  sizeClasses[size],
                  colors[i % colors.length]
                )}>
                  <AvatarFallback className={cn("text-white font-medium", colors[i % colors.length])}>
                    {getInitials(collaborator.name)}
                  </AvatarFallback>
                </Avatar>
                {showOnlineStatus && collaborator.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{collaborator.name}</p>
              {collaborator.role && <p className="text-xs text-slate-400">{collaborator.role}</p>}
            </TooltipContent>
          </Tooltip>
        ))}
        
        {remaining > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className={cn(
                "border-2 border-white bg-slate-200",
                sizeClasses[size]
              )}>
                <AvatarFallback className="text-slate-600 font-medium bg-slate-200">
                  +{remaining}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remaining} more collaborator{remaining > 1 ? 's' : ''}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}