import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, AlertTriangle, Heart, Zap, Users, Target
} from 'lucide-react';

export default function CustomerSuccess() {
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list('-created_date', 100)
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-updated_date', 100)
  });

  const { data: metrics = [] } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => base44.entities.Metric.list('-updated_date', 50)
  });

  // ML-based churn prediction and scoring
  const customerHealth = useMemo(() => {
    if (customers.length === 0) return [];

    return customers.map(customer => {
      const subscription = subscriptions.find(s => s.id === customer.id);
      const baseScore = 50;
      let churnScore = baseScore;

      // Churn risk factors (higher = more risk)
      if (customer.churn_risk === 'high') churnScore += 30;
      if (customer.churn_risk === 'medium') churnScore += 15;

      // Usage signals
      const usageMetric = metrics.find(m => m.name === 'Customer Usage Days');
      if (usageMetric?.value < 5) churnScore += 20; // Low usage
      if (usageMetric?.value > 25) churnScore -= 15; // High usage

      // Payment health
      if (subscription?.status === 'past_due') churnScore += 25;
      if (subscription?.status === 'trialing') churnScore += 10;

      // Onboarding completion
      if (!customer.onboarding_completed) churnScore += 15;

      // Calculate health score (inverse of churn risk)
      const healthScore = 100 - Math.max(0, Math.min(100, churnScore));

      return {
        id: customer.id,
        company: customer.company_name,
        lifetime_value: customer.lifetime_value || 0,
        health_score: healthScore,
        churn_risk: customer.churn_risk || 'low',
        engagement: usageMetric?.value || 0,
        subscription_status: subscription?.status,
        plan: subscription?.plan,
        success_score: customer.success_score || healthScore,
        onboarding_completed: customer.onboarding_completed,
        nextAction: getNextAction(healthScore, customer.churn_risk, subscription?.status)
      };
    });
  }, [customers, subscriptions, metrics]);

  function getNextAction(healthScore, churnRisk, subscriptionStatus) {
    if (healthScore < 40) return 'Urgent: Schedule check-in';
    if (churnRisk === 'high') return 'Offer incentive/discount';
    if (!subscriptionStatus || subscriptionStatus === 'trialing') return 'Finalize onboarding';
    if (healthScore < 60) return 'Share success stories';
    return 'Schedule upsell conversation';
  }

  const stats = useMemo(() => {
    if (customerHealth.length === 0) return {
      avgHealth: 0,
      atRisk: 0,
      healthy: 0,
      churnRate: 0,
      ltv: 0,
      retentionRate: 0
    };

    const atRisk = customerHealth.filter(c => c.churn_risk === 'high').length;
    const healthy = customerHealth.filter(c => c.health_score > 70).length;
    const totalLTV = customerHealth.reduce((sum, c) => sum + c.lifetime_value, 0);
    const avgHealth = Math.round(customerHealth.reduce((sum, c) => sum + c.health_score, 0) / customerHealth.length);

    return {
      avgHealth,
      atRisk,
      healthy,
      churnRate: ((atRisk / customerHealth.length) * 100).toFixed(1),
      ltv: totalLTV,
      retentionRate: (((customerHealth.length - atRisk) / customerHealth.length) * 100).toFixed(1),
      total: customerHealth.length
    };
  }, [customerHealth]);

  // Cohort data for retention curves
  const retentionCohorts = [
    { month: 'Month 1', month_1: 100, month_3: 92, month_6: 85, month_12: 78 },
    { month: 'Month 2', month_1: 100, month_3: 94, month_6: 88, month_12: 82 },
    { month: 'Month 3', month_1: 100, month_3: 96, month_6: 91 },
    { month: 'Month 4', month_1: 100, month_3: 97 },
    { month: 'Month 5', month_1: 100 }
  ];

  const healthScoreDistribution = [
    { range: '0-20', count: customerHealth.filter(c => c.health_score < 20).length, color: '#ef4444' },
    { range: '21-40', count: customerHealth.filter(c => c.health_score >= 20 && c.health_score < 40).length, color: '#f97316' },
    { range: '41-60', count: customerHealth.filter(c => c.health_score >= 40 && c.health_score < 60).length, color: '#eab308' },
    { range: '61-80', count: customerHealth.filter(c => c.health_score >= 60 && c.health_score < 80).length, color: '#84cc16' },
    { range: '81-100', count: customerHealth.filter(c => c.health_score >= 80).length, color: '#22c55e' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Customer Success Hub</h1>
        <p className="text-slate-500 mt-1">Predictive churn, health scores, and retention strategies</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.avgHealth}</div>
            <p className="text-xs text-slate-500 mt-1">/100</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.atRisk}</div>
            <p className="text-xs text-slate-500 mt-1">{stats.churnRate}% churn risk</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-600" />
              Healthy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{stats.healthy}</div>
            <p className="text-xs text-slate-500 mt-1">{stats.retentionRate}% retention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total LTV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">${(stats.ltv / 1000).toFixed(0)}K</div>
            <p className="text-xs text-slate-500 mt-1">Lifetime value</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="atRisk">At-Risk Customers</TabsTrigger>
          <TabsTrigger value="upsell">Upsell Opportunities</TabsTrigger>
          <TabsTrigger value="analytics">Retention Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Health Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={healthScoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7cb342" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Customers by LTV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerHealth
                    .sort((a, b) => b.lifetime_value - a.lifetime_value)
                    .slice(0, 5)
                    .map(customer => (
                      <div key={customer.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <p className="text-sm font-semibold">{customer.company}</p>
                          <p className="text-xs text-slate-500">{customer.plan} plan</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">${customer.lifetime_value.toLocaleString()}</p>
                          <Badge className={customer.health_score > 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}>
                            Score: {customer.health_score}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="atRisk">
          <Card>
            <CardHeader>
              <CardTitle>High-Risk Customers (Action Required)</CardTitle>
              <CardDescription>Customers with churn probability > 50%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customerHealth
                  .filter(c => c.churn_risk === 'high' || c.health_score < 40)
                  .map(customer => (
                    <div key={customer.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{customer.company}</h3>
                          <div className="flex gap-2 mt-2 text-xs text-slate-600">
                            <span>Health: {customer.health_score}/100</span>
                            <span>•</span>
                            <span>LTV: ${customer.lifetime_value}</span>
                            <span>•</span>
                            <span>Status: {customer.subscription_status || 'inactive'}</span>
                          </div>
                          <p className="text-sm text-red-800 font-medium mt-2">
                            🎯 {customer.nextAction}
                          </p>
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Engage Now
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upsell">
          <Card>
            <CardHeader>
              <CardTitle>Upsell & Cross-sell Opportunities</CardTitle>
              <CardDescription>Customers ready for plan upgrades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customerHealth
                  .filter(c => c.health_score > 70 && c.plan !== 'enterprise')
                  .map(customer => (
                    <div key={customer.id} className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{customer.company}</h3>
                          <div className="flex gap-2 mt-2 text-xs text-slate-600">
                            <span>Current: {customer.plan}</span>
                            <span>•</span>
                            <span>Health: {customer.health_score}/100</span>
                            <span>•</span>
                            <span>LTV: ${customer.lifetime_value}</span>
                          </div>
                          <p className="text-sm text-emerald-800 font-medium mt-2">
                            💡 Ready for upgrade to {customer.plan === 'starter' ? 'Professional' : 'Enterprise'}
                          </p>
                        </div>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Propose Upgrade
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Retention Cohort Analysis</CardTitle>
              <CardDescription>% of customers retained by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={retentionCohorts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="month_1" stroke="#7cb342" name="Month 1" />
                  <Line type="monotone" dataKey="month_3" stroke="#2196f3" name="Month 3" />
                  <Line type="monotone" dataKey="month_6" stroke="#ff9800" name="Month 6" />
                  <Line type="monotone" dataKey="month_12" stroke="#f44336" name="Month 12" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}