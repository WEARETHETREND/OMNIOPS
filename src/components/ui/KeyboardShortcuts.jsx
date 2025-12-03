import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

const shortcuts = [
  { keys: ['⌘', 'K'], description: 'Open search', action: 'search' },
  { keys: ['G', 'D'], description: 'Go to Dashboard', action: 'nav', page: 'Dashboard' },
  { keys: ['G', 'W'], description: 'Go to Workflows', action: 'nav', page: 'Workflows' },
  { keys: ['G', 'I'], description: 'Go to Integrations', action: 'nav', page: 'Integrations' },
  { keys: ['G', 'A'], description: 'Go to Alerts', action: 'nav', page: 'Alerts' },
  { keys: ['G', 'S'], description: 'Go to Settings', action: 'nav', page: 'Settings' },
  { keys: ['N'], description: 'New item (context-aware)', action: 'new' },
  { keys: ['?'], description: 'Show shortcuts', action: 'help' },
  { keys: ['Esc'], description: 'Close dialogs', action: 'close' },
];

export default function KeyboardShortcuts({ onSearch, onNew }) {
  const [showHelp, setShowHelp] = useState(false);
  const [lastKey, setLastKey] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      const key = e.key.toLowerCase();

      // G + another key for navigation
      if (lastKey === 'g') {
        e.preventDefault();
        switch (key) {
          case 'd': navigate(createPageUrl('Dashboard')); break;
          case 'w': navigate(createPageUrl('Workflows')); break;
          case 'i': navigate(createPageUrl('Integrations')); break;
          case 'a': navigate(createPageUrl('Alerts')); break;
          case 's': navigate(createPageUrl('Settings')); break;
        }
        setLastKey(null);
        return;
      }

      // Single key shortcuts
      switch (key) {
        case 'g':
          setLastKey('g');
          setTimeout(() => setLastKey(null), 1000);
          break;
        case 'n':
          e.preventDefault();
          onNew?.();
          break;
        case '?':
          e.preventDefault();
          setShowHelp(true);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lastKey, navigate, onNew]);

  return (
    <>
      {lastKey === 'g' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          Press: <kbd className="ml-2 px-1.5 py-0.5 bg-slate-700 rounded">D</kbd> Dashboard
          <kbd className="ml-2 px-1.5 py-0.5 bg-slate-700 rounded">W</kbd> Workflows
          <kbd className="ml-2 px-1.5 py-0.5 bg-slate-700 rounded">I</kbd> Integrations
          <kbd className="ml-2 px-1.5 py-0.5 bg-slate-700 rounded">A</kbd> Alerts
        </div>
      )}

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            {shortcuts.map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-slate-600">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((k, j) => (
                    <kbd key={j} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200">
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}