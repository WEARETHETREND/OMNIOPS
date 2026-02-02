// Mock data for development when backend is not available

export const mockFinancial = {
  current_burn_rate: 125.50,
  projected_daily_burn: 3012,
  today: { net: 450 },
  active_issues: 2
};

export const mockWorkflows = [
  { 
    workflow_id: 'wf-1', 
    name: 'Customer Onboarding',
    description: 'Automated customer setup and welcome',
    enabled: true,
    workflow_type: 'automation'
  },
  { 
    workflow_id: 'wf-2', 
    name: 'Invoice Processing',
    description: 'Process and validate invoices',
    enabled: true,
    workflow_type: 'finance'
  },
  { 
    workflow_id: 'wf-3', 
    name: 'Data Backup',
    description: 'Daily data backup and validation',
    enabled: false,
    workflow_type: 'system'
  }
];

export const mockAlerts = [
  {
    alert_id: 'a-1',
    message: 'High CPU usage detected on worker-3',
    level: 'warning',
    run_id: 'run-123',
    created_at: new Date().toISOString()
  },
  {
    alert_id: 'a-2',
    message: 'Backup failed for database prod-main',
    level: 'critical',
    run_id: 'run-456',
    created_at: new Date().toISOString()
  }
];

export const mockInsights = {
  total_runs: 1234,
  success_rate: 98.5,
  trending: [
    { date: 'Mon', count: 45 },
    { date: 'Tue', count: 52 },
    { date: 'Wed', count: 48 },
    { date: 'Thu', count: 61 },
    { date: 'Fri', count: 55 },
    { date: 'Sat', count: 38 },
    { date: 'Sun', count: 42 }
  ]
};