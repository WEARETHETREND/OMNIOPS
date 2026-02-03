/**
 * Multi-Division API Routes
 * 
 * RESTful API endpoints for the multi-division broker platform
 */

const express = require('express');
const router = express.Router();
const { registry } = require('../divisions/registry');
const LeadGenerator = require('../core/LeadGenerator');
const OpportunityMatcher = require('../core/OpportunityMatcher');
const CommissionTracker = require('../core/CommissionTracker');
const RevenueStreams = require('../core/RevenueStreams');

/**
 * GET /api/divisions
 * List all registered divisions
 */
router.get('/divisions', async (req, res) => {
  try {
    const { enabled } = req.query;
    const enabledOnly = enabled === 'true';
    
    const divisions = registry.getAllDivisions(enabledOnly);
    const stats = registry.getStats();

    res.json({
      success: true,
      data: divisions.map(d => d.toJSON()),
      stats
    });
  } catch (error) {
    console.error('Error fetching divisions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/divisions/:id
 * Get a specific division
 */
router.get('/divisions/:id', async (req, res) => {
  try {
    const division = registry.getDivision(req.params.id);
    
    if (!division) {
      return res.status(404).json({
        success: false,
        error: `Division not found: ${req.params.id}`
      });
    }

    const metrics = await division.getMetrics();

    res.json({
      success: true,
      data: {
        ...division.toJSON(),
        metrics
      }
    });
  } catch (error) {
    console.error('Error fetching division:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/divisions/:id/enable
 * Enable a division
 */
router.post('/divisions/:id/enable', async (req, res) => {
  try {
    registry.enableDivision(req.params.id);
    const division = registry.getDivision(req.params.id);

    if (!division) {
      return res.status(404).json({
        success: false,
        error: `Division not found: ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: division.toJSON()
    });
  } catch (error) {
    console.error('Error enabling division:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/divisions/:id/disable
 * Disable a division
 */
router.post('/divisions/:id/disable', async (req, res) => {
  try {
    registry.disableDivision(req.params.id);
    const division = registry.getDivision(req.params.id);

    if (!division) {
      return res.status(404).json({
        success: false,
        error: `Division not found: ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: division.toJSON()
    });
  } catch (error) {
    console.error('Error disabling division:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/divisions/universal-search
 * Search across all enabled divisions
 */
router.post('/divisions/universal-search', async (req, res) => {
  try {
    const { criteria = {} } = req.body;

    const results = await registry.universalSearch(criteria);

    res.json({
      success: true,
      data: results,
      divisionsSearched: registry.getAllDivisions(true).length
    });
  } catch (error) {
    console.error('Error in universal search:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/divisions/:id/find-leads
 * Find leads for a specific division
 */
router.post('/divisions/:id/find-leads', async (req, res) => {
  try {
    const division = registry.getDivision(req.params.id);
    
    if (!division) {
      return res.status(404).json({
        success: false,
        error: `Division not found: ${req.params.id}`
      });
    }

    const { criteria = {} } = req.body;
    const leads = await division.findLeads(criteria);

    res.json({
      success: true,
      data: {
        divisionId: req.params.id,
        divisionName: division.name,
        leads,
        count: leads.length
      }
    });
  } catch (error) {
    console.error('Error finding leads:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/divisions/:id/find-opportunities
 * Find opportunities for a specific division
 */
router.post('/divisions/:id/find-opportunities', async (req, res) => {
  try {
    const division = registry.getDivision(req.params.id);
    
    if (!division) {
      return res.status(404).json({
        success: false,
        error: `Division not found: ${req.params.id}`
      });
    }

    const { criteria = {} } = req.body;
    const opportunities = await division.findOpportunities(criteria);

    res.json({
      success: true,
      data: {
        divisionId: req.params.id,
        divisionName: division.name,
        opportunities,
        count: opportunities.length
      }
    });
  } catch (error) {
    console.error('Error finding opportunities:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/divisions/:id/match
 * Score a lead-opportunity match
 */
router.post('/divisions/:id/match', async (req, res) => {
  try {
    const division = registry.getDivision(req.params.id);
    
    if (!division) {
      return res.status(404).json({
        success: false,
        error: `Division not found: ${req.params.id}`
      });
    }

    const { lead, opportunity } = req.body;

    if (!lead || !opportunity) {
      return res.status(400).json({
        success: false,
        error: 'Both lead and opportunity are required'
      });
    }

    const match = await division.scoreMatch(lead, opportunity);

    res.json({
      success: true,
      data: {
        divisionId: req.params.id,
        divisionName: division.name,
        match
      }
    });
  } catch (error) {
    console.error('Error scoring match:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/divisions/revenue
 * Get revenue analytics across divisions
 */
router.get('/divisions/revenue', async (req, res) => {
  try {
    const db = req.app.get('db'); // Database connection from app
    const revenueStreams = new RevenueStreams(db);

    const { divisionId, startDate, endDate } = req.query;
    const dateRange = {};
    
    if (startDate) dateRange.start = startDate;
    if (endDate) dateRange.end = endDate;

    const revenue = await revenueStreams.getRevenueByDivision(divisionId, dateRange);
    const dashboard = await revenueStreams.getDashboardSummary();

    res.json({
      success: true,
      data: {
        revenue,
        dashboard
      }
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/divisions/revenue/trends
 * Get revenue trends over time
 */
router.get('/divisions/revenue/trends', async (req, res) => {
  try {
    const db = req.app.get('db');
    const revenueStreams = new RevenueStreams(db);

    const { divisionId, groupBy = 'month', periods = 12 } = req.query;
    const trends = await revenueStreams.getRevenueTrends(
      divisionId,
      groupBy,
      parseInt(periods)
    );

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error fetching revenue trends:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/divisions/revenue/projections
 * Get revenue projections
 */
router.get('/divisions/revenue/projections', async (req, res) => {
  try {
    const db = req.app.get('db');
    const revenueStreams = new RevenueStreams(db);

    const { divisionId, months = 12 } = req.query;
    
    if (!divisionId) {
      return res.status(400).json({
        success: false,
        error: 'divisionId is required'
      });
    }

    const projection = await revenueStreams.projectRevenue(
      divisionId,
      parseInt(months)
    );

    res.json({
      success: true,
      data: projection
    });
  } catch (error) {
    console.error('Error calculating projections:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/divisions/deals
 * Get deals across divisions
 */
router.get('/divisions/deals', async (req, res) => {
  try {
    const db = req.app.get('db');
    const commissionTracker = new CommissionTracker(db);

    const { divisionId, status, minValue, startDate, endDate } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (minValue) filters.minValue = parseFloat(minValue);
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const deals = divisionId
      ? await commissionTracker.getDealsByDivision(divisionId, filters)
      : await commissionTracker.getAllDeals({ ...filters, divisionId });

    const summary = await commissionTracker.getCommissionSummary(divisionId);

    res.json({
      success: true,
      data: {
        deals,
        summary
      }
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/divisions/deals
 * Create a new deal
 */
router.post('/divisions/deals', async (req, res) => {
  try {
    const db = req.app.get('db');
    const commissionTracker = new CommissionTracker(db);

    const dealData = req.body;

    if (!dealData.divisionId || !dealData.value) {
      return res.status(400).json({
        success: false,
        error: 'divisionId and value are required'
      });
    }

    const deal = await commissionTracker.createDeal(dealData);

    res.status(201).json({
      success: true,
      data: deal
    });
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/divisions/deals/:id
 * Update a deal
 */
router.put('/divisions/deals/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const commissionTracker = new CommissionTracker(db);

    const { status, ...updates } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'status is required'
      });
    }

    const deal = await commissionTracker.updateDeal(
      req.params.id,
      status,
      updates
    );

    res.json({
      success: true,
      data: deal
    });
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/divisions/metrics
 * Get metrics from all divisions
 */
router.get('/divisions/metrics', async (req, res) => {
  try {
    const metrics = await registry.getAllMetrics();

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
