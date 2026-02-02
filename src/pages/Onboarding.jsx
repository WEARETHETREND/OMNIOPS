import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from './utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  Building2,
  Users,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const steps = [
  {
    id: 'company',
    title: 'Company Information',
    description: 'Tell us about your business'
  },
  {
    id: 'team',
    title: 'Team Setup',
    description: 'Configure your team structure'
  },
  {
    id: 'demo',
    title: 'Load Demo Data',
    description: 'See the platform in action'
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: 'technology',
    company_size: '11-50',
    use_case: 'field_services'
  });

  const generateDemoData = async () => {
    setLoading(true);

    try {
      // Create demo workflows
      const workflows = [
        {
          name: 'Customer Onboarding',
          description: 'Automated customer onboarding workflow',
          department: 'customer_service',
          trigger_type: 'event_based',
          status: 'active',
          priority: 'high',
          run_count: 156,
          success_rate: 94
        },
        {
          name: 'Daily Inventory Sync',
          description: 'Sync inventory data from multiple sources',
          department: 'operations',
          trigger_type: 'scheduled',
          schedule: '0 2 * * *',
          status: 'active',
          priority: 'medium',
          run_count: 89,
          success_rate: 98
        },
        {
          name: 'Emergency Dispatch',
          description: 'Urgent service dispatch workflow',
          department: 'logistics',
          trigger_type: 'manual',
          status: 'active',
          priority: 'critical',
          run_count: 34,
          success_rate: 100
        }
      ];

      for (const workflow of workflows) {
        await base44.entities.Workflow.create(workflow);
      }

      // Create demo metrics
      const metrics = [
        {
          name: 'Workflow Success Rate',
          category: 'performance',
          value: 96,
          unit: '%',
          target: 95,
          trend: 'up',
          department: 'company'
        },
        {
          name: 'Cost Savings',
          category: 'cost',
          value: 45000,
          unit: '$',
          target: 50000,
          trend: 'up',
          department: 'company'
        },
        {
          name: 'Active Automations',
          category: 'efficiency',
          value: 23,
          unit: 'count',
          target: 30,
          trend: 'up',
          department: 'company'
        }
      ];

      for (const metric of metrics) {
        await base44.entities.Metric.create(metric);
      }

      // Create customer records
      await base44.entities.Customer.create({
        company_name: formData.company_name || 'Demo Company',
        industry: formData.industry,
        company_size: formData.company_size,
        primary_contact: 'Demo User',
        lifetime_value: 125000,
        success_score: 85,
        onboarding_completed: true
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setLoading(false);
      
      setTimeout(() => {
        window.location.href = createPageUrl('Dashboard');
      }, 1500);
    } catch (error) {
      console.error('Demo data error:', error);
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      await generateDemoData();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'company':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input
                placeholder="Acme Corp"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="text-lg"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Industry</Label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                >
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="finance">Finance</option>
                  <option value="field_services">Field Services</option>
                  <option value="logistics">Logistics</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Company Size</Label>
                <select
                  value={formData.company_size}
                  onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Primary Use Case</h3>
              <p className="text-sm text-slate-600 mb-4">What will you use OpsVanta for?</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'field_services', label: 'Field Service Dispatch', icon: Zap },
                  { value: 'workflow_automation', label: 'Workflow Automation', icon: Sparkles },
                  { value: 'operations', label: 'Operations Management', icon: Building2 },
                  { value: 'customer_success', label: 'Customer Success', icon: Users }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, use_case: option.value })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.use_case === option.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <option.icon className="w-5 h-5 text-slate-700" />
                      <span className="font-medium text-slate-900">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'demo':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to explore?</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                We'll load demo workflows, metrics, and sample data so you can see the platform in action
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 max-w-md mx-auto">
              <h4 className="font-semibold text-emerald-900 mb-3">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>3 pre-configured workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Live performance metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Sample customer data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Full platform access</span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl">
        <CardContent className="pt-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-slate-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex items-center ${idx < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  idx <= currentStep
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {idx < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{idx + 1}</span>
                  )}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    idx < currentStep ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-slate-100'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{steps[currentStep].title}</h2>
            <p className="text-slate-600 mb-8">{steps[currentStep].description}</p>
            {renderStepContent()}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || loading}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading || (currentStep === 0 && !formData.company_name)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Setting up...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}