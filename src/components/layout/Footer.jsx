import React from 'react';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/50 px-6 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-slate-500">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-500" />
            <span><span className="font-semibold text-slate-700">Omni</span><span className="font-semibold text-orange-500">Ops</span> - Intelligent Decision Control</span>
          </div>
          <div className="text-xs">OmniOps is a product of OpsVanta LLC. © 2026 All rights reserved.</div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-slate-700">Documentation</button>
          <span className="hidden md:inline">•</span>
          <button className="hover:text-slate-700">Support</button>
          <span className="hidden md:inline">•</span>
          <span className="text-xs bg-cyan-500/10 text-cyan-600 px-2 py-0.5 rounded-full font-medium border border-cyan-500/20">v2.0.1</span>
        </div>
      </div>
    </footer>
  );
}