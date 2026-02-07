import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin authentication
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    
    // Service role for audit logging
    const body = await req.json().catch(() => ({}));
    const {
      action,
      data_subject,
      data_category,
      processor_email,
      purpose,
      changes_made
    } = body;

    // Get IP from headers
    const ip_address = req.headers.get('x-forwarded-for') || 
                       req.headers.get('cf-connecting-ip') || 
                       'unknown';

    if (!action || !data_subject || !data_category || !processor_email || !purpose) {
      return Response.json({ 
        error: 'Missing required fields: action, data_subject, data_category, processor_email, purpose' 
      }, { status: 400 });
    }

    // Create immutable audit log
    const auditEntry = {
      action,
      data_subject,
      data_category,
      processor_email,
      purpose,
      ip_address,
      changes_made: changes_made || {},
      retention_days: 2555, // 7 years GDPR minimum
      deletion_scheduled: new Date(Date.now() + 2555 * 24 * 60 * 60 * 1000).toISOString(),
      tamper_detected: false,
      is_immutable: true
    };

    const result = await base44.asServiceRole.entities.GDPRAuditLog.create(auditEntry);

    return Response.json({
      success: true,
      audit_id: result.id,
      message: 'GDPR audit log created (immutable)'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});