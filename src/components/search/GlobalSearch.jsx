import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, FileText, User, Briefcase, MapPin, AlertCircle, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';

const entityConfig = {
  Contract: { icon: Briefcase, color: 'bg-blue-100 text-blue-700', page: 'Contracts' },
  Worker: { icon: User, color: 'bg-green-100 text-green-700', page: 'FieldWorker' },
  Workflow: { icon: TrendingUp, color: 'bg-purple-100 text-purple-700', page: 'Workflows' },
  Dispatch: { icon: MapPin, color: 'bg-orange-100 text-orange-700', page: 'Dispatches' },
  Alert: { icon: AlertCircle, color: 'bg-red-100 text-red-700', page: 'Alerts' },
  Project: { icon: FileText, color: 'bg-indigo-100 text-indigo-700', page: 'Projects' }
};

export default function GlobalSearch({ className }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchEntities = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchPromises = Object.keys(entityConfig).map(async (entityName) => {
          try {
            const data = await base44.entities[entityName].list();
            const filtered = data.filter(item => {
              const searchFields = Object.values(item).join(' ').toLowerCase();
              return searchFields.includes(query.toLowerCase());
            }).slice(0, 3);
            return filtered.map(item => ({ ...item, _entityType: entityName }));
          } catch (error) {
            return [];
          }
        });

        const allResults = await Promise.all(searchPromises);
        setResults(allResults.flat().slice(0, 10));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchEntities, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleResultClick = (result) => {
    const config = entityConfig[result._entityType];
    navigate(createPageUrl(config.page));
    setIsOpen(false);
    setQuery('');
  };

  const getResultTitle = (result) => {
    return result.title || result.name || result.company || result.worker_name || result.job_title || 'Untitled';
  };

  const getResultSubtitle = (result) => {
    if (result.status) return result.status;
    if (result.email) return result.email;
    if (result.location) return result.location;
    return '';
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search across all data..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 bg-white"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-slate-200 max-h-96 overflow-auto z-50">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result, idx) => {
                const config = entityConfig[result._entityType];
                const Icon = config.icon;
                return (
                  <button
                    key={`${result._entityType}-${result.id}-${idx}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-4 py-3 hover:bg-slate-50 flex items-start gap-3 text-left transition-colors"
                  >
                    <div className={cn("p-2 rounded-lg", config.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">
                        {getResultTitle(result)}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {result._entityType}
                        </Badge>
                        {getResultSubtitle(result) && (
                          <span className="truncate">{getResultSubtitle(result)}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              {isLoading ? 'Searching...' : 'No results found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}