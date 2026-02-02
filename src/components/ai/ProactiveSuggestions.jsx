import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lightbulb, TrendingUp, AlertTriangle, Zap, CheckCircle2, X
} from 'lucide-react';

export default function ProactiveSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSuggestions();
  }, []);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      // Fetch data for analysis
      const [workflows, dispatches, alerts] = await Promise.all([
        base44.entities.Workflow.list('-run_count', 10),
        base44.entities.Dispatch.filter({ status: { $in: ['queued', 'en_route', 'in_progress'] } }),
        base44.entities.Alert.filter({ status: 'new' }, '-created_date', 5)
      ]);

      const newSuggestions = [];

      // Workflow optimization suggestions
      const lowSuccessWorkflows = workflows.filter(w => w.success_rate < 90);
      if (lowSuccessWorkflows.length > 0) {
        newSuggestions.push({
          id: 'workflow-optimize',
          type: 'optimization',
          priority: 'high',
          title: 'Optimize Low-Performing Workflows',
          description: `${lowSuccessWorkflows.length} workflows have success rates below 90%. Review error logs and add retry logic.`,
          action: 'Review Workflows',
          icon: TrendingUp
        });
      }

      // Dispatch bottleneck predictions
      const urgentDispatches = dispatches.filter(d => d.priority === 'urgent');
      if (urgentDispatches.length > 5) {
        newSuggestions.push({
          id: 'dispatch-bottleneck',
          type: 'warning',
          priority: 'urgent',
          title: 'Potential Dispatch Bottleneck',
          description: `${urgentDispatches.length} urgent jobs queued. Consider reallocating resources or scheduling overtime.`,
          action: 'View Dispatches',
          icon: AlertTriangle
        });
      }

      // Workflow automation suggestions
      const manualWorkflows = workflows.filter(w => w.trigger_type === 'manual');
      if (manualWorkflows.length > 3) {
        newSuggestions.push({
          id: 'automate-workflows',
          type: 'optimization',
          priority: 'medium',
          title: 'Automation Opportunity',
          description: `${manualWorkflows.length} workflows are manually triggered. Consider adding scheduled or event-based triggers.`,
          action: 'Set Up Automation',
          icon: Zap
        });
      }

      // Alert consolidation
      if (alerts.length > 10) {
        newSuggestions.push({
          id: 'alert-consolidation',
          type: 'info',
          priority: 'low',
          title: 'Alert Overload',
          description: `${alerts.length} new alerts require attention. Consider consolidating similar alerts to reduce noise.`,
          action: 'Review Alerts',
          icon: Lightbulb
        });
      }

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
    setLoading(false);
  };

  const handleDismiss = (id) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  if (loading || suggestions.length === 0) return null;

  return (
    <div className="space-y-3">
      {suggestions.map(suggestion => {
        const Icon = suggestion.icon;
        return (
          <Card key={suggestion.id} className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{suggestion.title}</h3>
                      <Badge className={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{suggestion.description}</p>
                    <Button size="sm" variant="outline">
                      {suggestion.action}
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDismiss(suggestion.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}