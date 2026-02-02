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

      const activeDispatches = dispatches.filter(d => 
        ['queued', 'en_route', 'in_progress'].includes(d.status)
      );

      // Use AI to predict bottlenecks
      const prompt = `Analyze this system data and identify 2-3 critical bottlenecks or risks:

DISPATCHES (${activeDispatches.length} active):
${JSON.stringify(activeDispatches.slice(0, 10).map(d => ({
  job: d.job_title,
  worker: d.worker_name,
  priority: d.priority,
  status: d.status,
  created_date: d.created_date
})), null, 2)}

WORKFLOWS (${workflows.length} total):
${JSON.stringify(workflows.map(w => ({
  name: w.name,
  avg_duration: w.avg_duration,
  success_rate: w.success_rate,
  run_count: w.run_count
})).slice(0, 8), null, 2)}

For each bottleneck, provide:
1. title: Clear issue title
2. description: Why this matters and impact
3. severity: urgent|high|medium
4. metric: A number representing scope/impact

Format as JSON array with these exact fields.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            bottlenecks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  severity: { type: 'string' },
                  metric: { type: 'number' }
                }
              }
            }
          }
        }
      });

      const iconMap = {
        'urgent': AlertTriangle,
        'high': AlertTriangle,
        'medium': Clock,
        'low': Clock
      };

      const issues = (result.bottlenecks || []).map(b => ({
        type: b.severity,
        severity: b.severity || 'medium',
        title: b.title,
        description: b.description,
        metric: b.metric || 0,
        icon: iconMap[b.severity] || Clock
      }));

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