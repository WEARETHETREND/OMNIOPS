import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#7cb342', '#2196f3', '#ff9800', '#f44336'];

export default function WorkflowPerformance({ workflows, metrics, loading }) {
  const stats = useMemo(() => {
    if (!workflows || workflows.length === 0) {
      return {
        totalWorkflows: 0,
        avgSuccessRate: 0,
        avgDuration: 0,
        totalRuns: 0,
        successTrend: 0,
        durationTrend: 0,
        performanceByDept: [],
        statusDistribution: []
      };
    }

    // Calculate aggregate stats
    const totalWorkflows = workflows.length;
    const successRates = workflows
      .filter(w => w.success_rate !== undefined)
      .map(w => w.success_rate);
    const avgSuccessRate = successRates.length > 0 
      ? (successRates.reduce((a, b) => a + b) / successRates.length).toFixed(1)
      : 0;
    
    const durations = workflows
      .filter(w => w.avg_duration !== undefined)
      .map(w => w.avg_duration);
    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b) / durations.length)
      : 0;

    const totalRuns = workflows.reduce((sum, w) => sum + (w.run_count || 0), 0);

    // Group by department
    const byDept = {};
    workflows.forEach(w => {
      const dept = w.department || 'Unknown';
      if (!byDept[dept]) byDept[dept] = { count: 0, avgSuccess: 0, total: 0 };
      byDept[dept].count++;
      byDept[dept].total += w.success_rate || 0;
    });

    const performanceByDept = Object.entries(byDept).map(([dept, data]) => ({
      name: dept,
      'Workflows': data.count,
      'Success Rate': parseFloat((data.total / data.count).toFixed(1))
    }));

    // Status distribution
    const statusDist = {
      active: workflows.filter(w => w.status === 'active').length,
      paused: workflows.filter(w => w.status === 'paused').length,
      draft: workflows.filter(w => w.status === 'draft').length,
      archived: workflows.filter(w => w.status === 'archived').length
    };

    const statusDistribution = [
      { name: 'Active', value: statusDist.active },
      { name: 'Paused', value: statusDist.paused },
      { name: 'Draft', value: statusDist.draft },
      { name: 'Archived', value: statusDist.archived }
    ].filter(s => s.value > 0);

    return {
      totalWorkflows,
      avgSuccessRate,
      avgDuration,
      totalRuns,
      performanceByDept,
      statusDistribution
    };
  }, [workflows]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
            <p className="text-xs text-slate-500 mt-1">Active workflows in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSuccessRate}%</div>
            <p className="text-xs text-slate-500 mt-1">Across all workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration}s</div>
            <p className="text-xs text-slate-500 mt-1">Average execution time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRuns}</div>
            <p className="text-xs text-slate-500 mt-1">Lifetime executions</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <Tabs defaultValue="byDept" className="space-y-4">
        <TabsList>
          <TabsTrigger value="byDept">By Department</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="byDept">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance by Department</CardTitle>
              <CardDescription>Success rates and workflow count per department</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.performanceByDept.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.performanceByDept}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Workflows" fill="#7cb342" />
                    <Bar dataKey="Success Rate" fill="#2196f3" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 text-center py-8">No data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Status Distribution</CardTitle>
              <CardDescription>Distribution of workflows by status</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.statusDistribution.length > 0 ? (
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}