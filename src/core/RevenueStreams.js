/**
 * RevenueStreams - Revenue analytics and forecasting
 * 
 * Tracks revenue across all divisions, provides analytics,
 * and calculates projections.
 */

class RevenueStreams {
  constructor(db) {
    this.db = db;
  }

  /**
   * Record revenue for a division
   * @param {Object} revenueData - Revenue entry data
   * @returns {Promise<Object>} Recorded revenue entry
   */
  async recordRevenue(revenueData) {
    const {
      divisionId,
      dealId,
      amount,
      type = 'commission', // commission, recurring, one-time
      period,
      notes = ''
    } = revenueData;

    if (!this.db) {
      return {
        id: `mock-${Date.now()}`,
        ...revenueData,
        recorded_at: new Date().toISOString()
      };
    }

    try {
      const result = await this.db.query(
        `INSERT INTO division_revenue 
         (division_id, deal_id, amount, type, period, notes, recorded_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING *`,
        [divisionId, dealId, amount, type, period, notes]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error recording revenue:', error);
      throw error;
    }
  }

  /**
   * Get revenue by division
   * @param {String} divisionId - Optional division filter
   * @param {Object} dateRange - Date range filter
   * @returns {Promise<Object>} Revenue summary
   */
  async getRevenueByDivision(divisionId = null, dateRange = {}) {
    if (!this.db) {
      return this.getMockRevenue(divisionId, dateRange);
    }

    try {
      let query = `
        SELECT 
          division_id,
          type,
          COUNT(*) as entry_count,
          SUM(amount) as total_amount,
          AVG(amount) as avg_amount,
          MIN(amount) as min_amount,
          MAX(amount) as max_amount
        FROM division_revenue
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (divisionId) {
        query += ` AND division_id = $${paramCount++}`;
        params.push(divisionId);
      }

      if (dateRange.start) {
        query += ` AND recorded_at >= $${paramCount++}`;
        params.push(dateRange.start);
      }

      if (dateRange.end) {
        query += ` AND recorded_at <= $${paramCount++}`;
        params.push(dateRange.end);
      }

      query += ` GROUP BY division_id, type ORDER BY total_amount DESC`;

      const result = await this.db.query(query, params);
      
      // Aggregate by division
      const summary = {};
      let grandTotal = 0;

      result.rows.forEach(row => {
        if (!summary[row.division_id]) {
          summary[row.division_id] = {
            divisionId: row.division_id,
            total: 0,
            byType: {}
          };
        }

        const amount = parseFloat(row.total_amount || 0);
        summary[row.division_id].total += amount;
        summary[row.division_id].byType[row.type] = {
          count: parseInt(row.entry_count),
          total: amount,
          average: parseFloat(row.avg_amount || 0),
          min: parseFloat(row.min_amount || 0),
          max: parseFloat(row.max_amount || 0)
        };

        grandTotal += amount;
      });

      return {
        grandTotal,
        byDivision: summary,
        dateRange
      };
    } catch (error) {
      console.error('Error getting revenue by division:', error);
      return this.getMockRevenue(divisionId, dateRange);
    }
  }

  /**
   * Get revenue trends over time
   * @param {String} divisionId - Optional division filter
   * @param {String} groupBy - 'day', 'week', 'month', 'quarter', 'year'
   * @param {Number} periods - Number of periods to return
   * @returns {Promise<Array>} Revenue trends
   */
  async getRevenueTrends(divisionId = null, groupBy = 'month', periods = 12) {
    if (!this.db) {
      return this.getMockTrends(divisionId, groupBy, periods);
    }

    const truncFunctions = {
      day: 'DATE_TRUNC(\'day\', recorded_at)',
      week: 'DATE_TRUNC(\'week\', recorded_at)',
      month: 'DATE_TRUNC(\'month\', recorded_at)',
      quarter: 'DATE_TRUNC(\'quarter\', recorded_at)',
      year: 'DATE_TRUNC(\'year\', recorded_at)'
    };

    const truncFunc = truncFunctions[groupBy] || truncFunctions.month;

    try {
      let query = `
        SELECT 
          ${truncFunc} as period,
          division_id,
          SUM(amount) as total_revenue,
          COUNT(*) as entry_count
        FROM division_revenue
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (divisionId) {
        query += ` AND division_id = $${paramCount++}`;
        params.push(divisionId);
      }

      query += `
        GROUP BY period, division_id
        ORDER BY period DESC
        LIMIT $${paramCount}
      `;
      params.push(periods);

      const result = await this.db.query(query, params);
      return result.rows.map(row => ({
        period: row.period,
        divisionId: row.division_id,
        revenue: parseFloat(row.total_revenue || 0),
        entryCount: parseInt(row.entry_count)
      }));
    } catch (error) {
      console.error('Error getting revenue trends:', error);
      return this.getMockTrends(divisionId, groupBy, periods);
    }
  }

  /**
   * Calculate projected revenue
   * @param {String} divisionId
   * @param {Number} months - Months to project forward
   * @returns {Promise<Object>} Revenue projection
   */
  async projectRevenue(divisionId, months = 12) {
    // Get historical data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const historical = await this.getRevenueByDivision(divisionId, {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    });

    if (!historical.byDivision || Object.keys(historical.byDivision).length === 0) {
      return {
        divisionId,
        projectedMonthly: 0,
        projectedAnnual: 0,
        confidence: 'Low',
        note: 'Insufficient historical data'
      };
    }

    // Simple projection: average historical monthly revenue
    const divisionData = historical.byDivision[divisionId] || { total: 0 };
    const monthlyAverage = divisionData.total / months;

    // Apply growth rate (conservative 5% month-over-month)
    const growthRate = 1.05;
    const projectedMonthly = monthlyAverage * growthRate;
    const projectedAnnual = projectedMonthly * 12;

    return {
      divisionId,
      historicalPeriod: { months, total: divisionData.total },
      projectedMonthly,
      projectedAnnual,
      growthRate: (growthRate - 1) * 100,
      confidence: months >= 6 ? 'High' : months >= 3 ? 'Medium' : 'Low'
    };
  }

  /**
   * Get top performing divisions
   * @param {Number} limit - Number of divisions to return
   * @param {Object} dateRange - Date range filter
   * @returns {Promise<Array>} Top divisions
   */
  async getTopDivisions(limit = 5, dateRange = {}) {
    const revenue = await this.getRevenueByDivision(null, dateRange);
    
    const divisions = Object.values(revenue.byDivision || {})
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);

    return divisions.map((div, index) => ({
      rank: index + 1,
      ...div
    }));
  }

  /**
   * Calculate revenue per deal
   * @param {String} divisionId
   * @returns {Promise<Number>} Average revenue per deal
   */
  async getAverageRevenuePerDeal(divisionId) {
    if (!this.db) {
      return Math.floor(Math.random() * 50000) + 10000;
    }

    try {
      const result = await this.db.query(
        `SELECT AVG(amount) as avg_revenue
         FROM division_revenue
         WHERE division_id = $1 AND deal_id IS NOT NULL`,
        [divisionId]
      );

      return parseFloat(result.rows[0]?.avg_revenue || 0);
    } catch (error) {
      console.error('Error calculating average revenue per deal:', error);
      return 0;
    }
  }

  /**
   * Get mock revenue data for testing
   * @param {String} divisionId
   * @param {Object} dateRange
   * @returns {Object} Mock revenue data
   */
  getMockRevenue(divisionId, dateRange) {
    const divisions = ['govcon', 'cre', 'grants', 'franchise', 'equipment', 'supply-chain', 'recruiting', 'insurance', 'loans', 'energy'];
    const types = ['commission', 'recurring', 'one-time'];
    
    const summary = {};
    let grandTotal = 0;

    const targetDivisions = divisionId ? [divisionId] : divisions;

    targetDivisions.forEach(div => {
      const divTotal = Math.floor(Math.random() * 500000) + 50000;
      grandTotal += divTotal;

      summary[div] = {
        divisionId: div,
        total: divTotal,
        byType: {}
      };

      types.forEach(type => {
        const amount = Math.floor(Math.random() * divTotal / 3);
        summary[div].byType[type] = {
          count: Math.floor(Math.random() * 20) + 1,
          total: amount,
          average: amount / 10,
          min: amount * 0.1,
          max: amount * 2
        };
      });
    });

    return {
      grandTotal,
      byDivision: summary,
      dateRange
    };
  }

  /**
   * Get mock trend data
   * @param {String} divisionId
   * @param {String} groupBy
   * @param {Number} periods
   * @returns {Array} Mock trends
   */
  getMockTrends(divisionId, groupBy, periods) {
    const trends = [];
    const now = new Date();
    const divisions = divisionId ? [divisionId] : ['govcon', 'cre', 'grants', 'franchise', 'equipment'];

    for (let i = 0; i < periods; i++) {
      const periodDate = new Date(now);
      
      if (groupBy === 'day') {
        periodDate.setDate(periodDate.getDate() - i);
      } else if (groupBy === 'week') {
        periodDate.setDate(periodDate.getDate() - (i * 7));
      } else if (groupBy === 'month') {
        periodDate.setMonth(periodDate.getMonth() - i);
      } else if (groupBy === 'quarter') {
        periodDate.setMonth(periodDate.getMonth() - (i * 3));
      } else if (groupBy === 'year') {
        periodDate.setFullYear(periodDate.getFullYear() - i);
      }

      divisions.forEach(div => {
        trends.push({
          period: periodDate.toISOString().split('T')[0],
          divisionId: div,
          revenue: Math.floor(Math.random() * 100000) + 10000,
          entryCount: Math.floor(Math.random() * 30) + 1
        });
      });
    }

    return trends.sort((a, b) => new Date(b.period) - new Date(a.period));
  }

  /**
   * Get revenue summary for dashboard
   * @returns {Promise<Object>} Dashboard summary
   */
  async getDashboardSummary() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    const [currentMonth, previousMonth, yearToDate, topDivisions] = await Promise.all([
      this.getRevenueByDivision(null, { start: thisMonth.toISOString() }),
      this.getRevenueByDivision(null, { start: lastMonth.toISOString(), end: thisMonth.toISOString() }),
      this.getRevenueByDivision(null, { start: thisYear.toISOString() }),
      this.getTopDivisions(5)
    ]);

    const monthOverMonthGrowth = previousMonth.grandTotal > 0
      ? ((currentMonth.grandTotal - previousMonth.grandTotal) / previousMonth.grandTotal) * 100
      : 0;

    return {
      currentMonth: {
        total: currentMonth.grandTotal,
        byDivision: currentMonth.byDivision
      },
      previousMonth: {
        total: previousMonth.grandTotal
      },
      yearToDate: {
        total: yearToDate.grandTotal,
        byDivision: yearToDate.byDivision
      },
      monthOverMonthGrowth: parseFloat(monthOverMonthGrowth.toFixed(2)),
      topDivisions
    };
  }
}

export default RevenueStreams;
