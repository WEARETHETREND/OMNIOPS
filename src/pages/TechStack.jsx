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
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
        <h1 className="text-2xl font-bold text-slate-900">Core Tech Stack</h1>
        <p className="text-slate-500 mt-1">Technologies powering the OmniOps platform</p>
      </div>

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
    </div>
  );
}