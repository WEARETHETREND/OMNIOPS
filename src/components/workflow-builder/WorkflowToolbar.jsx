import React from 'react';
import { 
  Save, 
  Play, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  Download,
  Upload,
  Copy,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function WorkflowToolbar({ 
  workflowName, 
  onNameChange, 
  onSave, 
  onRun,
  onExport,
  isSaving,
  isRunning,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) {
  return (
    <TooltipProvider>
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Input
            value={workflowName}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-64 bg-slate-800 border-slate-700 text-white font-medium"
            placeholder="Workflow name..."
          />
          
          <Separator orientation="vertical" className="h-6 bg-slate-700" />
          
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <Undo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onExport}
                className="text-slate-400 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export Workflow</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 bg-slate-700" />

          <Button
            variant="outline"
            onClick={onSave}
            disabled={isSaving}
            className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>

          <Button
            onClick={onRun}
            disabled={isRunning}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Workflow'}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}