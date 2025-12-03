import React, { useState } from 'react';
import { ChevronDown, Plus, Folder, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const defaultProjects = [
  { id: '1', name: 'OmniOps Platform', color: 'bg-emerald-500' },
  { id: '2', name: 'Customer Portal', color: 'bg-blue-500' },
  { id: '3', name: 'Internal Tools', color: 'bg-violet-500' },
];

export default function ProjectSelector({ projects = defaultProjects, onSelect, onCreateNew }) {
  const [selected, setSelected] = useState(projects[0]);

  const handleSelect = (project) => {
    setSelected(project);
    onSelect?.(project);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors text-left">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", selected.color)}>
          <Folder className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{selected.name}</p>
          <p className="text-xs text-slate-500">Current project</p>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => handleSelect(project)}
            className="flex items-center gap-2"
          >
            <div className={cn("w-6 h-6 rounded flex items-center justify-center", project.color)}>
              <Folder className="w-3 h-3 text-white" />
            </div>
            <span className="flex-1">{project.name}</span>
            {selected.id === project.id && <Check className="w-4 h-4 text-emerald-500" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCreateNew} className="text-slate-500">
          <Plus className="w-4 h-4 mr-2" />
          Create New Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}