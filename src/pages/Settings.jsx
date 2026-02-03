import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { 
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'preferences', label: 'Preferences', icon: Globe }
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    timezone: 'UTC',
    language: 'en'
  });
  const [notifications, setNotifications] = useState({
    email_alerts: true,
    critical_only: false,
    daily_digest: true,
    workflow_updates: true
  });

  useEffect(() => {
    base44.auth.me().then(userData => {
      setUser(userData);
      setFormData({
        full_name: userData.full_name || '',
        email: userData.email || '',
        timezone: userData.timezone || 'UTC',
        language: userData.language || 'en'
      });
      setNotifications(userData.notifications || {
        email_alerts: true,
        critical_only: false,
        daily_digest: true,
        workflow_updates: true
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({
      timezone: formData.timezone,
      language: formData.language,
      notifications
    });
    setSaving(false);
    toast.success('Settings saved successfully');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-500/30">
                  {formData.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{formData.full_name || 'User'}</h3>
                  <p className="text-sm text-slate-500">{formData.email}</p>
                  <p className="text-xs text-slate-400 mt-1 capitalize">{user?.role || 'User'}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={formData.full_name}
                    disabled
                    className="bg-slate-50"
                  />
                  <p className="text-xs text-slate-400">Contact admin to change your name</p>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    value={formData.email}
                    disabled
                    className="bg-slate-50"
                  />
                  <p className="text-xs text-slate-400">Email cannot be changed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Email Alerts</p>
                  <p className="text-sm text-slate-500">Receive alerts via email</p>
                </div>
                <Switch
                  checked={notifications.email_alerts}
                  onCheckedChange={(v) => setNotifications({ ...notifications, email_alerts: v })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Critical Only</p>
                  <p className="text-sm text-slate-500">Only receive critical alerts</p>
                </div>
                <Switch
                  checked={notifications.critical_only}
                  onCheckedChange={(v) => setNotifications({ ...notifications, critical_only: v })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Daily Digest</p>
                  <p className="text-sm text-slate-500">Receive a daily summary of activity</p>
                </div>
                <Switch
                  checked={notifications.daily_digest}
                  onCheckedChange={(v) => setNotifications({ ...notifications, daily_digest: v })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Workflow Updates</p>
                  <p className="text-sm text-slate-500">Get notified when workflows complete or fail</p>
                </div>
                <Switch
                  checked={notifications.workflow_updates}
                  onCheckedChange={(v) => setNotifications({ ...notifications, workflow_updates: v })}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'security':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-cyan-600">Account Secured</p>
                    <p className="text-sm text-cyan-600/80">Your account is protected with enterprise-grade security</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Active Sessions</p>
                    <p className="text-sm text-slate-500">Manage your active login sessions</p>
                  </div>
                  <Button variant="outline">View</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">API Keys</p>
                    <p className="text-sm text-slate-500">Manage your API access tokens</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'appearance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how OmniOps looks for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['Light', 'Dark', 'System'].map(theme => (
                    <button
                      key={theme}
                      className={cn(
                        "p-4 rounded-xl border-2 text-center transition-colors",
                        theme === 'Light' 
                          ? "border-slate-900 bg-slate-50" 
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 mx-auto mb-2 rounded-lg",
                        theme === 'Light' ? 'bg-white border border-slate-200' :
                        theme === 'Dark' ? 'bg-slate-800' : 'bg-gradient-to-br from-white to-slate-800'
                      )} />
                      <p className="text-sm font-medium">{theme}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Accent Color</Label>
                <div className="flex gap-3">
                  {[
                    { name: 'Cyan', color: 'bg-cyan-500' },
                    { name: 'Orange', color: 'bg-orange-500' },
                    { name: 'Violet', color: 'bg-violet-500' },
                    { name: 'Rose', color: 'bg-rose-500' },
                    { name: 'Amber', color: 'bg-amber-500' }
                  ].map(accent => (
                    <button
                      key={accent.name}
                      className={cn(
                        "w-10 h-10 rounded-lg transition-transform hover:scale-110 shadow-lg",
                        accent.color,
                        accent.name === 'Cyan' && 'ring-2 ring-offset-2 ring-cyan-500'
                      )}
                      title={accent.name}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'preferences':
        return (
          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>Set your regional and language preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(v) => setFormData({ ...formData, language: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select 
                    value={formData.timezone} 
                    onValueChange={(v) => setFormData({ ...formData, timezone: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl border border-slate-200/60 p-2">
          {settingsSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                activeSection === section.id
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">
        {renderContent()}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg shadow-cyan-500/30"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}