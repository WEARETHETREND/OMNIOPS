import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { failure_ids } = body;

    // Get recent failures
    const failures = failure_ids 
      ? await base44.entities.Alert.filter({ id: { $in: failure_ids } })
      : await base44.entities.Alert.filter({ severity: 'error', status: 'new' }, '-created_date', 20);

    if (failures.length === 0) {
      return Response.json({ analyses: [] });
    }

    // Use AI to analyze failures
    const failureContext = failures.map(f => ({
      title: f.title,
      message: f.message,
      category: f.category,
      source: f.source,
      created_date: f.created_date
    }));

    const prompt = `Analyze these system failures and provide root cause analysis and recovery suggestions:

${JSON.stringify(failureContext, null, 2)}

For each failure, provide:
1. failure_type: timeout|resource_exhaustion|invalid_input|external_api_error|worker_unavailable|unknown
2. root_cause: Specific root cause
3. confidence: 0-100 confidence score
4. suggested_fix: Specific remediation steps
5. is_systemic: true if this is a pattern issue

Format as JSON array.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          analyses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                failure_type: { type: 'string' },
                root_cause: { type: 'string' },
                confidence: { type: 'number' },
                suggested_fix: { type: 'string' },
                is_systemic: { type: 'boolean' }
              }
            }
          }
        }
      }
    });

    // Store analyses
    const analyses = (result.analyses || []).map((analysis, idx) => ({
      failure_id: failures[idx]?.id,
      failure_type: analysis.failure_type,
      root_cause: analysis.root_cause,
      confidence: analysis.confidence,
      suggested_fix: analysis.suggested_fix,
      auto_recovered: false,
      recovery_status: 'pending',
      affected_workflows: [],
      is_systemic: analysis.is_systemic
    }));

    await base44.asServiceRole.entities.FailureAnalysis.bulkCreate(analyses);

    return Response.json({ 
      success: true,
      analyses_count: analyses.length,
      analyses 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});