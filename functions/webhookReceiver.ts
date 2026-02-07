import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get webhook data
    const webhookData = await req.json();
    const source = req.headers.get('x-webhook-source') || 'unknown';
    const webhookSecret = req.headers.get('x-webhook-secret');
    
    // Validate webhook authenticity
    const expectedSecret = Deno.env.get('WEBHOOK_SECRET');
    if (!expectedSecret) {
      console.error('WEBHOOK_SECRET not configured');
      return Response.json({ error: 'Webhook authentication not configured' }, { status: 500 });
    }
    
    if (webhookSecret !== expectedSecret) {
      console.warn(`Unauthorized webhook attempt from ${source}`);
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log(`Received webhook from ${source}:`, webhookData);

    // Process webhook based on source
    switch (source) {
      case 'salesforce':
        await handleSalesforceWebhook(base44, webhookData);
        break;
      case 'quickbooks':
        await handleQuickBooksWebhook(base44, webhookData);
        break;
      case 'stripe':
        await handleStripeWebhook(base44, webhookData);
        break;
      default:
        console.log('Unknown webhook source:', source);
    }

    // Optionally trigger workflows based on webhook event
    await triggerWorkflows(base44, source, webhookData);

    return Response.json({ success: true, received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});

async function handleSalesforceWebhook(base44, data) {
  // Handle Salesforce events (e.g., new lead, deal closed)
  if (data.event === 'lead.created') {
    await base44.asServiceRole.entities.Customer.create({
      company_name: data.company_name,
      industry: data.industry || 'unknown',
      primary_contact: data.contact_name,
      referral_source: 'Salesforce Webhook'
    });
  }
}

async function handleQuickBooksWebhook(base44, data) {
  // Handle QuickBooks events (e.g., invoice paid, expense created)
  if (data.event === 'invoice.paid') {
    // Update financial records
    console.log('Invoice paid:', data.invoice_id);
  }
}

async function handleStripeWebhook(base44, data) {
  // Handle Stripe payment events
  if (data.type === 'payment_intent.succeeded') {
    console.log('Payment succeeded:', data.amount);
  }
}

async function triggerWorkflows(base44, source, data) {
  // Get workflows configured to trigger on webhook events
  const workflows = await base44.asServiceRole.entities.Workflow.filter({
    trigger_type: 'event_based',
    status: 'active'
  });

  for (const workflow of workflows) {
    // Check if workflow should be triggered by this event
    if (shouldTrigger(workflow, source, data)) {
      console.log(`Triggering workflow: ${workflow.name}`);
      // Execute workflow steps
      // In production, this would queue the workflow for execution
    }
  }
}

function shouldTrigger(workflow, source, data) {
  // Simple matching logic
  // In production, would have more sophisticated event matching
  return workflow.description?.includes(source);
}