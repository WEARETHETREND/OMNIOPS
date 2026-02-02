import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch workflow runs and metrics
    const [runs, workflows, metrics] = await Promise.all([
      base44.entities.Workflow.list('-updated_date', 50),
      base44.entities.Workflow.list('-created_date', 20),
      base44.entities.Metric.list('-updated_date', 30)
    ]);

    // Analyze patterns
    const optimizations = [];
    const failurePatterns = {};
    const performanceMetrics = {};

    // Group runs by workflow
    for (const workflow of workflows) {
      const workflowRuns = runs.filter(r => r.name === workflow.name);
      
      if (workflowRuns.length > 5) {
        // Calculate average duration
        const durations = workflowRuns
          .filter(r => r.avg_duration)
          .map(r => r.avg_duration);
        
        const avgDuration = durations.length > 0 
          ? durations.reduce((a, b) => a + b) / durations.length 
          : 0;
        
        // Check success rate
        const successRate = workflow.success_rate || 0;
        
        if (successRate < 85) {
          optimizations.push({
            type: 'reliability',
            workflow_id: workflow.id,
            workflow_name: workflow.name,
            issue: 'Low success rate detected',
            current_value: successRate,
            target_value: 95,
            recommendation: 'Add error handling and retry logic',
            priority: successRate < 70 ? 'high' : 'medium',
            potential_impact: `Could improve success rate by ${95 - successRate}%`
          });
        }

        if (avgDuration > 300) {
          optimizations.push({
            type: 'performance',
            workflow_id: workflow.id,
            workflow_name: workflow.name,
            issue: 'Slow execution detected',
            current_value: avgDuration,
            target_value: 120,
            recommendation: 'Parallelize steps or optimize integrations',
            priority: avgDuration > 600 ? 'high' : 'medium',
            potential_impact: `Could reduce execution time by ${Math.round((avgDuration - 120) / avgDuration * 100)}%`
          });
        }
      }
    }

    // Check for resource exhaustion patterns
    const memoryMetric = metrics.find(m => m.name === 'Memory Usage');
    const cpuMetric = metrics.find(m => m.name === 'CPU Usage');
    
    if (memoryMetric && memoryMetric.value > 80) {
      optimizations.push({
        type: 'scaling',
        issue: 'Memory exhaustion risk detected',
        current_value: memoryMetric.value,
        threshold: 80,
        recommendation: 'Scale up memory resources or optimize memory usage',
        priority: 'critical',
        action_available: 'trigger_scaling',
        scale_factor: 1.5
      });
    }

    if (cpuMetric && cpuMetric.value > 85) {
      optimizations.push({
        type: 'scaling',
        issue: 'CPU exhaustion risk detected',
        current_value: cpuMetric.value,
        threshold: 85,
        recommendation: 'Increase compute resources or distribute load',
        priority: 'high',
        action_available: 'trigger_scaling',
        scale_factor: 1.25
      });
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    optimizations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return Response.json({
      optimizations: optimizations.slice(0, 10),
      summary: {
        total_opportunities: optimizations.length,
        critical: optimizations.filter(o => o.priority === 'critical').length,
        high: optimizations.filter(o => o.priority === 'high').length
      }
    });
  } catch (error) {
    console.error('Optimization analysis error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});