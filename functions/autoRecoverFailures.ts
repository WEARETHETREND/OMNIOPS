import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get failure analyses
    const analyses = await base44.asServiceRole.entities.FailureAnalysis.filter({
      recovery_status: 'pending',
      is_systemic: false
    });

    if (analyses.length === 0) {
      return Response.json({ recovered: [] });
    }

    const recovered = [];

    for (const analysis of analyses) {
      try {
        // Apply suggested fix based on failure type
        let recovery_applied = false;

        switch (analysis.failure_type) {
          case 'timeout':
            // Increase timeout on related workflows
            await base44.asServiceRole.functions.invoke('increaseTimeouts', {
              failure_id: analysis.failure_id
            });
            recovery_applied = true;
            break;

          case 'resource_exhaustion':
            // Trigger scaling
            await base44.asServiceRole.functions.invoke('scaleResources', {
              component: 'worker_pool',
              scale_factor: 1.5
            });
            recovery_applied = true;
            break;

          case 'worker_unavailable':
            // Reassign to available worker
            await base44.asServiceRole.functions.invoke('reassignDispatch', {
              failure_id: analysis.failure_id
            });
            recovery_applied = true;
            break;

          case 'external_api_error':
            // Retry with exponential backoff
            await base44.asServiceRole.functions.invoke('retryWithBackoff', {
              failure_id: analysis.failure_id,
              max_retries: 3
            });
            recovery_applied = true;
            break;
        }

        // Update analysis
        if (recovery_applied) {
          await base44.asServiceRole.entities.FailureAnalysis.update(analysis.id, {
            auto_recovered: true,
            recovery_status: 'successful'
          });

          recovered.push({
            analysis_id: analysis.id,
            failure_type: analysis.failure_type,
            recovery_type: analysis.failure_type,
            status: 'successful'
          });
        }
      } catch (error) {
        await base44.asServiceRole.entities.FailureAnalysis.update(analysis.id, {
          recovery_status: 'failed'
        });
      }
    }

    return Response.json({
      success: true,
      recovered_count: recovered.length,
      recovered
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});