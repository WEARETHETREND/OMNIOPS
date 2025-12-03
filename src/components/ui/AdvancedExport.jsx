import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Calendar, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdvancedExport({ data, columns, filename = 'export' }) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(columns.map(c => c.key));
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [exportFormat, setExportFormat] = useState('csv');

  const toggleColumn = (key) => {
    setSelectedColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const selectAll = () => setSelectedColumns(columns.map(c => c.key));
  const selectNone = () => setSelectedColumns([]);

  const filterByDate = (items) => {
    if (!dateRange.from && !dateRange.to) return items;
    
    return items.filter(item => {
      const date = new Date(item.created_date || item.date);
      if (dateRange.from && date < dateRange.from) return false;
      if (dateRange.to && date > dateRange.to) return false;
      return true;
    });
  };

  const handleExport = () => {
    setExporting(true);
    try {
      const filteredData = filterByDate(data);
      const headers = columns.filter(c => selectedColumns.includes(c.key));

      if (exportFormat === 'csv') {
        const csvContent = [
          headers.map(c => c.label).join(','),
          ...filteredData.map(row =>
            headers.map(c => {
              const value = row[c.key];
              if (value === null || value === undefined) return '';
              if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
              return value;
            }).join(',')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `${filename}.csv`);
      } else {
        const exportData = filteredData.map(row => {
          const obj = {};
          headers.forEach(c => { obj[c.label] = row[c.key]; });
          return obj;
        });
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `${filename}.json`);
      }

      toast.success(`Exported ${filteredData.length} records to ${exportFormat.toUpperCase()}`);
      setOpen(false);
    } catch (e) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const downloadBlob = (blob, name) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {/* Format Selection */}
          <div>
            <Label className="mb-2 block">Format</Label>
            <div className="flex gap-2">
              <Button
                variant={exportFormat === 'csv' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExportFormat('csv')}
                className={exportFormat === 'csv' ? 'bg-slate-900' : ''}
              >
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                CSV
              </Button>
              <Button
                variant={exportFormat === 'json' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExportFormat('json')}
                className={exportFormat === 'json' ? 'bg-slate-900' : ''}
              >
                <FileText className="w-4 h-4 mr-1" />
                JSON
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="mb-2 block">Date Range (Optional)</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'From'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'To'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Columns</Label>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-xs text-blue-600 hover:underline">All</button>
                <button onClick={selectNone} className="text-xs text-slate-500 hover:underline">None</button>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-slate-50 rounded-lg">
              {columns.map(col => (
                <div key={col.key} className="flex items-center gap-2">
                  <Checkbox
                    id={col.key}
                    checked={selectedColumns.includes(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                  />
                  <label htmlFor={col.key} className="text-sm text-slate-700 cursor-pointer">
                    {col.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={exporting || selectedColumns.length === 0}
            className="w-full bg-slate-900 hover:bg-slate-800"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export {data?.length || 0} Records
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}