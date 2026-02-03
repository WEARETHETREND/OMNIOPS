/**
 * Commercial Insurance Division
 * 
 * Connects businesses with commercial insurance policies and carriers
 * Focus: Business insurance, liability, workers comp, specialty coverage
 */

import BaseDivision from '../../core/BaseDivision.js';

class InsuranceDivision extends BaseDivision {
  constructor() {
    super({
      id: 'insurance',
      name: 'Commercial Insurance',
      description: 'Business insurance brokerage and risk management',
      commissionRate: 0.15, // 15% of annual premium
      dataSources: ['AM Best', 'Insurance Carrier Networks', 'Risk Management Associations']
    });
  }

  async findLeads(criteria = {}) {
    const mockLeads = [
      {
        id: 'ins-lead-001',
        name: 'TechStart Solutions',
        type: 'Technology',
        contact: { name: 'Sarah Mitchell', email: 'smitchell@techstart.com', phone: '512-555-0101' },
        yearsInBusiness: 5,
        employees: 75,
        revenue: 12000000,
        coverageNeeds: ['General Liability', 'E&O', 'Cyber Liability', 'Workers Comp'],
        currentCarrier: 'Small regional insurer',
        expirationDate: new Date('2024-05-15'),
        claimsHistory: 'Clean - no claims in 3 years',
        riskFactors: ['Data handling', 'Software products'],
        budget: { min: 75000, max: 120000 },
        location: 'Austin, TX',
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'ins-lead-002',
        name: 'BuildCo Construction',
        type: 'Construction',
        contact: { name: 'Michael Torres', email: 'mtorres@buildco.com', phone: '303-555-0202' },
        yearsInBusiness: 18,
        employees: 250,
        revenue: 45000000,
        coverageNeeds: ['General Liability', 'Workers Comp', 'Builders Risk', 'Auto', 'Umbrella'],
        currentCarrier: 'Major construction insurer',
        expirationDate: new Date('2024-06-30'),
        claimsHistory: '3 claims in past 5 years',
        riskFactors: ['Heavy equipment', 'High-rise work', 'Large payroll'],
        budget: { min: 450000, max: 650000 },
        location: 'Denver, CO',
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'ins-lead-003',
        name: 'Metro Medical Group',
        type: 'Healthcare',
        contact: { name: 'Dr. Jennifer Walsh', email: 'jwalsh@metromedical.com', phone: '713-555-0303' },
        yearsInBusiness: 12,
        employees: 120,
        revenue: 28000000,
        coverageNeeds: ['Medical Malpractice', 'General Liability', 'Cyber Liability', 'Workers Comp'],
        currentCarrier: 'Healthcare specialty insurer',
        expirationDate: new Date('2024-07-01'),
        claimsHistory: '2 malpractice claims settled',
        riskFactors: ['Multiple providers', 'Surgical procedures', 'PHI data'],
        budget: { min: 320000, max: 450000 },
        location: 'Houston, TX',
        status: 'active',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'ins-lead-004',
        name: 'Coastal Restaurants Group',
        type: 'Hospitality',
        contact: { name: 'Carlos Rivera', email: 'crivera@coastalrestaurants.com', phone: '305-555-0404' },
        yearsInBusiness: 8,
        employees: 380,
        revenue: 18000000,
        coverageNeeds: ['General Liability', 'Workers Comp', 'Liquor Liability', 'Property'],
        currentCarrier: 'Multiple carriers',
        expirationDate: new Date('2024-04-30'),
        claimsHistory: 'Several slip & falls, 1 liquor liability claim',
        riskFactors: ['Alcohol service', 'High turnover', 'Multiple locations'],
        budget: { min: 180000, max: 280000 },
        location: 'Miami, FL',
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'ins-lead-005',
        name: 'LogiTrans Freight',
        type: 'Transportation',
        contact: { name: 'Robert Henderson', email: 'rhenderson@logitrans.com', phone: '404-555-0505' },
        yearsInBusiness: 15,
        employees: 180,
        revenue: 32000000,
        coverageNeeds: ['Auto Liability', 'Cargo', 'General Liability', 'Workers Comp'],
        currentCarrier: 'Transportation specialty carrier',
        expirationDate: new Date('2024-08-15'),
        claimsHistory: 'Multiple auto accidents, typical for industry',
        riskFactors: ['Fleet of 120 trucks', 'Long haul operations', 'High-value cargo'],
        budget: { min: 520000, max: 720000 },
        location: 'Atlanta, GA',
        status: 'active',
        createdAt: new Date('2024-01-28')
      },
      {
        id: 'ins-lead-006',
        name: 'Advanced Manufacturing Corp',
        type: 'Manufacturing',
        contact: { name: 'Lisa Anderson', email: 'landerson@advmfg.com', phone: '414-555-0606' },
        yearsInBusiness: 25,
        employees: 420,
        revenue: 68000000,
        coverageNeeds: ['General Liability', 'Product Liability', 'Property', 'Workers Comp', 'Umbrella'],
        currentCarrier: 'Regional carrier',
        expirationDate: new Date('2024-09-30'),
        claimsHistory: '1 product liability claim, workers comp claims typical',
        riskFactors: ['Heavy machinery', 'Complex products', 'Export sales'],
        budget: { min: 380000, max: 550000 },
        location: 'Milwaukee, WI',
        status: 'active',
        createdAt: new Date('2024-02-05')
      },
      {
        id: 'ins-lead-007',
        name: 'ProServices Consulting',
        type: 'Professional Services',
        contact: { name: 'Amanda Foster', email: 'afoster@proservices.com', phone: '617-555-0707' },
        yearsInBusiness: 9,
        employees: 95,
        revenue: 22000000,
        coverageNeeds: ['E&O', 'General Liability', 'Cyber Liability', 'EPLI'],
        currentCarrier: 'Small insurer',
        expirationDate: new Date('2024-05-31'),
        claimsHistory: 'Clean record',
        riskFactors: ['Client data', 'Professional advice', 'Contract work'],
        budget: { min: 95000, max: 145000 },
        location: 'Boston, MA',
        status: 'active',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'ins-lead-008',
        name: 'RetailMax Stores',
        type: 'Retail',
        contact: { name: 'David Kim', email: 'dkim@retailmax.com', phone: '612-555-0808' },
        yearsInBusiness: 22,
        employees: 850,
        revenue: 95000000,
        coverageNeeds: ['General Liability', 'Property', 'Workers Comp', 'EPLI', 'Cyber'],
        currentCarrier: 'Major national carrier',
        expirationDate: new Date('2024-10-15'),
        claimsHistory: 'Multiple slip & fall claims',
        riskFactors: ['45 retail locations', 'High foot traffic', 'Seasonal employees'],
        budget: { min: 620000, max: 850000 },
        location: 'Minneapolis, MN',
        status: 'active',
        createdAt: new Date('2024-02-08')
      },
      {
        id: 'ins-lead-009',
        name: 'GreenTech Energy Solutions',
        type: 'Energy',
        contact: { name: 'Jennifer Rodriguez', email: 'jrodriguez@greentech.com', phone: '720-555-0909' },
        yearsInBusiness: 6,
        employees: 145,
        revenue: 38000000,
        coverageNeeds: ['General Liability', 'Pollution Liability', 'Property', 'Workers Comp', 'Auto'],
        currentCarrier: 'Energy specialty insurer',
        expirationDate: new Date('2024-06-01'),
        claimsHistory: '1 pollution claim from installation',
        riskFactors: ['Solar installations', 'Rooftop work', 'Equipment on customer property'],
        budget: { min: 285000, max: 420000 },
        location: 'Denver, CO',
        status: 'active',
        createdAt: new Date('2024-01-25')
      },
      {
        id: 'ins-lead-010',
        name: 'Precision Engineering Services',
        type: 'Engineering',
        contact: { name: 'Dr. Michael Chen', email: 'mchen@precision-eng.com', phone: '206-555-1010' },
        yearsInBusiness: 14,
        employees: 68,
        revenue: 16000000,
        coverageNeeds: ['Professional Liability', 'General Liability', 'Pollution Liability', 'Workers Comp'],
        currentCarrier: 'Engineering specialty carrier',
        expirationDate: new Date('2024-07-15'),
        claimsHistory: '1 professional liability claim 4 years ago',
        riskFactors: ['Large projects', 'Design responsibility', 'Environmental work'],
        budget: { min: 165000, max: 240000 },
        location: 'Seattle, WA',
        status: 'active',
        createdAt: new Date('2024-02-10')
      }
    ];

    return mockLeads.filter(lead => {
      if (criteria.industry && lead.type !== criteria.industry) return false;
      if (criteria.minRevenue && lead.revenue < criteria.minRevenue) return false;
      if (criteria.coverageType && !lead.coverageNeeds.includes(criteria.coverageType)) return false;
      return true;
    });
  }

  async findOpportunities(criteria = {}) {
    const mockOpportunities = [
      {
        id: 'ins-opp-001',
        title: 'Tech & E&O Package',
        carrier: 'TechGuard Insurance',
        amBestRating: 'A+',
        coverageTypes: ['General Liability', 'E&O', 'Cyber Liability', 'Employment Practices'],
        industryFocus: ['Technology', 'Professional Services'],
        minRevenue: 5000000,
        maxRevenue: 50000000,
        premiumRange: { min: 50000, max: 200000 },
        deductibles: [5000, 10000, 25000],
        limits: [1000000, 2000000, 5000000],
        specialFeatures: ['Prior acts coverage', 'Breach response services', 'Regulatory defense'],
        underwritingCriteria: 'Must have security protocols',
        competitiveAdvantages: ['Broad cyber coverage', 'Favorable terms for SaaS'],
        status: 'available',
        listedDate: new Date('2024-02-01')
      },
      {
        id: 'ins-opp-002',
        title: 'Construction Comprehensive',
        carrier: 'BuildSure Insurance Group',
        amBestRating: 'A',
        coverageTypes: ['General Liability', 'Workers Comp', 'Builders Risk', 'Commercial Auto', 'Umbrella'],
        industryFocus: ['Construction'],
        minRevenue: 10000000,
        maxRevenue: 100000000,
        premiumRange: { min: 300000, max: 1000000 },
        deductibles: [10000, 25000, 50000],
        limits: [2000000, 5000000, 10000000],
        specialFeatures: ['Wrap-up options', 'Subcontractor coverage', 'Equipment protection'],
        underwritingCriteria: 'Safety program required',
        competitiveAdvantages: ['Experience mod credits', 'Bundle discounts'],
        status: 'available',
        listedDate: new Date('2024-01-28')
      },
      {
        id: 'ins-opp-003',
        title: 'Medical Professional Package',
        carrier: 'HealthPro Insurance',
        amBestRating: 'A+',
        coverageTypes: ['Medical Malpractice', 'General Liability', 'Cyber Liability', 'Employment Practices'],
        industryFocus: ['Healthcare'],
        minRevenue: 5000000,
        maxRevenue: 75000000,
        premiumRange: { min: 200000, max: 600000 },
        deductibles: [25000, 50000, 100000],
        limits: [1000000, 2000000, 3000000],
        specialFeatures: ['Tail coverage options', 'Risk management services', 'Defense costs outside limits'],
        underwritingCriteria: 'Board certification required',
        competitiveAdvantages: ['Claims-made with extended reporting', 'Specialty coverage'],
        status: 'available',
        listedDate: new Date('2024-02-05')
      },
      {
        id: 'ins-opp-004',
        title: 'Hospitality & Liquor Package',
        carrier: 'ServiceMaster Insurance',
        amBestRating: 'A-',
        coverageTypes: ['General Liability', 'Workers Comp', 'Liquor Liability', 'Property'],
        industryFocus: ['Hospitality', 'Restaurant'],
        minRevenue: 2000000,
        maxRevenue: 30000000,
        premiumRange: { min: 80000, max: 350000 },
        deductibles: [5000, 10000, 25000],
        limits: [1000000, 2000000],
        specialFeatures: ['Multi-location discounts', 'Food contamination coverage', 'Assault & battery'],
        underwritingCriteria: 'ServSafe certification preferred',
        competitiveAdvantages: ['Flexible liquor liability limits', 'Employee dishonesty'],
        status: 'available',
        listedDate: new Date('2024-01-20')
      },
      {
        id: 'ins-opp-005',
        title: 'Transportation & Fleet',
        carrier: 'TransSecure Insurance',
        amBestRating: 'A',
        coverageTypes: ['Auto Liability', 'Cargo', 'General Liability', 'Workers Comp'],
        industryFocus: ['Transportation', 'Logistics'],
        minRevenue: 10000000,
        maxRevenue: 75000000,
        premiumRange: { min: 400000, max: 900000 },
        deductibles: [10000, 25000, 50000],
        limits: [1000000, 2000000, 5000000],
        specialFeatures: ['Contingent cargo', 'Trailer interchange', 'Hired/non-owned auto'],
        underwritingCriteria: 'DOT safety rating required',
        competitiveAdvantages: ['Fleet safety discounts', 'Driver training credits'],
        status: 'available',
        listedDate: new Date('2024-02-08')
      },
      {
        id: 'ins-opp-006',
        title: 'Manufacturing Excellence',
        carrier: 'Industrial Risk Partners',
        amBestRating: 'A+',
        coverageTypes: ['General Liability', 'Product Liability', 'Property', 'Workers Comp', 'Umbrella'],
        industryFocus: ['Manufacturing'],
        minRevenue: 25000000,
        maxRevenue: 150000000,
        premiumRange: { min: 300000, max: 750000 },
        deductibles: [25000, 50000, 100000],
        limits: [2000000, 5000000, 10000000],
        specialFeatures: ['Foreign liability extension', 'Product recall', 'Equipment breakdown'],
        underwritingCriteria: 'ISO certification preferred',
        competitiveAdvantages: ['Engineering services', 'Loss control support'],
        status: 'available',
        listedDate: new Date('2024-02-10')
      },
      {
        id: 'ins-opp-007',
        title: 'Professional Services Package',
        carrier: 'ProRisk Insurance',
        amBestRating: 'A',
        coverageTypes: ['E&O', 'General Liability', 'Cyber Liability', 'EPLI'],
        industryFocus: ['Professional Services', 'Consulting'],
        minRevenue: 5000000,
        maxRevenue: 40000000,
        premiumRange: { min: 75000, max: 200000 },
        deductibles: [10000, 25000, 50000],
        limits: [1000000, 2000000, 5000000],
        specialFeatures: ['Contractual liability', 'Media liability', 'Network security'],
        underwritingCriteria: 'Professional credentials required',
        competitiveAdvantages: ['Broad E&O coverage', 'Reasonable retention'],
        status: 'available',
        listedDate: new Date('2024-01-25')
      },
      {
        id: 'ins-opp-008',
        title: 'Retail Operations Package',
        carrier: 'Retail Protector Insurance',
        amBestRating: 'A-',
        coverageTypes: ['General Liability', 'Property', 'Workers Comp', 'EPLI', 'Cyber'],
        industryFocus: ['Retail'],
        minRevenue: 20000000,
        maxRevenue: 150000000,
        premiumRange: { min: 450000, max: 1000000 },
        deductibles: [10000, 25000, 50000],
        limits: [2000000, 5000000],
        specialFeatures: ['Business interruption', 'Employee theft', 'Money & securities'],
        underwritingCriteria: 'Security systems required',
        competitiveAdvantages: ['Multi-location program', 'Seasonal workforce coverage'],
        status: 'available',
        listedDate: new Date('2024-02-12')
      },
      {
        id: 'ins-opp-009',
        title: 'Clean Energy Solutions',
        carrier: 'GreenGuard Insurance',
        amBestRating: 'A',
        coverageTypes: ['General Liability', 'Pollution Liability', 'Property', 'Workers Comp', 'Auto'],
        industryFocus: ['Energy', 'Renewable Energy'],
        minRevenue: 15000000,
        maxRevenue: 80000000,
        premiumRange: { min: 250000, max: 500000 },
        deductibles: [15000, 25000, 50000],
        limits: [2000000, 5000000],
        specialFeatures: ['Installation coverage', 'Panel warranty', 'Contractor protective'],
        underwritingCriteria: 'Licensed contractors required',
        competitiveAdvantages: ['Green energy discounts', 'Comprehensive pollution'],
        status: 'available',
        listedDate: new Date('2024-01-18')
      },
      {
        id: 'ins-opp-010',
        title: 'Engineering Professional Package',
        carrier: 'EngineerGuard Insurance',
        amBestRating: 'A+',
        coverageTypes: ['Professional Liability', 'General Liability', 'Pollution Liability', 'Workers Comp'],
        industryFocus: ['Engineering', 'Architecture'],
        minRevenue: 8000000,
        maxRevenue: 50000000,
        premiumRange: { min: 150000, max: 300000 },
        deductibles: [25000, 50000, 75000],
        limits: [2000000, 5000000],
        specialFeatures: ['Project-specific coverage', 'Pre-claim services', 'Contractual liability'],
        underwritingCriteria: 'PE license required',
        competitiveAdvantages: ['Broad form pollution', 'Defense costs included'],
        status: 'available',
        listedDate: new Date('2024-02-15')
      }
    ];

    return mockOpportunities.filter(opp => {
      if (criteria.industry && !opp.industryFocus.includes(criteria.industry)) return false;
      if (criteria.coverageType && !opp.coverageTypes.includes(criteria.coverageType)) return false;
      if (criteria.minRating && opp.amBestRating < criteria.minRating) return false;
      return true;
    });
  }

  async scoreMatch(lead, opportunity) {
    let score = 0;
    const factors = [];

    // Industry focus match (30 points)
    const industryMatch = opportunity.industryFocus.includes(lead.type);
    if (industryMatch) {
      score += 30;
      factors.push({ factor: 'Industry Specialization', points: 30, status: 'excellent' });
    } else {
      factors.push({ factor: 'Industry Specialization', points: 0, status: 'poor' });
    }

    // Coverage needs match (25 points)
    const coverageMatch = lead.coverageNeeds.filter(need => 
      opportunity.coverageTypes.includes(need)
    );
    const coveragePct = coverageMatch.length / lead.coverageNeeds.length;
    const coveragePoints = Math.round(25 * coveragePct);
    score += coveragePoints;
    factors.push({ 
      factor: 'Coverage Match', 
      points: coveragePoints, 
      status: coveragePoints >= 20 ? 'excellent' : coveragePoints >= 15 ? 'good' : 'fair' 
    });

    // Revenue eligibility (20 points)
    if (lead.revenue >= opportunity.minRevenue && lead.revenue <= opportunity.maxRevenue) {
      score += 20;
      factors.push({ factor: 'Revenue Eligibility', points: 20, status: 'excellent' });
    } else if (lead.revenue >= opportunity.minRevenue * 0.8 && lead.revenue <= opportunity.maxRevenue * 1.2) {
      score += 15;
      factors.push({ factor: 'Revenue Close to Range', points: 15, status: 'good' });
    } else {
      score += 5;
      factors.push({ factor: 'Revenue Outside Range', points: 5, status: 'poor' });
    }

    // Premium budget fit (15 points)
    const avgPremium = (opportunity.premiumRange.min + opportunity.premiumRange.max) / 2;
    if (avgPremium >= lead.budget.min && avgPremium <= lead.budget.max) {
      score += 15;
      factors.push({ factor: 'Premium Within Budget', points: 15, status: 'excellent' });
    } else if (avgPremium <= lead.budget.max * 1.1) {
      score += 12;
      factors.push({ factor: 'Premium Near Budget', points: 12, status: 'good' });
    } else if (avgPremium >= lead.budget.min * 0.8) {
      score += 8;
      factors.push({ factor: 'Premium Below Budget', points: 8, status: 'good' });
    } else {
      score += 4;
      factors.push({ factor: 'Premium Mismatch', points: 4, status: 'fair' });
    }

    // Carrier quality (10 points)
    const ratingScore = {
      'A+': 10,
      'A': 9,
      'A-': 7,
      'B+': 5
    };
    const ratingPoints = ratingScore[opportunity.amBestRating] || 3;
    score += ratingPoints;
    factors.push({ 
      factor: 'Carrier Rating', 
      points: ratingPoints, 
      status: ratingPoints >= 9 ? 'excellent' : ratingPoints >= 7 ? 'good' : 'fair' 
    });

    return {
      score,
      maxScore: 100,
      percentage: Math.round(score),
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
      factors,
      recommendation: score >= 75 ? 'Highly Recommended - Quote This Carrier' : 
                     score >= 55 ? 'Good Option - Include in Proposal' : 
                     'Consider Alternatives',
      estimatedPremium: Math.round((opportunity.premiumRange.min + opportunity.premiumRange.max) / 2),
      estimatedCommission: this.calculateCommission({ 
        value: (opportunity.premiumRange.min + opportunity.premiumRange.max) / 2 
      })
    };
  }
}

export default InsuranceDivision;
