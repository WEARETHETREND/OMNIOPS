import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { integration_id } = await req.json();

    // Get integration details
    const integrations = await base44.entities.Integration.filter({ id: integration_id });
    const integration = integrations[0];

    if (!integration) {
      return Response.json({ error: 'Integration not found' }, { status: 404 });
    }

    console.log(`Syncing integration: ${integration.name}`);

    // Simulate sync based on integration type
    let syncResult = { records_synced: 0 };

    switch (integration.provider) {
      case 'quickbooks':
        syncResult = await syncQuickBooks(base44, integration);
        break;
      case 'salesforce':
        syncResult = await syncSalesforce(base44, integration);
        break;
      case 'google-calendar':
        syncResult = await syncGoogleCalendar(base44, integration);
        break;
      case 'slack':
        syncResult = await syncSlack(base44, integration);
        break;
      default:
        syncResult = { records_synced: Math.floor(Math.random() * 100) };
    }

    // Update integration with sync results
    await base44.entities.Integration.update(integration_id, {
      last_sync: new Date().toISOString(),
      data_synced: (integration.data_synced || 0) + syncResult.records_synced,
      status: 'connected'
    });

    return Response.json({ 
      success: true,
      records_synced: syncResult.records_synced 
    });
  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});

async function syncQuickBooks(base44, integration) {
  // Simulate syncing invoices and expenses
  const mockInvoices = Math.floor(Math.random() * 20);
  
  // In real implementation, would call QuickBooks API
  // const response = await fetch('https://api.quickbooks.com/v3/...');
  
  return { records_synced: mockInvoices };
}

async function syncSalesforce(base44, integration) {
  // Simulate syncing contacts and deals
  const mockContacts = Math.floor(Math.random() * 50);
  
  // In real implementation, would call Salesforce API
  // const response = await fetch('https://api.salesforce.com/...');
  
  // Create/update customers from Salesforce contacts
  for (let i = 0; i < Math.min(mockContacts, 5); i++) {
    await base44.asServiceRole.entities.Customer.create({
      company_name: `Synced Company ${Date.now()}-${i}`,
      industry: 'technology',
      referral_source: 'Salesforce Sync'
    });
  }
  
  return { records_synced: mockContacts };
}

async function syncGoogleCalendar(base44, integration) {
  // Simulate syncing calendar events
  const mockEvents = Math.floor(Math.random() * 30);
  
  // In real implementation, would use Google Calendar API
  // const response = await fetch('https://www.googleapis.com/calendar/v3/...');
  
  return { records_synced: mockEvents };
}

async function syncSlack(base44, integration) {
  // Slack is typically one-way (OpsVanta -> Slack)
  // No sync needed, just confirm connection
  return { records_synced: 0 };
}