import React from 'react';
import { 
  Code2, 
  Database, 
  Palette, 
  BarChart3, 
  Wifi, 
  HardDrive,
  FileCheck,
  Layers,
  CheckCircle,
  ExternalLink,
  Brain,
  BookOpen,
  Users,
  Package,
  Heart,
  Plug2,
  Shield,
  PieChart,
  UserCheck,
  Building2,
  Sparkles,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const expansionModules = [
  {
    name: 'AI & Automation',
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    status: 'planned',
    features: ['Predictive Maintenance', 'Smart Scheduling', 'Auto-Response', 'Revenue Forecasting'],
    benefit: 'Adds intelligence to workflows; reduces manual effort'
  },
  {
    name: 'Knowledge Base',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-600',
    status: 'planned',
    features: ['SOPs', 'Training Docs', 'Onboarding Guides'],
    benefit: 'Reduces errors & training time'
  },
  {
    name: 'Vendor Management',
    icon: Users,
    color: 'from-amber-500 to-orange-600',
    status: 'planned',
    features: ['Assign Jobs', 'Track Invoices', 'Evaluate Performance'],
    benefit: 'Needed for multi-team / multi-contractor setups'
  },
  {
    name: 'Inventory & Assets',
    icon: Package,
    color: 'from-emerald-500 to-teal-600',
    status: 'planned',
    features: ['Tools & Equipment', 'Low Stock Alerts', 'QR/Barcode Scanning'],
    benefit: 'Ideal for field-heavy industries'
  },
  {
    name: 'Customer Loyalty',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    status: 'planned',
    features: ['Points System', 'Referrals', 'Automated Follow-ups'],
    benefit: 'Keeps customers returning'
  },
  {
    name: 'Integrations Marketplace',
    icon: Plug2,
    color: 'from-indigo-500 to-blue-600',
    status: 'active',
    features: ['QuickBooks', 'Salesforce', 'Zapier', 'Payment Gateways'],
    benefit: 'Extends platform without custom code'
  },
  {
    name: 'Compliance Tracking',
    icon: Shield,
    color: 'from-slate-500 to-slate-700',
    status: 'active',
    features: ['Licenses', 'Certifications', 'Renewal Reminders'],
    benefit: 'Critical for regulated industries'
  },
  {
    name: 'Advanced BI & Reporting',
    icon: PieChart,
    color: 'from-cyan-500 to-blue-600',
    status: 'planned',
    features: ['Custom Dashboards', 'KPI Benchmarking', 'Geospatial Analytics'],
    benefit: 'Insights for executives & analysts'
  },
  {
    name: 'HR & Performance',
    icon: UserCheck,
    color: 'from-green-500 to-emerald-600',
    status: 'planned',
    features: ['Productivity Tracking', 'Payroll', 'Certifications'],
    benefit: 'Builds internal efficiency & accountability'
  },
  {
    name: 'Industry Vertical Packs',
    icon: Building2,
    color: 'from-purple-500 to-violet-600',
    status: 'planned',
    features: ['Pre-built Workflows', 'Industry Templates', 'Best Practices'],
    benefit: 'Enables OmniOps to scale into multiple markets'
  }
];

const techCategories = [
  {
    name: 'Framework',
    icon: Code2,
    color: 'from-blue-500 to-indigo-600',
    technologies: [
      { name: 'React 18', status: 'active', description: 'Component-based UI with concurrent features' },
      { name: 'TypeScript', status: 'active', description: 'Type-safe development experience' },
      { name: 'Vite', status: 'active', description: 'Fast build tool and dev server' }
    ]
  },
  {
    name: 'State Management',
    icon: Layers,
    color: 'from-violet-500 to-purple-600',
    technologies: [
      { name: 'React Query', status: 'active', description: 'Server state management and caching' },
      { name: 'React Context', status: 'active', description: 'Local state for themes, auth' },
      { name: 'LocalStorage', status: 'active', description: 'Persist user preferences' }
    ]
  },
  {
    name: 'UI Library',
    icon: Palette,
    color: 'from-pink-500 to-rose-600',
    technologies: [
      { name: 'TailwindCSS', status: 'active', description: 'Utility-first CSS framework' },
      { name: 'ShadCN/UI', status: 'active', description: 'Accessible component primitives' },
      { name: 'Framer Motion', status: 'active', description: 'Animation library' },
      { name: 'Lucide Icons', status: 'active', description: 'Beautiful icon set' }
    ]
  },
  {
    name: 'Charts & Visuals',
    icon: BarChart3,
    color: 'from-emerald-500 to-teal-600',
    technologies: [
      { name: 'Recharts', status: 'active', description: 'Composable charting library' },
      { name: 'Sparklines', status: 'active', description: 'Mini inline charts' }
    ]
  },
  {
    name: 'Real-Time',
    icon: Wifi,
    color: 'from-amber-500 to-orange-600',
    technologies: [
      { name: 'React Query Polling', status: 'active', description: 'Automatic data refetching' },
      { name: 'Sonner Toasts', status: 'active', description: 'Real-time notifications' }
    ]
  },
  {
    name: 'Persistence',
    icon: HardDrive,
    color: 'from-slate-500 to-slate-700',
    technologies: [
      { name: 'LocalStorage', status: 'active', description: 'Theme, layout preferences' },
      { name: 'Base44 Backend', status: 'active', description: 'Cloud database & auth' }
    ]
  },
  {
    name: 'Forms & Validation',
    icon: FileCheck,
    color: 'from-cyan-500 to-blue-600',
    technologies: [
      { name: 'React Hook Form', status: 'active', description: 'Performant form handling' },
      { name: 'Native Validation', status: 'active', description: 'HTML5 + custom validation' }
    ]
  },
  {
    name: 'Backend Services',
    icon: Database,
    color: 'from-green-500 to-emerald-600',
    technologies: [
      { name: 'Base44 Entities', status: 'active', description: 'Schema-based data models' },
      { name: 'Base44 Auth', status: 'active', description: 'User authentication' },
      { name: 'Base44 Integrations', status: 'active', description: 'AI, Email, File storage' }
    ]
  }
];

export default function TechStack() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Architecture</h1>
        <p className="text-slate-500 mt-1">Core technologies and expansion modules powering OmniOps</p>
      </div>

      <Tabs defaultValue="tech" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tech">Core Tech Stack</TabsTrigger>
          <TabsTrigger value="modules">Expansion Modules</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="tech" className="space-y-6">
          {/* Tech Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {techCategories.map((category) => (
          <div 
            key={category.name}
            className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
                category.color
              )}>
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">{category.name}</h3>
            </div>

            <div className="space-y-3">
              {category.technologies.map((tech) => (
                <div key={tech.name} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{tech.name}</p>
                    <p className="text-xs text-slate-400">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Architecture Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">Frontend Layer</h4>
            <p className="text-sm text-blue-700">React 18 with ShadCN components, TailwindCSS styling, and Recharts visualizations. Optimized for performance with React Query caching.</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <h4 className="font-medium text-emerald-900 mb-2">State Layer</h4>
            <p className="text-sm text-emerald-700">React Query for server state, Context for UI state, LocalStorage for persistence. Automatic background refetching keeps data fresh.</p>
          </div>
          <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
            <h4 className="font-medium text-violet-900 mb-2">Backend Layer</h4>
            <p className="text-sm text-violet-700">Base44 managed services for database, authentication, file storage, and AI integrations. Zero backend code required.</p>
          </div>
        </div>
      </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Developer Experience</h3>
              <ul className="space-y-2">
                {[
                  'Hot module replacement for instant updates',
                  'TypeScript for type safety',
                  'Component-driven development',
                  'Utility-first CSS with Tailwind',
                  'Pre-built accessible UI components'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Production Ready</h3>
              <ul className="space-y-2">
                {[
                  'Responsive design for all devices',
                  'Accessible components (WCAG 2.1)',
                  'Optimized bundle size',
                  'Error boundaries for stability',
                  'Real-time data synchronization'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          {/* Expansion Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {expansionModules.map((module) => (
              <div 
                key={module.name}
                className="bg-white rounded-xl border border-slate-200/60 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn(
                    "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center",
                    module.color
                  )}>
                    <module.icon className="w-4 h-4 text-white" />
                  </div>
                  <Badge className={module.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                    {module.status === 'active' ? 'Active' : 'Planned'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-2">{module.name}</h3>
                <ul className="space-y-1 mb-3">
                  {module.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-400 italic">{module.benefit}</p>
              </div>
            ))}
          </div>

          {/* Module Integration Map */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Module Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { module: 'Operations', components: ['ActivityFeed', 'InlineEditTable'], desc: 'Job lists, schedules' },
                { module: 'Sales', components: ['KPICard', 'DrillDownChart'], desc: 'Estimates, proposals, conversion' },
                { module: 'Customer', components: ['NotificationsDropdown', 'CollaboratorAvatars'], desc: 'CSRs & client communication' },
                { module: 'Finance', components: ['DrillDownChart', 'KPICard'], desc: 'Expenses, margins, cash flow' },
                { module: 'Reporting', components: ['All Dashboard Components'], desc: 'Visual insights & analytics' },
                { module: 'Projects', components: ['ProjectSelector', 'QuickActions', 'InlineEditTable'], desc: 'Multi-project management' }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-900 mb-1">{item.module} Module</h4>
                  <p className="text-xs text-slate-500 mb-2">{item.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.components.map((c, j) => (
                      <Badge key={j} variant="outline" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          {/* Strategy for Greatness */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold">Strategy for Greatness</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Core First', desc: 'Get OmniOps fully functional in one month' },
                { title: 'Modular Architecture', desc: 'Optional modules can be added without disrupting the core' },
                { title: 'Role-Based Dashboards', desc: 'Prevents feature overload for end-users' },
                { title: 'AI & Automation Early', desc: 'Differentiates OmniOps from competitors' },
                { title: 'Industry Vertical Packs', desc: 'Scale into new markets while keeping core stable' },
                { title: 'Incremental Upgrades', desc: 'Increase stickiness, revenue, and differentiation' }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white/10 rounded-xl backdrop-blur">
                  <h4 className="font-semibold text-emerald-400 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Big Picture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
              <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Core Modules
              </h3>
              <ul className="space-y-2">
                {['MVP launch ready', 'Investor-ready polish', 'Essential workflows', 'Real-time dashboards'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-emerald-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-violet-50 rounded-2xl border border-violet-200 p-6">
              <h3 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Optional Modules
              </h3>
              <ul className="space-y-2">
                {['Incremental revenue streams', 'Increased user stickiness', 'Market differentiation', 'Enterprise-grade features'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-violet-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Platform Value</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-slate-900">Navigation & Productivity</h4>
                <p className="text-xs text-slate-500 mt-1">ProjectSelector, QuickActions, Breadcrumbs</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-medium text-slate-900">Engagement & Communication</h4>
                <p className="text-xs text-slate-500 mt-1">NotificationsDropdown, ActivityFeed, CollaboratorAvatars</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-medium text-slate-900">Data Visibility & Interactivity</h4>
                <p className="text-xs text-slate-500 mt-1">KPICard, DrillDownChart, InlineEditTable</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}