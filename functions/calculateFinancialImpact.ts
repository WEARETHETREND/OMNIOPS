import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get active failures and issues
    const [alerts, failedWorkflows, queuedDispatches] = await Promise.all([
      base44.entities.Alert.filter({ severity: 'error', status: 'new' }, '-created_date', 50),
      base44.entities.Workflow.filter({ status: 'active' }),
      base44.entities.Dispatch.filter({ status: 'queued' })
    ]);

    // Calculate costs
    const impacts = [];

    // Error impact: $50 per failed workflow, $5 per minute in queue
    alerts.forEach(alert => {
      const impact = {
        entity_type: alert.category === 'workflow' ? 'workflow' : 'alert',
        entity_id: alert.id,
        impact_type: 'cost',
        amount_usd: 50,
        hourly_rate: 50 * 6, // 6 failures per hour if trend continues
        daily_projection: 50 * 6 * 24,
        severity: alert.severity === 'critical' ? 'critical' : 'high',
        description: `Error in ${alert.source} - ${alert.title}`,
        status: 'active'
      };
      impacts.push(impact);
    });

    // Dispatch queue impact: $2 per minute per dispatch in queue
    queuedDispatches.forEach(dispatch => {
      const queueMinutes = Math.floor((Date.now() - new Date(dispatch.created_date).getTime()) / 60000);
      const impact = {
        entity_type: 'dispatch',
        entity_id: dispatch.id,
        impact_type: 'revenue_loss',
        amount_usd: queueMinutes * 2,
        hourly_rate: 2 * 60,
        daily_projection: 2 * 60 * 24,
        severity: dispatch.priority === 'urgent' ? 'critical' : 'medium',
        description: `${dispatch.job_title} queued for ${queueMinutes} minutes`,
        status: 'active'
      };
      impacts.push(impact);
    });

    // Create financial impact records
    await base44.asServiceRole.entities.FinancialImpact.bulkCreate(impacts);

    // Calculate totals
    const totalCost = impacts.reduce((sum, i) => sum + i.amount_usd, 0);
    const totalHourly = impacts.reduce((sum, i) => sum + i.hourly_rate, 0);
    const totalDaily = impacts.reduce((sum, i) => sum + i.daily_projection, 0);

    return Response.json({
      success: true,
      summary: {
        total_current_cost: totalCost,
        hourly_cost_rate: totalHourly,
        daily_projection: totalDaily,
        issue_count: impacts.length,
        critical_count: impacts.filter(i => i.severity === 'critical').length
      },
      impacts
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});