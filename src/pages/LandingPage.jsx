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
  Check, 
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

export default function LandingPage() {
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
      // Track the lead
      await base44.analytics.track({
        eventName: 'landing_page_lead_submitted',
        properties: {
          industry: formData.industry,
          company: formData.company
        }
      });

      // You can save to a Leads entity or send email
      toast.success('Thanks! We\'ll be in touch within 24 hours.');
      setFormData({ name: '', email: '', company: '', industry: '', message: '' });
    } catch (error) {
      toast.error('Something went wrong. Please email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692cc4fe31f31eedd47e4c98/25b474da3_ChatGPTImageDec23202509_54_56PM.png" 
              alt="OpsVanta"
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Pricing')}>
              <Button variant="ghost">Pricing</Button>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-600 rounded-full text-sm font-medium mb-6 border border-cyan-500/20">
            <Zap className="w-4 h-4" />
            Trusted by 100+ Operations Teams
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Stop Wasting 20+ Hours<br />Per Week on Manual Work
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            OpsVanta automates your operations workflows in minutes, not months. 
            No coding required. Just connect, automate, and save.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="#demo">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-lg px-8 h-14 shadow-lg shadow-cyan-500/30">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a href="#roi-calculator">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                Calculate Your Savings
              </Button>
            </a>
          </div>

          {/* Screenshot/Demo placeholder */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-xl animate-pulse"></div>
                  <Play className="w-20 h-20 text-cyan-500 mx-auto mb-4 relative z-10" />
                </div>
                <p className="text-slate-600 font-medium">Watch 2-Minute Demo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Stop Drowning in Manual Work
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Before OpsVanta</h3>
                  <p className="text-slate-600 text-sm">Employees spend hours copying data between systems manually</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">After OpsVanta</h3>
                  <p className="text-slate-600 text-sm">Auto-sync between all your systems in real-time</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Before OpsVanta</h3>
                  <p className="text-slate-600 text-sm">Compliance tracking is a nightmare across spreadsheets</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">After OpsVanta</h3>
                  <p className="text-slate-600 text-sm">Built-in SOC2/HIPAA/GDPR compliance monitoring</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Before OpsVanta</h3>
                  <p className="text-slate-600 text-sm">Too many tools that don't talk to each other</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">After OpsVanta</h3>
                  <p className="text-slate-600 text-sm">One platform connects everything automatically</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi-calculator" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How Much Could You Save?
            </h2>
            <p className="text-slate-600">
              See your potential ROI with OpsVanta automation
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-orange-500/10 p-8 rounded-2xl border border-cyan-500/20">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Number of Employees
                </label>
                <Input
                  type="number"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hours on Manual Tasks/Week
                </label>
                <Input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="text-lg"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-500 mb-2">
                    ${monthlySavings.toLocaleString()}
                  </div>
                  <div className="text-slate-600">Saved Per Month</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    ${yearlySavings.toLocaleString()}
                  </div>
                  <div className="text-slate-600">Saved Per Year</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-600 mb-4">
                  That's {Math.round(hoursPerWeek * 4)} hours saved per month at ${avgHourlyRate}/hour
                </p>
                <a href="#demo">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30">
                    Start Saving Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Get Started in 3 Simple Steps
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                <Workflow className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">1. Choose a Template</h3>
              <p className="text-slate-600">
                Pick from 50+ pre-built workflows for HR, Finance, Sales, and more
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">2. Customize with AI</h3>
              <p className="text-slate-600">
                Our AI Copilot helps you customize the workflow to your exact needs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">3. Save 20+ Hours/Week</h3>
              <p className="text-slate-600">
                Let automation handle the repetitive work while you focus on growth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Everything You Need to Automate Operations
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Workflow, title: 'Drag & Drop Builder', desc: 'Visual workflow builder - no coding required' },
              { icon: Bot, title: 'AI Copilot', desc: 'Natural language automation assistant' },
              { icon: Shield, title: 'Enterprise Security', desc: 'SOC2, HIPAA, GDPR compliant' },
              { icon: TrendingUp, title: 'Real-time Analytics', desc: 'Track efficiency gains and ROI' },
              { icon: CheckCircle2, title: '50+ Templates', desc: 'Pre-built workflows for every department' },
              { icon: Zap, title: 'Unlimited Integrations', desc: 'Connect any tool or database' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-cyan-500/20 transition-all group">
                <feature.icon className="w-10 h-10 text-cyan-500 mb-4 group-hover:text-orange-500 transition-colors" />
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="demo" className="py-16 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Get Your Free Operational Efficiency Audit
            </h2>
            <p className="text-slate-300">
              We'll analyze your current processes and show you exactly how much time and money you can save
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
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
                <label className="block text-sm font-medium mb-2">Company *</label>
                <Input
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="Acme Inc"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Industry *</label>
                <Input
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="Healthcare, Manufacturing, etc."
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">What's your biggest operational challenge?</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-24"
                placeholder="Tell us about your current pain points..."
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg h-14 shadow-lg shadow-orange-500/30"
            >
              {loading ? 'Sending...' : 'Get Free Audit'}
              <Calendar className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-sm text-slate-400 text-center mt-4">
              We'll respond within 24 hours with your personalized efficiency audit
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692cc4fe31f31eedd47e4c98/25b474da3_ChatGPTImageDec23202509_54_56PM.png" 
                alt="OpsVanta"
                className="h-10 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-sm">
                Enterprise AI-powered operations automation platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl('Pricing')} className="hover:text-white">Pricing</Link></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@opsvanta.com
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Enterprise Support
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-center md:text-left">
              <div>OmniOps is a product of OpsVanta LLC</div>
              <div className="text-xs text-slate-500 mt-1">© 2026 OpsVanta LLC. All rights reserved.</div>
            </div>
            <div className="flex gap-6">
              <Link to={createPageUrl('PrivacyPolicy')} className="hover:text-white">Privacy Policy</Link>
              <Link to={createPageUrl('TermsOfService')} className="hover:text-white">Terms of Service</Link>
              <Link to={createPageUrl('CookiePolicy')} className="hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}