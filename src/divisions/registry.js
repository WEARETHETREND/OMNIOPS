/**
 * Division Registry - Factory and manager for all business divisions
 * 
 * Implements the factory pattern to register, instantiate, and manage
 * all division instances.
 */

const BaseDivision = require('../core/BaseDivision');

class DivisionRegistry {
  constructor() {
    this.divisions = new Map();
    this.divisionClasses = new Map();
  }

  /**
   * Register a division class
   * @param {String} id - Division identifier
   * @param {Class} divisionClass - Division class (extends BaseDivision)
   */
  registerDivision(id, divisionClass) {
    if (!divisionClass.prototype instanceof BaseDivision && divisionClass !== BaseDivision) {
      throw new Error(`Division class must extend BaseDivision: ${id}`);
    }
    
    this.divisionClasses.set(id, divisionClass);
  }

  /**
   * Create and register a division instance
   * @param {String} id - Division identifier
   * @param {Object} config - Division configuration
   * @returns {BaseDivision} Division instance
   */
  createDivision(id, config) {
    const DivisionClass = this.divisionClasses.get(id);
    
    if (!DivisionClass) {
      throw new Error(`Unknown division type: ${id}`);
    }

    const division = new DivisionClass({ id, ...config });
    this.divisions.set(id, division);
    
    return division;
  }

  /**
   * Get a division instance
   * @param {String} id - Division identifier
   * @returns {BaseDivision|null} Division instance
   */
  getDivision(id) {
    return this.divisions.get(id) || null;
  }

  /**
   * Get all registered divisions
   * @param {Boolean} enabledOnly - Return only enabled divisions
   * @returns {Array<BaseDivision>} Array of division instances
   */
  getAllDivisions(enabledOnly = false) {
    const divisions = Array.from(this.divisions.values());
    
    if (enabledOnly) {
      return divisions.filter(div => div.enabled);
    }
    
    return divisions;
  }

  /**
   * Get division IDs
   * @returns {Array<String>} Array of division IDs
   */
  getDivisionIds() {
    return Array.from(this.divisions.keys());
  }

  /**
   * Check if division exists
   * @param {String} id - Division identifier
   * @returns {Boolean} Whether division exists
   */
  hasDivision(id) {
    return this.divisions.has(id);
  }

  /**
   * Enable a division
   * @param {String} id - Division identifier
   */
  enableDivision(id) {
    const division = this.getDivision(id);
    if (division) {
      division.enable();
    }
  }

  /**
   * Disable a division
   * @param {String} id - Division identifier
   */
  disableDivision(id) {
    const division = this.getDivision(id);
    if (division) {
      division.disable();
    }
  }

  /**
   * Remove a division
   * @param {String} id - Division identifier
   * @returns {Boolean} Whether division was removed
   */
  removeDivision(id) {
    return this.divisions.delete(id);
  }

  /**
   * Get division count
   * @returns {Number} Number of registered divisions
   */
  count() {
    return this.divisions.size;
  }

  /**
   * Clear all divisions
   */
  clear() {
    this.divisions.clear();
  }

  /**
   * Get registry statistics
   * @returns {Object} Registry statistics
   */
  getStats() {
    const divisions = this.getAllDivisions();
    
    return {
      total: divisions.length,
      enabled: divisions.filter(d => d.enabled).length,
      disabled: divisions.filter(d => !d.enabled).length,
      registeredClasses: this.divisionClasses.size,
      divisions: divisions.map(d => ({
        id: d.id,
        name: d.name,
        enabled: d.enabled
      }))
    };
  }

  /**
   * Execute operation across all divisions
   * @param {Function} operation - Async operation to execute
   * @param {Boolean} enabledOnly - Execute only on enabled divisions
   * @returns {Promise<Array>} Results from all divisions
   */
  async executeAll(operation, enabledOnly = true) {
    const divisions = this.getAllDivisions(enabledOnly);
    
    const results = await Promise.allSettled(
      divisions.map(async division => ({
        divisionId: division.id,
        result: await operation(division)
      }))
    );

    return results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          divisionId: 'unknown',
          error: result.reason.message
        };
      }
    });
  }

  /**
   * Universal search across all divisions
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Object>} Aggregated results from all divisions
   */
  async universalSearch(criteria) {
    const leads = await this.executeAll(
      division => division.findLeads(criteria)
    );

    const opportunities = await this.executeAll(
      division => division.findOpportunities(criteria)
    );

    return {
      leads: leads.filter(r => !r.error),
      opportunities: opportunities.filter(r => !r.error),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get metrics from all divisions
   * @returns {Promise<Array>} Metrics from all divisions
   */
  async getAllMetrics() {
    return this.executeAll(division => division.getMetrics());
  }
}

// Create singleton instance
const registry = new DivisionRegistry();

// Auto-register all divisions
function initializeDivisions() {
  const divisions = [
    { id: 'govcon', name: 'Government Contracts', description: 'Federal, state, and local government contract opportunities' },
    { id: 'cre', name: 'Commercial Real Estate', description: 'Office, retail, industrial, and multi-family properties' },
    { id: 'grants', name: 'Grant Writing', description: 'Federal, state, and private grant opportunities' },
    { id: 'franchise', name: 'Franchise Brokerage', description: 'Franchise opportunities across industries' },
    { id: 'equipment', name: 'Equipment Leasing', description: 'Construction, manufacturing, and office equipment' },
    { id: 'supply-chain', name: 'Supply Chain Brokerage', description: 'Logistics, freight, and supply chain optimization' },
    { id: 'recruiting', name: 'Executive Search', description: 'C-level and executive recruitment' },
    { id: 'insurance', name: 'Commercial Insurance', description: 'Business insurance policies and risk management' },
    { id: 'loans', name: 'Business Loans', description: 'Commercial lending and financing solutions' },
    { id: 'energy', name: 'Solar/Energy', description: 'Solar panels, energy efficiency, and renewable energy' }
  ];

  divisions.forEach(config => {
    try {
      const DivisionClass = require(`./${config.id}/index.js`);
      registry.registerDivision(config.id, DivisionClass);
      registry.createDivision(config.id, config);
    } catch (error) {
      console.warn(`Failed to load division ${config.id}:`, error.message);
    }
  });

  console.log(`Initialized ${registry.count()} divisions`);
}

module.exports = {
  registry,
  DivisionRegistry,
  initializeDivisions
};
