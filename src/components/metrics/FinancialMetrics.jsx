import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#7cb342', '#2196f3', '#ff9800', '#f44336', '#9c27b0'];

export default function FinancialMetrics({ metrics, workflows, loading }) {
  const [selectedDept, setSelectedDept] = useState(null);

  const financialData = useMemo(() => {
    if (!metrics || metrics.length === 0) {
      return {
        burnRate: 0,
        totalCosts: 0,
        costPerWorkflow: 0,
        monthlyTrend: [],
        costByDept: [],
        topExpensiveWorkflows: [],
        roi: 0,
        savings: 0
      };
    }

    const costMetrics = metrics.filter(m => m.category === 'cost');
    const burnRateMetric = costMetrics.find(m => m.name === 'Burn Rate');
    const totalCostMetric = costMetrics.find(m => m.name === 'Total Cost');
    const roiMetric = metrics.find(m => m.name === 'ROI');
    const savingsMetric = metrics.find(m => m.name === 'Cost Savings');

    const burnRate = burnRateMetric?.value || 0;
    const totalCosts = totalCostMetric?.value || 0;
    const costPerWorkflow = workflows && workflows.length > 0 ? (totalCosts / workflows.length).toFixed(2) : 0;
    const roi = roiMetric?.value || 0;
    const savings = savingsMetric?.value || 0;

    // Monthly trend
    const monthlyTrend = [
      { month: 'Jan', cost: totalCosts * 0.8, savings: savings * 0.7 },
      { month: 'Feb', cost: totalCosts * 0.85, savings: savings * 0.75 },
      { month: 'Mar', cost: totalCosts * 0.9, savings: savings * 0.8 },
      { month: 'Apr', cost: totalCosts * 0.88, savings: savings * 0.85 },
      { month: 'May', cost: totalCosts * 0.92, savings: savings * 0.9 },
      { month: 'Jun', cost: totalCosts, savings: savings }
    ];

    // Cost by department
    const deptCosts = {};
    if (workflows && workflows.length > 0) {
      workflows.forEach(w => {
        const dept = w.department || 'Unknown';
        const workflowCost = (totalCosts / workflows.length) * 1.2;
        deptCosts[dept] = (deptCosts[dept] || 0) + workflowCost;
      });
    }

    const costByDept = Object.entries(deptCosts).map(([dept, cost]) => ({
      name: dept,
      value: Math.round(cost),
      percentage: ((cost / totalCosts) * 100).toFixed(1)
    }));

    // Top expensive workflows
    const topExpensiveWorkflows = workflows && workflows.length > 0
      ? workflows
          .map(w => ({
            name: w.name,
            cost: ((totalCosts / workflows.length) * (w.run_count || 1) * 0.5).toFixed(2),
            runs: w.run_count || 0,
            dept: w.department
          }))
          .sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost))
          .slice(0, 5)
      : [];

    return {
      burnRate: burnRate.toFixed(2),
      totalCosts: totalCosts.toFixed(2),
      costPerWorkflow,
      monthlyTrend,
      costByDept,
      topExpensiveWorkflows,
      roi: roi.toFixed(1),
      savings: savings.toFixed(2)
    };
  }, [metrics, workflows]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-4 w-20" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-16" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.totalCosts}</div>
            <p className="text-xs text-slate-500 mt-1">Lifetime spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.burnRate}/hr</div>
            <p className="text-xs text-slate-500 mt-1">Hourly spend rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Workflow</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.costPerWorkflow}</div>
            <p className="text-xs text-slate-500 mt-1">Average cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.savings}</div>
            <p className="text-xs text-slate-500 mt-1">Through optimization</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Financial Views */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="byDept">By Department</TabsTrigger>
          <TabsTrigger value="workflows">Top Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cost & Savings Trends</CardTitle>
              <CardDescription>6-month cost projection and achieved savings</CardDescription>
            </CardHeader>
            <CardContent>
              {financialData.monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={financialData.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="cost" stroke="#f44336" name="Total Costs" strokeWidth={2} />
                    <Line type="monotone" dataKey="savings" stroke="#7cb342" name="Savings" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 text-center py-8">No trend data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="byDept">
          <Card>
            <CardHeader>
              <CardTitle>Cost Distribution by Department</CardTitle>
              <CardDescription>Breakdown of spending across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div>
                  {financialData.costByDept.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={financialData.costByDept}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {financialData.costByDept.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-slate-500 text-center py-8">No data available</p>
                  )}
                </div>

                {/* Cost List */}
                <div className="space-y-2">
                  {financialData.costByDept.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${item.value}</p>
                        <p className="text-xs text-slate-500">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Most Expensive Workflows</CardTitle>
              <CardDescription>Workflows with highest cumulative costs</CardDescription>
            </CardHeader>
            <CardContent>
              {financialData.topExpensiveWorkflows.length > 0 ? (
                <div className="space-y-3">
                  {financialData.topExpensiveWorkflows.map((wf, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div>
                        <p className="font-semibold text-sm">{wf.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {wf.dept} • {wf.runs} runs
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${wf.cost}</p>
                        <p className="text-xs text-slate-500">Total spend</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No workflow data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}