import React from 'react';
import { toast } from 'sonner';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function showUndoToast(message, onUndo, duration = 5000) {
  toast(
    <div className="flex items-center justify-between gap-4 w-full">
      <span>{message}</span>
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-xs"
        onClick={() => {
          onUndo();
          toast.dismiss();
        }}
      >
        <Undo2 className="w-3 h-3 mr-1" />
        Undo
      </Button>
    </div>,
    {
      duration,
      className: 'pr-2'
    }
  );
}