import * as React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function AdvancedFilters({ 
  filters, 
  onFiltersChange, 
  filterConfig,
  className 
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setIsOpen(false);
  };

  const activeFilterCount = Object.keys(filters).filter(k => filters[k] && filters[k] !== 'all').length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Advanced Filters</h4>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {filterConfig.map((config) => (
            <div key={config.key} className="space-y-2">
              <label className="text-sm font-medium">{config.label}</label>
              {config.type === 'select' && (
                <Select 
                  value={filters[config.key] || 'all'} 
                  onValueChange={(value) => updateFilter(config.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {config.label}</SelectItem>
                    {config.options.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {config.type === 'date' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      {filters[config.key] 
                        ? format(new Date(filters[config.key]), 'PPP')
                        : `Select ${config.label.toLowerCase()}`
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters[config.key] ? new Date(filters[config.key]) : undefined}
                      onSelect={(date) => updateFilter(config.key, date?.toISOString())}
                    />
                  </PopoverContent>
                </Popover>
              )}
              
              {config.type === 'text' && (
                <Input
                  placeholder={`Search by ${config.label.toLowerCase()}...`}
                  value={filters[config.key] || ''}
                  onChange={(e) => updateFilter(config.key, e.target.value)}
                />
              )}
              
              {config.type === 'number' && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters[`${config.key}_min`] || ''}
                    onChange={(e) => updateFilter(`${config.key}_min`, e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters[`${config.key}_max`] || ''}
                    onChange={(e) => updateFilter(`${config.key}_max`, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}