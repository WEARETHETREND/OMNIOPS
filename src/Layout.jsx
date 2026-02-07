import * as React from 'react';
import GlobalSearch from './components/search/GlobalSearch';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="font-semibold text-slate-900">Enterprise Ops Platform</div>
          <GlobalSearch className="flex-1 max-w-xl" />
          <div className="w-10"></div>
        </div>
      </div>
      {children}
    </div>
  );
}