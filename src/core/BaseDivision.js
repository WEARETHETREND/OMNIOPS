/**
 * BaseDivision - Abstract base class for all business divisions
 * 
 * Provides the foundation for the multi-division broker platform,
 * defining the contract that all divisions must implement.
 * 
 * Each division follows the same lifecycle:
 * 1. Lead Generation - Find potential clients
 * 2. Opportunity Discovery - Find service providers/opportunities
 * 3. Matching - Score lead-opportunity pairs
 * 4. Deal Tracking - Monitor commissions and revenue
 */

class BaseDivision {
  constructor(config) {
    if (this.constructor === BaseDivision) {
      throw new Error('BaseDivision is abstract and cannot be instantiated directly');
    }
    
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.enabled = config.enabled !== false; // Default to enabled
    this.commissionRate = config.commissionRate || 0.10; // Default 10%
    this.config = config;
  }

  /**
   * Generate leads for this division
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array>} Array of lead objects
   */
  async findLeads(criteria) {
    throw new Error(`${this.name} must implement findLeads()`);
  }

  /**
   * Find opportunities (service providers, contracts, etc.)
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array>} Array of opportunity objects
   */
  async findOpportunities(criteria) {
    throw new Error(`${this.name} must implement findOpportunities()`);
  }

  /**
   * Score a lead-opportunity match
   * @param {Object} lead - The potential client
   * @param {Object} opportunity - The service/provider
   * @returns {Promise<Object>} Match score and reasoning
   */
  async scoreMatch(lead, opportunity) {
    throw new Error(`${this.name} must implement scoreMatch()`);
  }

  /**
   * Calculate expected commission for a deal
   * @param {Object} deal - The deal details
   * @returns {Number} Expected commission amount
   */
  calculateCommission(deal) {
    const dealValue = deal.value || deal.contractValue || deal.amount || 0;
    return dealValue * this.commissionRate;
  }

  /**
   * Get division-specific data sources
   * @returns {Array<String>} List of data source names
   */
  getDataSources() {
    return this.config.dataSources || [];
  }

  /**
   * Get division metrics
   * @returns {Object} Current division metrics
   */
  async getMetrics() {
    return {
      divisionId: this.id,
      name: this.name,
      enabled: this.enabled,
      commissionRate: this.commissionRate
    };
  }

  /**
   * Validate lead data
   * @param {Object} lead - Lead to validate
   * @returns {Boolean} Whether lead is valid
   */
  validateLead(lead) {
    return !!(lead && lead.name && lead.contact);
  }

  /**
   * Validate opportunity data
   * @param {Object} opportunity - Opportunity to validate
   * @returns {Boolean} Whether opportunity is valid
   */
  validateOpportunity(opportunity) {
    return !!(opportunity && opportunity.title && opportunity.value);
  }

  /**
   * Enable this division
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Disable this division
   */
  disable() {
    this.enabled = false;
  }

  /**
   * Get division info for API responses
   * @returns {Object} Division information
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      enabled: this.enabled,
      commissionRate: this.commissionRate,
      dataSources: this.getDataSources()
    };
  }
}

module.exports = BaseDivision;
