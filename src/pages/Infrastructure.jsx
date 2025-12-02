import React, { useState } from 'react';
import {
  Shield,
  Globe,
  Server,
  Lock,
  Eye,
  Database,
  CheckCircle,
  AlertTriangle,
  Building2,
  Users,
  MapPin,
  Activity,
  Layers,
  RefreshCw,
  Clock,
  FileText,
  HardDrive,
  Zap,
  Cloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const regions = [
  { id: 'us-east', name: 'US East (Virginia)', status: 'active', latency: '12ms', load: 45 },
  { id: 'us-west', name: 'US West (Oregon)', status: 'active', latency: '28ms', load: 32 },
  { id: 'eu-west', name: 'EU West (Ireland)', status: 'active', latency: '45ms', load: 38 },
  { id: 'eu-central', name: 'EU Central (Frankfurt)', status: 'active', latency: '52ms', load: 41 },
  { id: 'ap-southeast', name: 'Asia Pacific (Singapore)', status: 'standby', latency: '120ms', load: 15 },
  { id: 'ap-northeast', name: 'Asia Pacific (Tokyo)', status: 'standby', latency: '135ms', load: 12 }
];

const complianceCerts = [
  { name: 'SOC 2 Type II', status: 'certified', expires: '2025-08-15', icon: Shield },
  { name: 'HIPAA', status: 'certified', expires: '2025-06-20', icon: Lock },
  { name: 'GDPR', status: 'compliant', expires: null, icon: Globe },
  { name: 'ISO 27001', status: 'certified', expires: '2025-11-30', icon: FileText },
  { name: 'FedRAMP', status: 'in_progress', expires: null, icon: Building2 },
  { name: 'PCI-DSS', status: 'certified', expires: '2025-09-10', icon: Lock }
];

const encryptionStandards = [
  { name: 'Data at Rest', algorithm: 'AES-256-GCM', status: 'active' },
  { name: 'Data in Transit', algorithm: 'TLS 1.3', status: 'active' },
  { name: 'Key Management', algorithm: 'AWS KMS / HSM', status: 'active' },
  { name: 'Database Encryption', algorithm: 'TDE + Field-level', status: 'active' },
  { name: 'Backup Encryption', algorithm: 'AES-256', status: 'active' },
  { name: 'API Tokens', algorithm: 'SHA-256 + Salt', status: 'active' }
];

const observabilityStack = [
  { name: 'Metrics', tool: 'Prometheus + Grafana', status: 'active', coverage: 100 },
  { name: 'Logging', tool: 'ELK Stack', status: 'active', coverage: 100 },
  { name: 'Tracing', tool: 'Jaeger / OpenTelemetry', status: 'active', coverage: 95 },
  { name: 'APM', tool: 'Datadog', status: 'active', coverage: 100 },
  { name: 'Error Tracking', tool: 'Sentry', status: 'active', coverage: 100 },
  { name: 'Uptime Monitoring', tool: 'PagerDuty + Pingdom', status: 'active', coverage: 100 }
];

export default function Infrastructure() {
  const [tenantMode, setTenantMode] = useState('multi');
  const [dataResidency, setDataResidency] = useState('us');

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Uptime (30d)', value: '99.99%', icon: Activity, color: 'from-emerald-500 to-teal-600' },
          { label: 'Active Regions', value: '4/6', icon: Globe, color: 'from-blue-500 to-indigo-600' },
          { label: 'Certifications', value: '5', icon: Shield, color: 'from-violet-500 to-purple-600' },
          { label: 'Avg Latency', value: '18ms', icon: Zap, color: 'from-amber-500 to-orange-600' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="architecture" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="observability">Observability</TabsTrigger>
        </TabsList>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="space-y-6">
          {/* Deployment Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Deployment Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className={cn(
                    "p-6 rounded-xl border-2 cursor-pointer transition-all",
                    tenantMode === 'multi' ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"
                  )}
                  onClick={() => setTenantMode('multi')}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-6 h-6 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">Multi-Tenant</h3>
                    {tenantMode === 'multi' && <Badge className="bg-emerald-500">Active</Badge>}
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Shared infrastructure with logical data isolation. Cost-effective with enterprise-grade security.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Logical data separation per tenant
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Shared compute with resource limits
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Auto-scaling included
                    </li>
                  </ul>
                </div>

                <div 
                  className={cn(
                    "p-6 rounded-xl border-2 cursor-pointer transition-all",
                    tenantMode === 'single' ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"
                  )}
                  onClick={() => setTenantMode('single')}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-6 h-6 text-violet-600" />
                    <h3 className="font-semibold text-slate-900">Single-Tenant</h3>
                    {tenantMode === 'single' && <Badge className="bg-emerald-500">Active</Badge>}
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Dedicated infrastructure for your organization. Maximum isolation and customization.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="w-4 h-4 text-violet-500" />
                      Dedicated database cluster
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="w-4 h-4 text-violet-500" />
                      Isolated compute resources
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="w-4 h-4 text-violet-500" />
                      Custom VPC / Private Link
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zero Downtime Architecture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Zero-Downtime Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Blue-Green Deployments', desc: 'Instant rollback capability', status: 'enabled' },
                  { name: 'Rolling Updates', desc: 'Gradual pod replacement', status: 'enabled' },
                  { name: 'Health Checks', desc: 'Automated failover triggers', status: 'enabled' },
                  { name: 'Database Migrations', desc: 'Online schema changes', status: 'enabled' },
                  { name: 'Circuit Breakers', desc: 'Cascading failure prevention', status: 'enabled' },
                  { name: 'Load Balancing', desc: 'Global traffic distribution', status: 'enabled' }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{item.name}</span>
                      <Badge className="bg-emerald-100 text-emerald-700">Enabled</Badge>
                    </div>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Residency & Regions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Data Residency & Regions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'us', label: 'United States', flag: '🇺🇸' },
                  { value: 'eu', label: 'European Union', flag: '🇪🇺' },
                  { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
                  { value: 'ap', label: 'Asia Pacific', flag: '🌏' },
                  { value: 'au', label: 'Australia', flag: '🇦🇺' }
                ].map(region => (
                  <Button
                    key={region.value}
                    variant={dataResidency === region.value ? "default" : "outline"}
                    onClick={() => setDataResidency(region.value)}
                    className={dataResidency === region.value ? "bg-slate-900" : ""}
                  >
                    <span className="mr-2">{region.flag}</span>
                    {region.label}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regions.map(region => (
                  <div 
                    key={region.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all",
                      region.status === 'active' ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-slate-900">{region.name}</span>
                      <Badge className={region.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                        {region.status === 'active' ? 'Active' : 'Standby'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Latency</span>
                        <span className="font-medium">{region.latency}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Load</span>
                        <div className="flex items-center gap-2">
                          <Progress value={region.load} className="w-16 h-2" />
                          <span className="font-medium">{region.load}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Compliance Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complianceCerts.map((cert, i) => {
                  const statusConfig = {
                    certified: { color: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', label: 'Certified' },
                    compliant: { color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', label: 'Compliant' },
                    in_progress: { color: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', label: 'In Progress' }
                  }[cert.status];
                  
                  return (
                    <div key={i} className={cn("p-5 rounded-xl border", statusConfig.bg)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <cert.icon className={cn("w-6 h-6", statusConfig.color)} />
                          <h3 className="font-semibold text-slate-900">{cert.name}</h3>
                        </div>
                        <Badge className={statusConfig.badge}>{statusConfig.label}</Badge>
                      </div>
                      {cert.expires && (
                        <p className="text-sm text-slate-500">
                          Valid until: {new Date(cert.expires).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Audit Logging */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Audit Logging Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { area: 'User Actions', coverage: 100 },
                  { area: 'API Calls', coverage: 100 },
                  { area: 'Data Access', coverage: 100 },
                  { area: 'Config Changes', coverage: 100 },
                  { area: 'Auth Events', coverage: 100 },
                  { area: 'System Events', coverage: 100 },
                  { area: 'Integration Sync', coverage: 100 },
                  { area: 'Workflow Runs', coverage: 100 }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-600">{item.coverage}%</p>
                    <p className="text-sm text-slate-600">{item.area}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Complete audit trail with 7-year retention</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Government-Grade Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {encryptionStandards.map((enc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">{enc.name}</p>
                      <p className="text-sm text-slate-500">{enc.algorithm}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <Lock className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card>
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    title: 'Zero Trust Architecture',
                    desc: 'Every request verified, never trusted by default',
                    items: ['mTLS everywhere', 'Service mesh (Istio)', 'Network policies']
                  },
                  { 
                    title: 'Identity & Access',
                    desc: 'Enterprise SSO and fine-grained permissions',
                    items: ['SAML 2.0 / OIDC', 'SCIM provisioning', 'MFA enforcement']
                  },
                  { 
                    title: 'Data Protection',
                    desc: 'Comprehensive data security controls',
                    items: ['Field-level encryption', 'Data masking', 'DLP policies']
                  },
                  { 
                    title: 'Threat Detection',
                    desc: 'Real-time security monitoring',
                    items: ['WAF protection', 'DDoS mitigation', 'Anomaly detection']
                  }
                ].map((section, i) => (
                  <div key={i} className="p-5 border border-slate-200 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-1">{section.title}</h4>
                    <p className="text-sm text-slate-500 mb-3">{section.desc}</p>
                    <ul className="space-y-2">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Observability Tab */}
        <TabsContent value="observability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Full Observability Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {observabilityStack.map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">{item.name}</h4>
                      <Badge className="bg-emerald-100 text-emerald-700">{item.coverage}%</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{item.tool}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SLAs */}
          <Card>
            <CardHeader>
              <CardTitle>Service Level Agreements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { tier: 'Standard', uptime: '99.9%', support: '24h response', price: 'Included' },
                  { tier: 'Enterprise', uptime: '99.99%', support: '4h response', price: 'Contact Sales' },
                  { tier: 'Mission Critical', uptime: '99.999%', support: '15min response', price: 'Contact Sales' }
                ].map((sla, i) => (
                  <div key={i} className={cn(
                    "p-5 rounded-xl border-2 text-center",
                    i === 1 ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
                  )}>
                    {i === 1 && <Badge className="mb-3 bg-emerald-500">Recommended</Badge>}
                    <h4 className="text-lg font-bold text-slate-900 mb-4">{sla.tier}</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-3xl font-bold text-emerald-600">{sla.uptime}</p>
                        <p className="text-sm text-slate-500">Uptime SLA</p>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        <p className="font-medium text-slate-900">{sla.support}</p>
                        <p className="text-sm text-slate-500">Support Response</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Redundancy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Redundancy & Disaster Recovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { metric: 'RPO', value: '< 1 min', desc: 'Recovery Point Objective' },
                  { metric: 'RTO', value: '< 15 min', desc: 'Recovery Time Objective' },
                  { metric: 'Backup Frequency', value: 'Continuous', desc: 'Point-in-time recovery' },
                  { metric: 'Geo-Redundancy', value: '3+ Regions', desc: 'Cross-region replication' }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                    <p className="text-sm font-medium text-slate-700">{item.metric}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}