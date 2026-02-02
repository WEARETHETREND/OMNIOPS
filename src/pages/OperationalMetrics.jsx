import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import WorkflowPerformance from '@/components/metrics/WorkflowPerformance.jsx';
import ResourceUtilization from '@/components/metrics/ResourceUtilization.jsx';
import FinancialMetrics from '@/components/metrics/FinancialMetrics.jsx';

export default function OperationalMetrics() {
  const [workflows, setWorkflows] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [workflowData, metricsData, alertsData] = await Promise.all([
          base44.entities.Workflow.list('-updated_date', 50),
          base44.entities.Metric.list('-updated_date', 100),
          base44.entities.Alert.filter({ status: 'new' }, '-created_date', 10)
        ]);
        
        setWorkflows(workflowData);
        setMetrics(metricsData);
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Operational Metrics</h1>
        <p className="text-slate-500 mt-1">Monitor workflow performance, resource utilization, and financial metrics</p>
      </div>

      {/* Active Alerts Summary */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-start gap-4 pt-6">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-orange-900">{alerts.length} Active Alert{alerts.length !== 1 ? 's' : ''}</p>
              <p className="text-sm text-orange-800 mt-1">
                {alerts[0]?.message || 'Review alerts for potential issues'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Tabs */}
      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Workflow Performance</TabsTrigger>
          <TabsTrigger value="resources">Resource Utilization</TabsTrigger>
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <WorkflowPerformance workflows={workflows} metrics={metrics} loading={loading} />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <ResourceUtilization metrics={metrics} loading={loading} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialMetrics metrics={metrics} workflows={workflows} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}