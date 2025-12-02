import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Palette,
  Upload,
  Globe,
  Mail,
  FileText,
  Eye,
  Save,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function WhiteLabel() {
  const queryClient = useQueryClient();
  
  const { data: configs = [] } = useQuery({
    queryKey: ['whitelabel'],
    queryFn: () => base44.entities.WhiteLabelConfig.list()
  });

  const existingConfig = configs[0];
  
  const [config, setConfig] = useState({
    company_name: 'OmniOps',
    logo_url: '',
    favicon_url: '',
    primary_color: '#10b981',
    secondary_color: '#0ea5e9',
    accent_color: '#8b5cf6',
    custom_domain: '',
    support_email: '',
    support_url: '',
    terms_url: '',
    privacy_url: '',
    custom_css: '',
    hide_powered_by: false,
    is_active: true
  });

  useEffect(() => {
    if (existingConfig) {
      setConfig({ ...config, ...existingConfig });
    }
  }, [existingConfig]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (existingConfig?.id) {
        return base44.entities.WhiteLabelConfig.update(existingConfig.id, data);
      }
      return base44.entities.WhiteLabelConfig.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelabel'] });
      toast.success('White-label settings saved');
    }
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setConfig({ ...config, logo_url: file_url });
        toast.success('Logo uploaded');
      } catch (err) {
        toast.error('Upload failed');
      }
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setConfig({ ...config, favicon_url: file_url });
        toast.success('Favicon uploaded');
      } catch (err) {
        toast.error('Upload failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">White-Label Configuration</h2>
          <p className="text-slate-500">Customize the platform with your brand</p>
        </div>
        <Button 
          onClick={() => saveMutation.mutate(config)}
          disabled={saveMutation.isPending}
          className="bg-slate-900 hover:bg-slate-800"
        >
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="links">Links & Support</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Name</CardTitle>
                <CardDescription>This will appear in the sidebar and page titles</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  value={config.company_name}
                  onChange={(e) => setConfig({ ...config, company_name: e.target.value })}
                  placeholder="Your Company Name"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Domain</CardTitle>
                <CardDescription>Use your own domain (requires DNS setup)</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  value={config.custom_domain}
                  onChange={(e) => setConfig({ ...config, custom_domain: e.target.value })}
                  placeholder="app.yourcompany.com"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logo</CardTitle>
                <CardDescription>Recommended: 200x50px, PNG or SVG</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.logo_url && (
                  <div className="p-4 bg-slate-100 rounded-lg">
                    <img src={config.logo_url} alt="Logo" className="h-12 object-contain" />
                  </div>
                )}
                <div>
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                      <Upload className="w-4 h-4" />
                      Upload new logo
                    </div>
                  </Label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Favicon</CardTitle>
                <CardDescription>Browser tab icon, 32x32px</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.favicon_url && (
                  <div className="p-4 bg-slate-100 rounded-lg inline-block">
                    <img src={config.favicon_url} alt="Favicon" className="w-8 h-8 object-contain" />
                  </div>
                )}
                <div>
                  <Label htmlFor="favicon-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                      <Upload className="w-4 h-4" />
                      Upload favicon
                    </div>
                  </Label>
                  <input
                    id="favicon-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFaviconUpload}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Customize the color scheme to match your brand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.primary_color}
                      onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={config.primary_color}
                      onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.secondary_color}
                      onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={config.secondary_color}
                      onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.accent_color}
                      onChange={(e) => setConfig({ ...config, accent_color: e.target.value })}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={config.accent_color}
                      onChange={(e) => setConfig({ ...config, accent_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8">
                <Label className="mb-4 block">Preview</Label>
                <div className="p-6 bg-slate-900 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${config.primary_color}, ${config.secondary_color})` }}
                    >
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold">{config.company_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="px-4 py-2 rounded-lg text-white text-sm"
                      style={{ backgroundColor: config.primary_color }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg text-white text-sm"
                      style={{ backgroundColor: config.secondary_color }}
                    >
                      Secondary
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg text-white text-sm"
                      style={{ backgroundColor: config.accent_color }}
                    >
                      Accent
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Support Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="email"
                  value={config.support_email}
                  onChange={(e) => setConfig({ ...config, support_email: e.target.value })}
                  placeholder="support@yourcompany.com"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Support URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={config.support_url}
                  onChange={(e) => setConfig({ ...config, support_url: e.target.value })}
                  placeholder="https://support.yourcompany.com"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Terms of Service URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={config.terms_url}
                  onChange={(e) => setConfig({ ...config, terms_url: e.target.value })}
                  placeholder="https://yourcompany.com/terms"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Privacy Policy URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={config.privacy_url}
                  onChange={(e) => setConfig({ ...config, privacy_url: e.target.value })}
                  placeholder="https://yourcompany.com/privacy"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom CSS</CardTitle>
              <CardDescription>Add custom CSS to further customize the appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={config.custom_css}
                onChange={(e) => setConfig({ ...config, custom_css: e.target.value })}
                placeholder=".custom-class { color: red; }"
                className="font-mono min-h-[200px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Hide "Powered by" Badge</p>
                  <p className="text-sm text-slate-500">Remove the platform attribution from the footer</p>
                </div>
                <Switch
                  checked={config.hide_powered_by}
                  onCheckedChange={(checked) => setConfig({ ...config, hide_powered_by: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">White-label Active</p>
                  <p className="text-sm text-slate-500">Enable or disable white-label customizations</p>
                </div>
                <Switch
                  checked={config.is_active}
                  onCheckedChange={(checked) => setConfig({ ...config, is_active: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}