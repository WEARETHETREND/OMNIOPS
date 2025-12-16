import React, { useState, useEffect } from 'react';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Palette,
  Upload,
  Save,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function WhiteLabel() {
  const [config, setConfig] = useState({
    company_name: '',
    logo_url: '',
    favicon_url: '',
    primary_color: '#10b981',
    secondary_color: '#0891b2',
    accent_color: '#6366f1',
    custom_domain: '',
    support_email: '',
    support_url: '',
    terms_url: '',
    privacy_url: '',
    custom_css: '',
    hide_powered_by: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadConfig = async () => {
    setLoading(true);
    setError('');
    const r = await safeGet('/white-label');
    if (!r.ok) {
      setError(r.error);
    } else if (r.data.config) {
      setConfig({ ...config, ...r.data.config });
    }
    setLoading(false);
  };

  const saveConfig = async () => {
    setSaving(true);
    const r = await safePost('/white-label', config);
    if (!r.ok) {
      toast.error(`Failed to save: ${r.error}`);
    } else {
      toast.success('White label settings saved');
    }
    setSaving(false);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">White Label Settings</h1>
          <p className="text-slate-500 mt-1">Customize branding, colors, and domain</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadConfig} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={saveConfig} disabled={saving} className="bg-slate-900 hover:bg-slate-800">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brand Identity */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Brand Identity</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={config.company_name}
                    onChange={(e) => setConfig({ ...config, company_name: e.target.value })}
                    placeholder="Your Company Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={config.logo_url}
                      onChange={(e) => setConfig({ ...config, logo_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon URL</Label>
                    <Input
                      value={config.favicon_url}
                      onChange={(e) => setConfig({ ...config, favicon_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Brand Colors</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.primary_color}
                      onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.primary_color}
                      onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                      placeholder="#10b981"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.secondary_color}
                      onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.secondary_color}
                      onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                      placeholder="#0891b2"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.accent_color}
                      onChange={(e) => setConfig({ ...config, accent_color: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.accent_color}
                      onChange={(e) => setConfig({ ...config, accent_color: e.target.value })}
                      placeholder="#6366f1"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Domain & Support */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Domain & Support</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Custom Domain</Label>
                  <Input
                    value={config.custom_domain}
                    onChange={(e) => setConfig({ ...config, custom_domain: e.target.value })}
                    placeholder="app.yourcompany.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input
                      type="email"
                      value={config.support_email}
                      onChange={(e) => setConfig({ ...config, support_email: e.target.value })}
                      placeholder="support@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support URL</Label>
                    <Input
                      value={config.support_url}
                      onChange={(e) => setConfig({ ...config, support_url: e.target.value })}
                      placeholder="https://help.company.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Terms of Service URL</Label>
                    <Input
                      value={config.terms_url}
                      onChange={(e) => setConfig({ ...config, terms_url: e.target.value })}
                      placeholder="https://company.com/terms"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Privacy Policy URL</Label>
                    <Input
                      value={config.privacy_url}
                      onChange={(e) => setConfig({ ...config, privacy_url: e.target.value })}
                      placeholder="https://company.com/privacy"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Custom CSS */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Custom CSS</h2>
              <div className="space-y-2">
                <Label>Advanced Styling (Optional)</Label>
                <Textarea
                  value={config.custom_css}
                  onChange={(e) => setConfig({ ...config, custom_css: e.target.value })}
                  placeholder=".custom-class { ... }"
                  className="font-mono text-sm h-32"
                />
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Hide "Powered by" Branding</Label>
                  <p className="text-sm text-slate-500 mt-1">Remove platform attribution</p>
                </div>
                <Switch
                  checked={config.hide_powered_by}
                  onCheckedChange={(checked) => setConfig({ ...config, hide_powered_by: checked })}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200/60 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Preview</h2>
              <div className="space-y-4">
                <div 
                  className="h-48 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: config.primary_color }}
                >
                  <div className="text-center">
                    <Palette className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-semibold">{config.company_name || 'Company Name'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div 
                      className="flex-1 h-12 rounded" 
                      style={{ backgroundColor: config.primary_color }}
                    />
                    <div 
                      className="flex-1 h-12 rounded" 
                      style={{ backgroundColor: config.secondary_color }}
                    />
                    <div 
                      className="flex-1 h-12 rounded" 
                      style={{ backgroundColor: config.accent_color }}
                    />
                  </div>
                  <div className="text-center text-sm text-slate-500">
                    <p>Primary / Secondary / Accent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}