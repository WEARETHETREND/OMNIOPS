import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap, TrendingUp, Building2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for testing and small projects',
    icon: Zap,
    features: [
      '5 workflows',
      '100 runs/month',
      '2 team members',
      'Basic analytics',
      'Community support',
      '24-hour data retention'
    ],
    limits: { workflows: 5, runs: 100, users: 2 },
    cta: 'Start Free',
    popular: false
  },
  {
    name: 'Starter',
    price: 99,
    description: 'For growing teams getting serious',
    icon: TrendingUp,
    features: [
      '25 workflows',
      '5,000 runs/month',
      '10 team members',
      'Advanced analytics',
      'AI Copilot',
      'Email support',
      '90-day data retention',
      'Custom integrations'
    ],
    limits: { workflows: 25, runs: 5000, users: 10 },
    cta: 'Start 14-day trial',
    popular: true
  },
  {
    name: 'Professional',
    price: 299,
    description: 'For teams that need scale',
    icon: Building2,
    features: [
      'Unlimited workflows',
      '50,000 runs/month',
      '50 team members',
      'Real-time analytics',
      'AI Copilot + training',
      'Priority support',
      '1-year data retention',
      'White-label options',
      'Compliance tools',
      'Audit logs',
      'SSO'
    ],
    limits: { workflows: -1, runs: 50000, users: 50 },
    cta: 'Start 14-day trial',
    popular: false
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'Custom solutions for large organizations',
    icon: Sparkles,
    features: [
      'Unlimited everything',
      'Dedicated infrastructure',
      'Unlimited team members',
      'Custom analytics & reports',
      'Dedicated AI training',
      '24/7 phone support',
      'Unlimited data retention',
      'Full white-label',
      'Custom compliance',
      'SLA guarantee',
      'On-premise option',
      'Account manager'
    ],
    limits: { workflows: -1, runs: -1, users: -1 },
    cta: 'Contact sales',
    popular: false
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(null);

  const handleSelectPlan = async (plan) => {
    setLoading(plan.name);

    try {
      if (plan.name === 'Free') {
        // Create free subscription
        await base44.entities.Subscription.create({
          plan: 'free',
          status: 'active',
          price_monthly: 0,
          workflows_limit: plan.limits.workflows,
          runs_limit_monthly: plan.limits.runs,
          users_limit: plan.limits.users,
          features: {
            ai_copilot: false,
            advanced_analytics: false,
            white_label: false,
            priority_support: false,
            custom_integrations: false,
            audit_logs: false
          }
        });
        base44.analytics.track({ eventName: 'plan_selected', properties: { plan: 'free' } });
        alert('Free plan activated! Redirecting to dashboard...');
        window.location.href = '/dashboard';
      } else if (plan.name === 'Enterprise') {
        // Redirect to contact form
        window.location.href = 'mailto:sales@opsvanta.com?subject=Enterprise Plan Inquiry';
      } else {
        // Check if running in iframe (preview mode)
        if (window.self !== window.top) {
          alert('⚠️ Checkout only works in published apps. Please publish your app to test payments.');
          setLoading(null);
          return;
        }

        // Start Stripe checkout for paid plans
        base44.analytics.track({ eventName: 'checkout_started', properties: { plan: plan.name.toLowerCase() } });
        
        const response = await base44.functions.invoke('createCheckout', {
          plan: plan.name.toLowerCase()
        });

        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error('Failed to create checkout session');
        }
      }
    } catch (error) {
      console.error('Plan selection error:', error);
      alert(`Error: ${error.message || 'Failed to process request'}`);
    }

    setLoading(null);
  };

  const getDiscount = () => billingCycle === 'annual' ? 0.2 : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Start free, scale as you grow. No hidden fees.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              billingCycle === 'annual'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const monthlyPrice = plan.price ? Math.round(plan.price * (1 - getDiscount())) : null;
          
          return (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl border-2 p-8 ${
                plan.popular
                  ? 'border-emerald-500 shadow-xl scale-105'
                  : 'border-slate-200 hover:border-slate-300'
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                {monthlyPrice !== null ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">${monthlyPrice}</span>
                      <span className="text-slate-500">/month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-sm text-slate-500 mt-1">
                        ${monthlyPrice * 12} billed annually
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-2xl font-bold text-slate-900">Custom pricing</div>
                )}
              </div>

              <Button
                onClick={() => handleSelectPlan(plan)}
                disabled={loading === plan.name}
                className={`w-full mb-6 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600'
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {loading === plan.name ? 'Processing...' : plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ROI Calculator */}
      <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Calculate your ROI</h2>
          <p className="text-slate-300 mb-8">
            OpsVanta customers save an average of 20 hours per week on manual tasks
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">20hrs</div>
              <div className="text-slate-400">saved per week</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">$2,400</div>
              <div className="text-slate-400">monthly value at $30/hr</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">8x</div>
              <div className="text-slate-400">ROI on Starter plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Can I change plans anytime?</h3>
            <p className="text-slate-600">
              Yes! Upgrade or downgrade anytime. Changes take effect immediately with prorated billing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">What happens after my trial ends?</h3>
            <p className="text-slate-600">
              Your card will be charged automatically. Cancel anytime before trial ends at no cost.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Do you offer refunds?</h3>
            <p className="text-slate-600">
              Yes! We offer a 30-day money-back guarantee, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}