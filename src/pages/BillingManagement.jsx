import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Calendar,
  TrendingUp,
  Download,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { createPageUrl } from './utils';

export default function BillingManagement() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.entities.Subscription.filter({ created_by: user?.email })
  });

  const { data: usageEvents = [] } = useQuery({
    queryKey: ['usage-events'],
    queryFn: () => base44.entities.UsageEvent.filter({ user_email: user?.email }, '-created_date', 100)
  });

  const activeSubscription = subscriptions.find(s => s.status === 'active') || subscriptions[0];

  const currentUsage = {
    workflows: usageEvents.filter(e => e.event_type === 'workflow_created').length,
    runs: usageEvents.filter(e => e.event_type === 'workflow_run').length,
    users: usageEvents.filter(e => e.event_type === 'user_invited').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'trialing': return 'bg-blue-100 text-blue-700';
      case 'past_due': return 'bg-red-100 text-red-700';
      case 'canceled': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getUsagePercentage = (current, limit) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min(100, (current / limit) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Subscription</CardTitle>
            {activeSubscription && (
              <Badge className={getStatusColor(activeSubscription.status)}>
                {activeSubscription.status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeSubscription ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 capitalize mb-1">
                    {activeSubscription.plan} Plan
                  </h3>
                  <p className="text-slate-600">
                    ${activeSubscription.price_monthly}/month
                  </p>
                </div>
                <Button onClick={() => window.location.href = createPageUrl('Pricing')}>
                  Upgrade Plan
                </Button>
              </div>

              {activeSubscription.trial_ends_at && new Date(activeSubscription.trial_ends_at) > new Date() && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Trial Active</p>
                      <p className="text-sm text-blue-700">
                        Ends {new Date(activeSubscription.trial_ends_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Usage Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Workflows</span>
                    <span className="text-sm font-medium">
                      {currentUsage.workflows} / {activeSubscription.workflows_limit === -1 ? '∞' : activeSubscription.workflows_limit}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${getUsagePercentage(currentUsage.workflows, activeSubscription.workflows_limit)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Monthly Runs</span>
                    <span className="text-sm font-medium">
                      {currentUsage.runs} / {activeSubscription.runs_limit_monthly === -1 ? '∞' : activeSubscription.runs_limit_monthly}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${getUsagePercentage(currentUsage.runs, activeSubscription.runs_limit_monthly)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Team Members</span>
                    <span className="text-sm font-medium">
                      {currentUsage.users} / {activeSubscription.users_limit === -1 ? '∞' : activeSubscription.users_limit}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 transition-all"
                      style={{ width: `${getUsagePercentage(currentUsage.users, activeSubscription.users_limit)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Plan Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeSubscription.features && Object.entries(activeSubscription.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center gap-2">
                      {enabled ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-slate-300" />
                      )}
                      <span className={enabled ? 'text-slate-900' : 'text-slate-400'}>
                        {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No active subscription</h3>
              <p className="text-slate-600 mb-4">Choose a plan to get started</p>
              <Button onClick={() => window.location.href = createPageUrl('Pricing')}>
                View Plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Billing History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSubscription ? (
              <>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {activeSubscription.plan.charAt(0).toUpperCase() + activeSubscription.plan.slice(1)} Plan
                      </p>
                      <p className="text-sm text-slate-500">
                        {activeSubscription.current_period_start ? 
                          new Date(activeSubscription.current_period_start).toLocaleDateString() : 
                          'Current period'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">${activeSubscription.price_monthly}</p>
                    <Badge className="bg-green-100 text-green-700 text-xs">Paid</Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No billing history yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-slate-500">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}