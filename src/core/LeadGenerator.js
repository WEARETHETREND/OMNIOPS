/**
 * LeadGenerator - Universal lead generation across all data sources
 * 
 * Coordinates lead discovery from multiple APIs and databases,
 * normalizes the data, and stores in the universal_leads table.
 */

class LeadGenerator {
  constructor(db) {
    this.db = db;
    this.sources = new Map();
  }

  /**
   * Register a data source
   * @param {String} name - Source name
   * @param {Function} fetcher - Async function to fetch leads
   */
  registerSource(name, fetcher) {
    this.sources.set(name, fetcher);
  }

  /**
   * Generate leads from a specific source
   * @param {String} sourceName - Name of the data source
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array>} Normalized leads
   */
  async generateFromSource(sourceName, criteria) {
    const fetcher = this.sources.get(sourceName);
    if (!fetcher) {
      throw new Error(`Unknown data source: ${sourceName}`);
    }

    try {
      const rawLeads = await fetcher(criteria);
      return this.normalizeLeads(rawLeads, sourceName);
    } catch (error) {
      console.error(`Error generating leads from ${sourceName}:`, error);
      return [];
    }
  }

  /**
   * Generate leads from all sources
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array>} All leads from all sources
   */
  async generateFromAll(criteria) {
    const promises = Array.from(this.sources.keys()).map(source =>
      this.generateFromSource(source, criteria)
    );

    const results = await Promise.allSettled(promises);
    return results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);
  }

  /**
   * Normalize lead data to universal format
   * @param {Array} leads - Raw leads from source
   * @param {String} source - Source name
   * @returns {Array} Normalized leads
   */
  normalizeLeads(leads, source) {
    return leads.map(lead => ({
      name: lead.name || lead.companyName || lead.businessName,
      contact: lead.email || lead.contact || lead.phone,
      industry: lead.industry || lead.sector || 'Unknown',
      location: lead.location || lead.city || lead.state,
      size: lead.employees || lead.size || lead.revenue,
      metadata: {
        source,
        originalData: lead,
        capturedAt: new Date().toISOString()
      }
    }));
  }

  /**
   * Store leads in database
   * @param {Array} leads - Normalized leads
   * @param {String} divisionId - Division ID
   * @returns {Promise<Array>} Stored lead IDs
   */
  async storeLeads(leads, divisionId) {
    if (!this.db) {
      console.warn('No database connection, skipping storage');
      return [];
    }

    const stored = [];
    for (const lead of leads) {
      try {
        const result = await this.db.query(
          `INSERT INTO universal_leads 
           (division_id, name, contact, industry, location, size, metadata, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING id`,
          [
            divisionId,
            lead.name,
            lead.contact,
            lead.industry,
            lead.location,
            lead.size,
            JSON.stringify(lead.metadata)
          ]
        );
        stored.push(result.rows[0].id);
      } catch (error) {
        console.error('Error storing lead:', error);
      }
    }

    return stored;
  }

  /**
   * Search existing leads
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Matching leads
   */
  async searchLeads(filters = {}) {
    if (!this.db) {
      return [];
    }

    let query = 'SELECT * FROM universal_leads WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filters.divisionId) {
      query += ` AND division_id = $${paramCount++}`;
      params.push(filters.divisionId);
    }

    if (filters.industry) {
      query += ` AND industry ILIKE $${paramCount++}`;
      params.push(`%${filters.industry}%`);
    }

    if (filters.location) {
      query += ` AND location ILIKE $${paramCount++}`;
      params.push(`%${filters.location}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    try {
      const result = await this.db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error searching leads:', error);
      return [];
    }
  }

  /**
   * Generate mock leads for testing
   * @param {Number} count - Number of mock leads to generate
   * @returns {Array} Mock leads
   */
  generateMockLeads(count = 10) {
    const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Real Estate'];
    const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Chicago, IL', 'Boston, MA'];
    
    const leads = [];
    for (let i = 0; i < count; i++) {
      leads.push({
        name: `Company ${i + 1}`,
        contact: `contact${i + 1}@example.com`,
        industry: industries[Math.floor(Math.random() * industries.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        size: Math.floor(Math.random() * 1000) + 10,
        metadata: {
          source: 'mock',
          capturedAt: new Date().toISOString()
        }
      });
    }
    
    return leads;
  }
}

module.exports = LeadGenerator;
