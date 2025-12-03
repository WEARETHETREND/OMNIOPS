import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const defaultStatuses = [
  { value: 'active', label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'paused', label: 'Paused', color: 'bg-amber-100 text-amber-700' },
  { value: 'draft', label: 'Draft', color: 'bg-slate-100 text-slate-600' },
  { value: 'archived', label: 'Archived', color: 'bg-slate-100 text-slate-500' },
];

export default function StatusSelect({ 
  value, 
  onChange, 
  statuses = defaultStatuses,
  size = 'sm'
}) {
  const currentStatus = statuses.find(s => s.value === value) || statuses[0];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger 
        className={cn(
          "border-0 font-medium",
          currentStatus.color,
          size === 'sm' ? 'h-7 text-xs px-2 w-24' : 'h-8 text-sm px-3 w-28'
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map(status => (
          <SelectItem key={status.value} value={status.value}>
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", status.color.replace('text-', 'bg-').split(' ')[0])} />
              {status.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}