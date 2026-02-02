import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, TrendingUp, Users } from 'lucide-react';

export default function BottleneckPredictor() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzePotentialBottlenecks();
  }, []);

  const analyzePotentialBottlenecks = async () => {
    setLoading(true);
    try {
      const [dispatches, workflows] = await Promise.all([
        base44.entities.Dispatch.list(),
        base44.entities.Workflow.list()
      ]);

      const issues = [];

      // Analyze dispatch workload
      const activeDispatches = dispatches.filter(d => 
        ['queued', 'en_route', 'in_progress'].includes(d.status)
      );
      
      const workerLoad = {};
      activeDispatches.forEach(d => {
        workerLoad[d.worker_name] = (workerLoad[d.worker_name] || 0) + 1;
      });

      // Identify overloaded workers
      Object.entries(workerLoad).forEach(([worker, count]) => {
        if (count > 5) {
          issues.push({
            type: 'worker_overload',
            severity: 'high',
            title: 'Worker Overload Detected',
            description: `${worker} has ${count} active jobs - recommend redistribution`,
            metric: count,
            icon: Users
          });
        }
      });

      // Check for time-sensitive jobs
      const urgentOld = activeDispatches.filter(d => {
        if (d.priority === 'urgent' && d.created_date) {
          const hoursSinceCreation = (Date.now() - new Date(d.created_date).getTime()) / (1000 * 60 * 60);
          return hoursSinceCreation > 2;
        }
        return false;
      });

      if (urgentOld.length > 0) {
        issues.push({
          type: 'urgent_delays',
          severity: 'urgent',
          title: 'Delayed Urgent Jobs',
          description: `${urgentOld.length} urgent jobs waiting over 2 hours`,
          metric: urgentOld.length,
          icon: AlertTriangle
        });
      }

      // Workflow execution time analysis
      const slowWorkflows = workflows.filter(w => w.avg_duration > 300);
      if (slowWorkflows.length > 0) {
        issues.push({
          type: 'slow_workflows',
          severity: 'medium',
          title: 'Slow Workflow Performance',
          description: `${slowWorkflows.length} workflows averaging over 5 minutes`,
          metric: slowWorkflows.length,
          icon: Clock
        });
      }

      setPredictions(issues);
    } catch (error) {
      console.error('Error analyzing bottlenecks:', error);
    }
    setLoading(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading || predictions.length === 0) return null;

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <AlertTriangle className="w-5 h-5" />
          Predicted Bottlenecks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {predictions.map((prediction, idx) => {
          const Icon = prediction.icon;
          return (
            <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <div className={`w-10 h-10 rounded-lg ${getSeverityColor(prediction.severity)} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900">{prediction.title}</h4>
                  <Badge className="bg-orange-200 text-orange-900 capitalize">
                    {prediction.severity}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{prediction.description}</p>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {prediction.metric}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}