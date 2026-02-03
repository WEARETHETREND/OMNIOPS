/**
 * OpportunityMatcher - Universal opportunity matching engine
 * 
 * Scores lead-opportunity pairs using weighted algorithms.
 * Returns 0-100 match scores with reasoning.
 */

class OpportunityMatcher {
  constructor(db) {
    this.db = db;
    this.weights = {
      industry: 0.30,
      location: 0.25,
      size: 0.20,
      timing: 0.15,
      budget: 0.10
    };
  }

  /**
   * Score a lead-opportunity match
   * @param {Object} lead - The potential client
   * @param {Object} opportunity - The service/provider
   * @param {Object} customWeights - Optional custom weights
   * @returns {Object} Match score and detailed reasoning
   */
  async scoreMatch(lead, opportunity, customWeights = null) {
    const weights = customWeights || this.weights;
    
    const scores = {
      industry: this.scoreIndustry(lead, opportunity),
      location: this.scoreLocation(lead, opportunity),
      size: this.scoreSize(lead, opportunity),
      timing: this.scoreTiming(lead, opportunity),
      budget: this.scoreBudget(lead, opportunity)
    };

    // Calculate weighted total
    let totalScore = 0;
    const reasoning = [];

    for (const [factor, score] of Object.entries(scores)) {
      const weight = weights[factor] || 0;
      const weightedScore = score * weight;
      totalScore += weightedScore;

      reasoning.push({
        factor,
        score,
        weight,
        contribution: weightedScore,
        explanation: this.getExplanation(factor, score, lead, opportunity)
      });
    }

    // Normalize to 0-100
    const finalScore = Math.round(totalScore * 100);

    return {
      score: finalScore,
      recommendation: this.getRecommendation(finalScore),
      reasoning,
      confidence: this.calculateConfidence(scores),
      metadata: {
        leadId: lead.id,
        opportunityId: opportunity.id,
        scoredAt: new Date().toISOString()
      }
    };
  }

  /**
   * Score industry alignment
   * @param {Object} lead
   * @param {Object} opportunity
   * @returns {Number} 0-1 score
   */
  scoreIndustry(lead, opportunity) {
    const leadIndustry = (lead.industry || '').toLowerCase();
    const oppIndustry = (opportunity.industry || opportunity.sector || '').toLowerCase();

    if (leadIndustry === oppIndustry) return 1.0;
    if (leadIndustry.includes(oppIndustry) || oppIndustry.includes(leadIndustry)) return 0.7;
    
    // Check for related industries
    const relatedIndustries = {
      'technology': ['software', 'it', 'tech', 'saas'],
      'healthcare': ['medical', 'hospital', 'pharma'],
      'finance': ['banking', 'insurance', 'fintech'],
      'real estate': ['property', 'construction', 'development']
    };

    for (const [key, related] of Object.entries(relatedIndustries)) {
      if ((leadIndustry.includes(key) || related.some(r => leadIndustry.includes(r))) &&
          (oppIndustry.includes(key) || related.some(r => oppIndustry.includes(r)))) {
        return 0.6;
      }
    }

    return 0.3;
  }

  /**
   * Score location proximity
   * @param {Object} lead
   * @param {Object} opportunity
   * @returns {Number} 0-1 score
   */
  scoreLocation(lead, opportunity) {
    const leadLoc = (lead.location || '').toLowerCase();
    const oppLoc = (opportunity.location || '').toLowerCase();

    if (!leadLoc || !oppLoc) return 0.5; // Neutral if unknown

    if (leadLoc === oppLoc) return 1.0;

    // Check if same state
    const leadState = leadLoc.split(',').pop().trim();
    const oppState = oppLoc.split(',').pop().trim();
    if (leadState === oppState) return 0.7;

    // Check if same region (simplified)
    const regions = {
      northeast: ['ny', 'nj', 'pa', 'ma', 'ct', 'ri', 'vt', 'nh', 'me'],
      southeast: ['fl', 'ga', 'sc', 'nc', 'va', 'tn', 'al', 'ms', 'la'],
      midwest: ['il', 'in', 'oh', 'mi', 'wi', 'mn', 'ia', 'mo'],
      west: ['ca', 'or', 'wa', 'nv', 'az', 'co', 'ut'],
      southwest: ['tx', 'nm', 'ok', 'ar']
    };

    for (const states of Object.values(regions)) {
      if (states.includes(leadState) && states.includes(oppState)) {
        return 0.5;
      }
    }

    return 0.3;
  }

  /**
   * Score size/scale compatibility
   * @param {Object} lead
   * @param {Object} opportunity
   * @returns {Number} 0-1 score
   */
  scoreSize(lead, opportunity) {
    const leadSize = lead.size || lead.employees || 0;
    const oppMinSize = opportunity.minSize || 0;
    const oppMaxSize = opportunity.maxSize || Infinity;

    if (leadSize >= oppMinSize && leadSize <= oppMaxSize) return 1.0;
    
    // Calculate how far off the range
    if (leadSize < oppMinSize) {
      const ratio = leadSize / oppMinSize;
      return Math.max(0.3, ratio);
    }
    
    if (leadSize > oppMaxSize) {
      const ratio = oppMaxSize / leadSize;
      return Math.max(0.3, ratio);
    }

    return 0.5;
  }

  /**
   * Score timing compatibility
   * @param {Object} lead
   * @param {Object} opportunity
   * @returns {Number} 0-1 score
   */
  scoreTiming(lead, opportunity) {
    const now = new Date();
    
    // Check opportunity urgency
    if (opportunity.deadline) {
      const deadline = new Date(opportunity.deadline);
      const daysUntil = (deadline - now) / (1000 * 60 * 60 * 24);
      
      if (daysUntil < 0) return 0; // Expired
      if (daysUntil < 7) return 1.0; // Urgent
      if (daysUntil < 30) return 0.8;
      if (daysUntil < 90) return 0.6;
      return 0.4;
    }

    // Check lead freshness
    if (lead.created_at || lead.capturedAt) {
      const leadDate = new Date(lead.created_at || lead.capturedAt);
      const daysOld = (now - leadDate) / (1000 * 60 * 60 * 24);
      
      if (daysOld < 7) return 1.0;
      if (daysOld < 30) return 0.8;
      if (daysOld < 90) return 0.6;
      return 0.4;
    }

    return 0.5; // Neutral if no timing info
  }

  /**
   * Score budget/value alignment
   * @param {Object} lead
   * @param {Object} opportunity
   * @returns {Number} 0-1 score
   */
  scoreBudget(lead, opportunity) {
    const leadBudget = lead.budget || lead.revenue || 0;
    const oppValue = opportunity.value || opportunity.contractValue || 0;

    if (!leadBudget || !oppValue) return 0.5; // Neutral if unknown

    const ratio = oppValue / leadBudget;
    
    // Ideal range: 1-10% of budget
    if (ratio >= 0.01 && ratio <= 0.10) return 1.0;
    if (ratio >= 0.001 && ratio <= 0.20) return 0.7;
    if (ratio < 0.001) return 0.4; // Too small
    if (ratio > 0.50) return 0.2; // Too expensive
    
    return 0.5;
  }

  /**
   * Get explanation for a factor score
   * @param {String} factor
   * @param {Number} score
   * @param {Object} lead
   * @param {Object} opportunity
   * @returns {String} Human-readable explanation
   */
  getExplanation(factor, score, lead, opportunity) {
    const scoreLevel = score >= 0.8 ? 'Excellent' : score >= 0.6 ? 'Good' : score >= 0.4 ? 'Fair' : 'Poor';
    
    switch (factor) {
      case 'industry':
        return `${scoreLevel} industry alignment between ${lead.industry || 'Unknown'} and ${opportunity.industry || opportunity.sector || 'Unknown'}`;
      case 'location':
        return `${scoreLevel} location match: ${lead.location || 'Unknown'} to ${opportunity.location || 'Unknown'}`;
      case 'size':
        return `${scoreLevel} size compatibility for ${lead.size || 'unknown'} employee company`;
      case 'timing':
        return `${scoreLevel} timing based on urgency and freshness`;
      case 'budget':
        return `${scoreLevel} budget alignment for opportunity value`;
      default:
        return `${scoreLevel} match`;
    }
  }

  /**
   * Get recommendation based on score
   * @param {Number} score - 0-100
   * @returns {String} Recommendation
   */
  getRecommendation(score) {
    if (score >= 80) return 'Highly Recommended - Prioritize this match';
    if (score >= 60) return 'Recommended - Good potential fit';
    if (score >= 40) return 'Consider - May require additional qualification';
    return 'Low Priority - Significant gaps exist';
  }

  /**
   * Calculate confidence level
   * @param {Object} scores - Individual factor scores
   * @returns {String} Confidence level
   */
  calculateConfidence(scores) {
    const values = Object.values(scores);
    const variance = this.calculateVariance(values);
    
    if (variance < 0.05) return 'High';
    if (variance < 0.15) return 'Medium';
    return 'Low';
  }

  /**
   * Calculate variance of scores
   * @param {Array} values
   * @returns {Number} Variance
   */
  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Store match in database
   * @param {Object} matchResult - Match scoring result
   * @param {String} leadId
   * @param {String} opportunityId
   * @param {String} divisionId
   * @returns {Promise<Number>} Stored match ID
   */
  async storeMatch(matchResult, leadId, opportunityId, divisionId) {
    if (!this.db) {
      console.warn('No database connection, skipping match storage');
      return null;
    }

    try {
      const result = await this.db.query(
        `INSERT INTO lead_opportunity_matches 
         (lead_id, opportunity_id, division_id, score, recommendation, reasoning, confidence, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING id`,
        [
          leadId,
          opportunityId,
          divisionId,
          matchResult.score,
          matchResult.recommendation,
          JSON.stringify(matchResult.reasoning),
          matchResult.confidence
        ]
      );
      return result.rows[0].id;
    } catch (error) {
      console.error('Error storing match:', error);
      return null;
    }
  }

  /**
   * Batch score multiple lead-opportunity pairs
   * @param {Array} leads
   * @param {Array} opportunities
   * @returns {Promise<Array>} Sorted matches by score
   */
  async batchScore(leads, opportunities) {
    const matches = [];

    for (const lead of leads) {
      for (const opportunity of opportunities) {
        const match = await this.scoreMatch(lead, opportunity);
        matches.push({
          lead,
          opportunity,
          ...match
        });
      }
    }

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  }
}

module.exports = OpportunityMatcher;
