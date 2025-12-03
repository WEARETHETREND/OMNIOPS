import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { 
  Search, 
  X, 
  Workflow, 
  Plug, 
  Bell, 
  Users, 
  FileText,
  ArrowRight,
  Command
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const quickLinks = [
  { name: 'Workflows', page: 'Workflows', icon: Workflow },
  { name: 'Integrations', page: 'Integrations', icon: Plug },
  { name: 'Alerts', page: 'Alerts', icon: Bell },
  { name: 'Audit Trail', page: 'AuditTrail', icon: FileText },
  { name: 'Access Control', page: 'AccessControl', icon: Users },
];

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ workflows: [], integrations: [], alerts: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ workflows: [], integrations: [], alerts: [] });
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const [workflows, integrations, alerts] = await Promise.all([
          base44.entities.Workflow.list(),
          base44.entities.Integration.list(),
          base44.entities.Alert.list()
        ]);

        const q = query.toLowerCase();
        setResults({
          workflows: workflows.filter(w => w.name?.toLowerCase().includes(q)).slice(0, 3),
          integrations: integrations.filter(i => i.name?.toLowerCase().includes(q) || i.provider?.toLowerCase().includes(q)).slice(0, 3),
          alerts: alerts.filter(a => a.title?.toLowerCase().includes(q)).slice(0, 3)
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  const hasResults = results.workflows.length > 0 || results.integrations.length > 0 || results.alerts.length > 0;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-2xl mx-auto mt-20 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search workflows, integrations, alerts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 text-lg py-4"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded">
              ESC
            </kbd>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-6 text-center text-slate-500">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto" />
              </div>
            )}

            {!loading && query && hasResults && (
              <div className="p-2">
                {results.workflows.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-2 text-xs font-medium text-slate-400 uppercase">Workflows</p>
                    {results.workflows.map(w => (
                      <Link
                        key={w.id}
                        to={createPageUrl('Workflows')}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Workflow className="w-4 h-4 text-emerald-500" />
                        <span className="flex-1 text-slate-700">{w.name}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </Link>
                    ))}
                  </div>
                )}

                {results.integrations.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-2 text-xs font-medium text-slate-400 uppercase">Integrations</p>
                    {results.integrations.map(i => (
                      <Link
                        key={i.id}
                        to={createPageUrl('Integrations')}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Plug className="w-4 h-4 text-blue-500" />
                        <span className="flex-1 text-slate-700">{i.name}</span>
                        <span className="text-xs text-slate-400">{i.provider}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </Link>
                    ))}
                  </div>
                )}

                {results.alerts.length > 0 && (
                  <div>
                    <p className="px-3 py-2 text-xs font-medium text-slate-400 uppercase">Alerts</p>
                    {results.alerts.map(a => (
                      <Link
                        key={a.id}
                        to={createPageUrl('Alerts')}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Bell className="w-4 h-4 text-amber-500" />
                        <span className="flex-1 text-slate-700">{a.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!loading && query && !hasResults && (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500">No results found for "{query}"</p>
              </div>
            )}

            {!query && (
              <div className="p-4">
                <p className="px-3 py-2 text-xs font-medium text-slate-400 uppercase">Quick Links</p>
                {quickLinks.map(link => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <link.icon className="w-4 h-4 text-slate-400" />
                    <span className="flex-1 text-slate-700">{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border">↵</kbd> to select</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border">ESC</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}