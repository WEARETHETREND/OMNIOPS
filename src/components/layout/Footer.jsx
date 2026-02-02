import React from 'react';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/50 px-6 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-500" />
          <span>OpsVanta Enterprise AI Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <span>© 2026 OpsVanta</span>
          <span className="hidden md:inline">•</span>
          <button className="hover:text-slate-700">Documentation</button>
          <span className="hidden md:inline">•</span>
          <button className="hover:text-slate-700">Support</button>
          <span className="hidden md:inline">•</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">v2.0.1</span>
        </div>
      </div>
    </footer>
  );
}