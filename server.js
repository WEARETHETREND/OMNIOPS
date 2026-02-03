/**
 * Multi-Division Broker Platform Server
 * 
 * Express server for the Base44/OPSVANTA multi-division platform
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const { initializeDivisions } = require('./src/divisions/registry');
const multiDivisionRoutes = require('./src/routes/multi-division');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection
let db = null;
if (process.env.DATABASE_URL) {
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  db.on('connect', () => {
    console.log('✓ Database connected');
  });

  db.on('error', (err) => {
    console.error('Database error:', err);
  });

  // Store db connection in app for route access
  app.set('db', db);
} else {
  console.warn('⚠ No DATABASE_URL found - running with mock data only');
}

// Initialize divisions
console.log('Initializing business divisions...');
try {
  initializeDivisions();
  console.log('✓ Divisions initialized successfully');
} catch (error) {
  console.error('✗ Error initializing divisions:', error);
  process.exit(1);
}

// API Routes
app.use('/api', multiDivisionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'mock-mode',
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'multi-division-dashboard.html'));
});

// Dashboard endpoint
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'multi-division-dashboard.html'));
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Multi-Division Broker Platform API',
    version: '1.0.0',
    description: 'RESTful API for the Base44/OPSVANTA multi-division broker platform',
    endpoints: {
      divisions: {
        'GET /api/divisions': 'List all divisions',
        'GET /api/divisions/:id': 'Get division details',
        'POST /api/divisions/:id/enable': 'Enable a division',
        'POST /api/divisions/:id/disable': 'Disable a division',
        'POST /api/divisions/universal-search': 'Search across all divisions',
        'POST /api/divisions/:id/find-leads': 'Find leads for division',
        'POST /api/divisions/:id/find-opportunities': 'Find opportunities for division',
        'POST /api/divisions/:id/match': 'Score a lead-opportunity match',
        'GET /api/divisions/metrics': 'Get metrics from all divisions'
      },
      revenue: {
        'GET /api/divisions/revenue': 'Get revenue analytics',
        'GET /api/divisions/revenue/trends': 'Get revenue trends',
        'GET /api/divisions/revenue/projections': 'Get revenue projections'
      },
      deals: {
        'GET /api/divisions/deals': 'List deals',
        'POST /api/divisions/deals': 'Create a deal',
        'PUT /api/divisions/deals/:id': 'Update a deal'
      }
    },
    divisions: [
      'govcon - Government Contracts (8%)',
      'cre - Commercial Real Estate (5%)',
      'grants - Grant Writing (12%)',
      'franchise - Franchise Brokerage (15%)',
      'equipment - Equipment Leasing (6%)',
      'supply-chain - Supply Chain Brokerage (10%)',
      'recruiting - Executive Search (20%)',
      'insurance - Commercial Insurance (15%)',
      'loans - Business Loans (3%)',
      'energy - Solar/Energy (8%)'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  
  if (db) {
    await db.end();
    console.log('✓ Database connection closed');
  }
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  
  if (db) {
    await db.end();
    console.log('✓ Database connection closed');
  }
  
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   Multi-Division Broker Platform - Base44/OPSVANTA  ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`📡 API Docs: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
