import React, { useState } from 'react';
import { safePost } from '@/components/api/apiClient';
import { 
  Upload,
  Download,
  FileText,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DataImportExport() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    const r = await safePost('/data/import', formData);
    if (!r.ok) {
      toast.error(`Import failed: ${r.error}`);
      setImportResult({ success: false, message: r.error });
    } else {
      toast.success('Import completed');
      setImportResult({ success: true, imported: r.data.imported, errors: r.data.errors });
    }
    setImporting(false);
  };

  const handleExport = async (entity) => {
    setExporting(true);
    const r = await safePost('/data/export', { entity });
    if (!r.ok) {
      toast.error(`Export failed: ${r.error}`);
    } else {
      // Trigger download
      const blob = new Blob([r.data.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${entity}_export_${Date.now()}.csv`;
      a.click();
      toast.success('Export completed');
    }
    setExporting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Data Import/Export</h1>
        <p className="text-slate-500 mt-1">Bulk import and export data as CSV files</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Import Data</h2>
              <p className="text-sm text-slate-500">Upload CSV file to bulk import</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Entity</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflows">Workflows</SelectItem>
                  <SelectItem value="contacts">Contacts</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="employees">Employees</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-600 mb-3">Drag & drop CSV file or click to browse</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button asChild disabled={importing}>
                  <span>
                    {importing ? 'Importing...' : 'Choose File'}
                  </span>
                </Button>
              </label>
            </div>

            {importResult && (
              <div className={`p-4 rounded-lg ${
                importResult.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {importResult.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span className={`font-medium ${importResult.success ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {importResult.success ? 'Import Successful' : 'Import Failed'}
                  </span>
                </div>
                {importResult.success && (
                  <p className="text-sm text-emerald-700">
                    Imported {importResult.imported} records
                    {importResult.errors > 0 && ` (${importResult.errors} errors)`}
                  </p>
                )}
                {!importResult.success && (
                  <p className="text-sm text-rose-700">{importResult.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Export */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Export Data</h2>
              <p className="text-sm text-slate-500">Download data as CSV file</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">Select data to export:</p>
            
            {['workflows', 'dispatches', 'alerts', 'audit', 'compliance'].map(entity => (
              <div key={entity} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-900 capitalize">{entity}</span>
                </div>
                <Button 
                  onClick={() => handleExport(entity)}
                  disabled={exporting}
                  size="sm"
                  variant="outline"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Export
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}