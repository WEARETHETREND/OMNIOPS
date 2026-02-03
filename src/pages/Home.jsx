import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { 
  Zap, 
  Clock, 
  Shield, 
  TrendingUp, 
  ArrowRight,
  Workflow,
  Bot,
  CheckCircle2,
  XCircle,
  Play,
  Calendar,
  Mail,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [employees, setEmployees] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const avgHourlyRate = 35;
  const weeksPerYear = 52;
  const monthlySavings = Math.round((hoursPerWeek * 4 * avgHourlyRate));
  const yearlySavings = Math.round((hoursPerWeek * weeksPerYear * avgHourlyRate));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await base44.analytics.track({
        eventName: 'landing_page_lead_submitted',
        properties: {
          industry: formData.industry,
          company: formData.company
        }
      });

      toast.success('Thanks! We\'ll be in touch within 24 hours.');
      setFormData({ name: '', email: '', company: '', industry: '', message: '' });
    } catch (error) {
      toast.error('Something went wrong. Please email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="text-xl font-bold">
            <span className="text-cyan-400">Omni</span><span className="text-orange-400">Ops</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">Dashboard</Button>
            </Link>
            <a href="#demo">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20">
                Get Demo
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Large Logo */}
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692cc4fe31f31eedd47e4c98/3091574e2_Screenshot2025-12-19125112.png" 
            alt="OmniOps"
            className="h-40 w-auto mx-auto mb-8"
          />
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Enterprise-Grade<br />
            <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">Intelligent Operations</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Mission-critical automation platform built for scale, autonomy, and continuous operational excellence. 
            Govern, optimize, and elevate decisions across every layer of your enterprise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="#demo">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-lg px-8 h-14 shadow-lg shadow-cyan-500/30">
                Request Enterprise Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a href="#roi-calculator">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-2 border-slate-600 text-white hover:bg-slate-800">
                Calculate ROI
              </Button>
            </a>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium border border-cyan-500/30">
            <Zap className="w-4 h-4" />
            <span className="font-semibold">Omni</span><span className="font-semibold text-orange-400">Ops</span> - Intelligent Decision Control
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            From Chaos to Control
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl border-2 border-slate-700 hover:border-cyan-500/30 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Manual Workflows</h3>
                  <p className="text-slate-400 text-sm">Teams waste hours on repetitive tasks and data entry across disconnected systems</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Intelligent Automation</h3>
                  <p className="text-slate-400 text-sm">AI-powered workflows sync data and execute decisions in real-time</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border-2 border-slate-700 hover:border-cyan-500/30 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Compliance Nightmares</h3>
                  <p className="text-slate-400 text-sm">Tracking SOC2, HIPAA, GDPR across spreadsheets creates audit risks</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Built-in Compliance</h3>
                  <p className="text-slate-400 text-sm">Automated monitoring and immutable audit logs ensure continuous compliance</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border-2 border-slate-700 hover:border-cyan-500/30 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Tool Fragmentation</h3>
                  <p className="text-slate-400 text-sm">Dozens of disconnected platforms create data silos and inefficiencies</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Unified Platform</h3>
                  <p className="text-slate-400 text-sm">Single source of truth connects all systems with intelligent orchestration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi-calculator" className="py-16 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Quantify Your Impact
            </h2>
            <p className="text-slate-300 text-lg">
              Calculate potential savings with intelligent automation
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-orange-500/20 p-8 rounded-2xl border-2 border-cyan-500/30">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Number of Employees
                </label>
                <Input
                  type="number"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="text-lg border-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Hours on Manual Tasks/Week
                </label>
                <Input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="text-lg border-2"
                />
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border-2 border-slate-700">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-cyan-400 mb-2">
                    ${monthlySavings.toLocaleString()}
                  </div>
                  <div className="text-slate-300 font-semibold">Monthly Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-400 mb-2">
                    ${yearlySavings.toLocaleString()}
                  </div>
                  <div className="text-slate-300 font-semibold">Annual Impact</div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t-2 border-slate-700 text-center">
                <p className="text-slate-300 mb-4 font-medium">
                  That's {Math.round(hoursPerWeek * 4)} hours reclaimed per month at ${avgHourlyRate}/hour
                </p>
                <a href="#demo">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30">
                    Get Enterprise Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Deploy in Days, Not Months
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/40">
                <Workflow className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">1. Select Framework</h3>
              <p className="text-slate-300">
                Choose from enterprise-grade templates built for compliance, security, and scale
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/40">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">2. AI Configuration</h3>
              <p className="text-slate-300">
                Intelligent copilot adapts workflows to your exact operational requirements
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/40">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">3. Continuous Optimization</h3>
              <p className="text-slate-300">
                Real-time monitoring and intelligent decision control drive operational excellence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Enterprise Platform Capabilities
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Workflow, title: 'Visual Orchestration', desc: 'Drag-and-drop workflow builder for complex automation scenarios' },
              { icon: Bot, title: 'AI Decision Engine', desc: 'Natural language interface with intelligent recommendation system' },
              { icon: Shield, title: 'Security & Compliance', desc: 'SOC2 Type II, HIPAA, GDPR certified with immutable audit trails' },
              { icon: TrendingUp, title: 'Real-time Intelligence', desc: 'Advanced analytics with predictive insights and anomaly detection' },
              { icon: CheckCircle2, title: 'Pre-built Templates', desc: '100+ enterprise workflows across departments and industries' },
              { icon: Zap, title: 'Unlimited Integration', desc: 'Connect any system with universal API and data transformation layer' },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-800 p-6 rounded-xl border-2 border-slate-700 hover:shadow-xl hover:border-cyan-500/30 transition-all group">
                <feature.icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:text-orange-400 transition-colors drop-shadow-md" />
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="demo" className="py-20 px-6 bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Get Enterprise Assessment
            </h2>
            <p className="text-slate-300 text-lg">
              Let our team analyze your operations and provide a customized automation roadmap
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/30 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Company *</label>
                <Input
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="Acme Corporation"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Industry *</label>
                <Input
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="Healthcare, Finance, Manufacturing..."
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">What are your operational challenges?</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-28"
                placeholder="Describe your current pain points..."
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg h-14 shadow-lg shadow-orange-500/40"
            >
              {loading ? 'Submitting...' : 'Request Assessment'}
              <Calendar className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-sm text-slate-400 text-center mt-4">
              Enterprise team will respond within 24 hours
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692cc4fe31f31eedd47e4c98/3091574e2_Screenshot2025-12-19125112.png" 
                alt="OmniOps"
                className="h-12 w-auto brightness-0 invert mb-4"
              />
              <p className="text-sm text-slate-500">
                Enterprise AI-powered intelligent decision control platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl('Dashboard')} className="hover:text-cyan-400 transition-colors">Platform</Link></li>
                <li><Link to={createPageUrl('WorkflowTemplates')} className="hover:text-cyan-400 transition-colors">Templates</Link></li>
                <li><Link to={createPageUrl('IntegrationMarketplace')} className="hover:text-cyan-400 transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl('ProductRoadmap')} className="hover:text-cyan-400 transition-colors">About</Link></li>
                <li><a href="mailto:careers@opsvanta.com" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                <li><a href="#demo" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Enterprise</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  enterprise@opsvanta.com
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  24/7 Support
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-center md:text-left">
              <div className="text-white font-medium mb-1">
                <span className="text-white">Omni</span><span className="text-orange-500">Ops</span> · Intelligent Decision Control
              </div>
              <div className="text-xs text-slate-500">A product of OpsVanta LLC · © 2026 All rights reserved</div>
            </div>
            <div className="flex gap-6">
              <Link to={createPageUrl('PrivacyPolicy')} className="hover:text-cyan-400 transition-colors">Privacy</Link>
              <Link to={createPageUrl('TermsOfService')} className="hover:text-cyan-400 transition-colors">Terms</Link>
              <Link to={createPageUrl('CookiePolicy')} className="hover:text-cyan-400 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}