/**
 * CommissionTracker - Track commissions and deals across divisions
 * 
 * Monitors deal lifecycle, calculates commissions, and provides
 * revenue analytics.
 */

class CommissionTracker {
  constructor(db) {
    this.db = db;
  }

  /**
   * Create a new deal
   * @param {Object} dealData - Deal information
   * @returns {Promise<Object>} Created deal
   */
  async createDeal(dealData) {
    const {
      divisionId,
      leadId,
      opportunityId,
      matchId,
      value,
      status = 'pending',
      notes = ''
    } = dealData;

    if (!this.db) {
      return {
        id: `mock-${Date.now()}`,
        ...dealData,
        commission: this.calculateCommission(value, divisionId),
        created_at: new Date().toISOString()
      };
    }

    try {
      const commission = await this.calculateCommission(value, divisionId);
      
      const result = await this.db.query(
        `INSERT INTO universal_deals 
         (division_id, lead_id, opportunity_id, match_id, value, commission, status, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         RETURNING *`,
        [divisionId, leadId, opportunityId, matchId, value, commission, status, notes]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  }

  /**
   * Update deal status
   * @param {String} dealId
   * @param {String} status - 'pending', 'active', 'closed', 'lost'
   * @param {Object} updates - Additional updates
   * @returns {Promise<Object>} Updated deal
   */
  async updateDeal(dealId, status, updates = {}) {
    if (!this.db) {
      return { id: dealId, status, ...updates, updated_at: new Date().toISOString() };
    }

    try {
      const setClauses = ['status = $2', 'updated_at = NOW()'];
      const params = [dealId, status];
      let paramCount = 3;

      if (updates.value !== undefined) {
        setClauses.push(`value = $${paramCount}`);
        params.push(updates.value);
        paramCount++;
        
        // Recalculate commission if value changed
        const commission = await this.calculateCommission(updates.value, updates.divisionId);
        setClauses.push(`commission = $${paramCount}`);
        params.push(commission);
        paramCount++;
      }

      if (updates.notes) {
        setClauses.push(`notes = $${paramCount}`);
        params.push(updates.notes);
        paramCount++;
      }

      if (status === 'closed') {
        setClauses.push(`closed_at = NOW()`);
      }

      const query = `
        UPDATE universal_deals 
        SET ${setClauses.join(', ')}
        WHERE id = $1
        RETURNING *
      `;

      const result = await this.db.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  }

  /**
   * Calculate commission for a deal
   * @param {Number} value - Deal value
   * @param {String} divisionId - Division ID
   * @returns {Promise<Number>} Commission amount
   */
  async calculateCommission(value, divisionId) {
    // Default commission rates per division
    const defaultRates = {
      'govcon': 0.10,
      'cre': 0.05,
      'grants': 0.15,
      'franchise': 0.08,
      'equipment': 0.07,
      'supply-chain': 0.06,
      'recruiting': 0.20,
      'insurance': 0.12,
      'loans': 0.03,
      'energy': 0.10
    };

    const rate = defaultRates[divisionId] || 0.10;
    return value * rate;
  }

  /**
   * Get deals for a division
   * @param {String} divisionId
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Deals
   */
  async getDealsByDivision(divisionId, filters = {}) {
    if (!this.db) {
      return this.getMockDeals(divisionId);
    }

    try {
      let query = 'SELECT * FROM universal_deals WHERE division_id = $1';
      const params = [divisionId];
      let paramCount = 2;

      if (filters.status) {
        query += ` AND status = $${paramCount++}`;
        params.push(filters.status);
      }

      if (filters.minValue) {
        query += ` AND value >= $${paramCount++}`;
        params.push(filters.minValue);
      }

      if (filters.startDate) {
        query += ` AND created_at >= $${paramCount++}`;
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        query += ` AND created_at <= $${paramCount++}`;
        params.push(filters.endDate);
      }

      query += ' ORDER BY created_at DESC';

      const result = await this.db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching deals:', error);
      return [];
    }
  }

  /**
   * Get all deals across divisions
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} All deals
   */
  async getAllDeals(filters = {}) {
    if (!this.db) {
      return this.getMockDeals();
    }

    try {
      let query = `
        SELECT d.*, div.name as division_name 
        FROM universal_deals d
        LEFT JOIN business_divisions div ON d.division_id = div.id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (filters.status) {
        query += ` AND d.status = $${paramCount++}`;
        params.push(filters.status);
      }

      if (filters.divisionId) {
        query += ` AND d.division_id = $${paramCount++}`;
        params.push(filters.divisionId);
      }

      query += ' ORDER BY d.created_at DESC LIMIT 100';

      const result = await this.db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching all deals:', error);
      return [];
    }
  }

  /**
   * Get commission summary
   * @param {String} divisionId - Optional division filter
   * @param {Object} dateRange - Optional date range
   * @returns {Promise<Object>} Commission summary
   */
  async getCommissionSummary(divisionId = null, dateRange = {}) {
    if (!this.db) {
      return this.getMockCommissionSummary(divisionId);
    }

    try {
      let query = `
        SELECT 
          division_id,
          COUNT(*) as deal_count,
          SUM(value) as total_value,
          SUM(commission) as total_commission,
          AVG(value) as avg_deal_value,
          status
        FROM universal_deals
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (divisionId) {
        query += ` AND division_id = $${paramCount++}`;
        params.push(divisionId);
      }

      if (dateRange.start) {
        query += ` AND created_at >= $${paramCount++}`;
        params.push(dateRange.start);
      }

      if (dateRange.end) {
        query += ` AND created_at <= $${paramCount++}`;
        params.push(dateRange.end);
      }

      query += ` GROUP BY division_id, status`;

      const result = await this.db.query(query, params);
      
      // Aggregate results
      const summary = {
        totalDeals: 0,
        totalValue: 0,
        totalCommission: 0,
        byDivision: {},
        byStatus: {}
      };

      result.rows.forEach(row => {
        summary.totalDeals += parseInt(row.deal_count);
        summary.totalValue += parseFloat(row.total_value || 0);
        summary.totalCommission += parseFloat(row.total_commission || 0);

        if (!summary.byDivision[row.division_id]) {
          summary.byDivision[row.division_id] = {
            dealCount: 0,
            totalValue: 0,
            totalCommission: 0
          };
        }

        summary.byDivision[row.division_id].dealCount += parseInt(row.deal_count);
        summary.byDivision[row.division_id].totalValue += parseFloat(row.total_value || 0);
        summary.byDivision[row.division_id].totalCommission += parseFloat(row.total_commission || 0);

        if (!summary.byStatus[row.status]) {
          summary.byStatus[row.status] = 0;
        }
        summary.byStatus[row.status] += parseInt(row.deal_count);
      });

      return summary;
    } catch (error) {
      console.error('Error getting commission summary:', error);
      return this.getMockCommissionSummary(divisionId);
    }
  }

  /**
   * Get mock deals for testing
   * @param {String} divisionId - Optional division filter
   * @returns {Array} Mock deals
   */
  getMockDeals(divisionId = null) {
    const statuses = ['pending', 'active', 'closed', 'lost'];
    const divisions = ['govcon', 'cre', 'grants', 'franchise', 'equipment'];
    
    const deals = [];
    for (let i = 1; i <= 20; i++) {
      const div = divisionId || divisions[Math.floor(Math.random() * divisions.length)];
      const value = Math.floor(Math.random() * 500000) + 10000;
      
      deals.push({
        id: i,
        division_id: div,
        lead_id: Math.floor(Math.random() * 100) + 1,
        opportunity_id: Math.floor(Math.random() * 100) + 1,
        value,
        commission: value * 0.10,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return divisionId ? deals.filter(d => d.division_id === divisionId) : deals;
  }

  /**
   * Get mock commission summary
   * @param {String} divisionId - Optional division filter
   * @returns {Object} Mock summary
   */
  getMockCommissionSummary(divisionId) {
    const deals = this.getMockDeals(divisionId);
    
    const summary = {
      totalDeals: deals.length,
      totalValue: deals.reduce((sum, d) => sum + d.value, 0),
      totalCommission: deals.reduce((sum, d) => sum + d.commission, 0),
      byDivision: {},
      byStatus: {}
    };

    deals.forEach(deal => {
      if (!summary.byDivision[deal.division_id]) {
        summary.byDivision[deal.division_id] = {
          dealCount: 0,
          totalValue: 0,
          totalCommission: 0
        };
      }
      
      summary.byDivision[deal.division_id].dealCount++;
      summary.byDivision[deal.division_id].totalValue += deal.value;
      summary.byDivision[deal.division_id].totalCommission += deal.commission;

      summary.byStatus[deal.status] = (summary.byStatus[deal.status] || 0) + 1;
    });

    return summary;
  }
}

module.exports = CommissionTracker;
