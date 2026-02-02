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
      // Fetch operational data
      const [workflows, dispatches, alerts] = await Promise.all([
        base44.entities.Workflow.list('-run_count', 10),
        base44.entities.Dispatch.filter({ status: { $in: ['queued', 'en_route', 'in_progress'] } }),
        base44.entities.Alert.filter({ status: 'new' }, '-created_date', 10)
      ]);

      // Use AI to analyze and generate suggestions
      const prompt = `Analyze this operational data and suggest 2-3 impactful optimizations:

WORKFLOWS (${workflows.length} total):
${JSON.stringify(workflows.slice(0, 5).map(w => ({
  name: w.name,
  success_rate: w.success_rate,
  trigger: w.trigger_type,
  avg_duration: w.avg_duration,
  run_count: w.run_count
})), null, 2)}

ACTIVE DISPATCHES (${dispatches.length} total):
${JSON.stringify(dispatches.slice(0, 5).map(d => ({
  job: d.job_title,
  status: d.status,
  priority: d.priority,
  worker: d.worker_name
})), null, 2)}

RECENT ALERTS (${alerts.length} total):
${JSON.stringify(alerts.slice(0, 3).map(a => ({
  title: a.title,
  severity: a.severity,
  category: a.category
})), null, 2)}

For each suggestion, provide:
1. title: Brief title
2. description: Specific, actionable insight
3. priority: urgent|high|medium|low
4. icon_type: optimization|warning|info

Format as JSON array with these exact fields.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  priority: { type: 'string' },
                  icon_type: { type: 'string' }
                }
              }
            }
          }
        }
      });

      const iconMap = {
        'optimization': TrendingUp,
        'warning': AlertTriangle,
        'info': Lightbulb
      };

      const newSuggestions = (result.suggestions || []).map((s, idx) => ({
        id: `suggestion-${idx}`,
        type: s.icon_type || 'info',
        priority: s.priority || 'medium',
        title: s.title,
        description: s.description,
        action: 'View Details',
        icon: iconMap[s.icon_type] || Lightbulb
      }));

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