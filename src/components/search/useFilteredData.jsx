import { useMemo } from 'react';

export function useFilteredData(data, filters) {
  return useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!filters || Object.keys(filters).length === 0) return data;

    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;

        // Handle date range
        if (key.includes('_min')) {
          const field = key.replace('_min', '');
          return !item[field] || parseFloat(item[field]) >= parseFloat(value);
        }
        if (key.includes('_max')) {
          const field = key.replace('_max', '');
          return !item[field] || parseFloat(item[field]) <= parseFloat(value);
        }

        // Handle text search
        if (typeof value === 'string' && !item[key]) {
          const itemStr = JSON.stringify(item).toLowerCase();
          return itemStr.includes(value.toLowerCase());
        }

        // Exact match
        return String(item[key]).toLowerCase() === String(value).toLowerCase();
      });
    });
  }, [data, filters]);
}