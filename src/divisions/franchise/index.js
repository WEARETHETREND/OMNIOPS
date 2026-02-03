/**
 * Franchise Brokerage Division
 * 
 * Connects entrepreneurs with franchise opportunities
 * Focus: Matching business buyers with franchise systems
 */

import BaseDivision from '../../core/BaseDivision.js';

class FranchiseDivision extends BaseDivision {
  constructor() {
    super({
      id: 'franchise',
      name: 'Franchise Brokerage',
      description: 'Franchise opportunity matching and consulting',
      commissionRate: 0.15, // 15% of franchise fee (paid by franchisor)
      dataSources: ['FranchiseGator', 'Franchise.com', 'IFA', 'Direct Franchisor Relationships']
    });
  }

  async findLeads(criteria = {}) {
    const mockLeads = [
      {
        id: 'fran-lead-001',
        name: 'Michael Chen',
        type: 'First-Time Buyer',
        contact: { email: 'mchen@email.com', phone: '408-555-0101' },
        liquidCapital: 250000,
        totalInvestmentCapacity: 500000,
        industryPreferences: ['Food Service', 'Quick Service Restaurant'],
        experienceLevel: 'Corporate Executive',
        desiredInvolvement: 'Semi-Absentee',
        location: 'San Jose, CA',
        timeframe: '3-6 months',
        creditScore: 750,
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'fran-lead-002',
        name: 'Sarah Johnson',
        type: 'Multi-Unit Operator',
        contact: { email: 'sjohnson@email.com', phone: '214-555-0202' },
        liquidCapital: 800000,
        totalInvestmentCapacity: 2000000,
        industryPreferences: ['Fitness', 'Health & Wellness'],
        experienceLevel: 'Franchise Owner',
        desiredInvolvement: 'Full-Time',
        currentFranchises: ['Anytime Fitness'],
        location: 'Dallas, TX',
        timeframe: '1-3 months',
        creditScore: 780,
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'fran-lead-003',
        name: 'Robert Martinez',
        type: 'Corporate Refugee',
        contact: { email: 'rmartinez@email.com', phone: '404-555-0303' },
        liquidCapital: 150000,
        totalInvestmentCapacity: 300000,
        industryPreferences: ['Home Services', 'Senior Care'],
        experienceLevel: 'Sales Manager',
        desiredInvolvement: 'Owner-Operator',
        location: 'Atlanta, GA',
        timeframe: '6-12 months',
        creditScore: 720,
        status: 'active',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'fran-lead-004',
        name: 'Lisa Thompson',
        type: 'Investment Group',
        contact: { email: 'lthompson@investgroup.com', phone: '303-555-0404' },
        liquidCapital: 3000000,
        totalInvestmentCapacity: 10000000,
        industryPreferences: ['Quick Service Restaurant', 'Fast Casual'],
        experienceLevel: 'Private Equity',
        desiredInvolvement: 'Passive Investor',
        location: 'Denver, CO',
        timeframe: '1-3 months',
        creditScore: 800,
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'fran-lead-005',
        name: 'David Kim',
        type: 'First-Time Buyer',
        contact: { email: 'dkim@email.com', phone: '206-555-0505' },
        liquidCapital: 100000,
        totalInvestmentCapacity: 200000,
        industryPreferences: ['Retail', 'Education'],
        experienceLevel: 'Teacher',
        desiredInvolvement: 'Full-Time',
        location: 'Seattle, WA',
        timeframe: '3-6 months',
        creditScore: 710,
        status: 'active',
        createdAt: new Date('2024-01-28')
      },
      {
        id: 'fran-lead-006',
        name: 'Jennifer Rodriguez',
        type: 'Serial Entrepreneur',
        contact: { email: 'jrodriguez@email.com', phone: '305-555-0606' },
        liquidCapital: 500000,
        totalInvestmentCapacity: 1200000,
        industryPreferences: ['Beauty & Wellness', 'Retail'],
        experienceLevel: 'Business Owner',
        desiredInvolvement: 'Semi-Absentee',
        currentBusinesses: ['Hair salon', 'Spa'],
        location: 'Miami, FL',
        timeframe: '1-3 months',
        creditScore: 760,
        status: 'active',
        createdAt: new Date('2024-02-05')
      },
      {
        id: 'fran-lead-007',
        name: 'James Wilson',
        type: 'Veteran',
        contact: { email: 'jwilson@email.com', phone: '619-555-0707' },
        liquidCapital: 180000,
        totalInvestmentCapacity: 350000,
        industryPreferences: ['Home Services', 'Automotive'],
        experienceLevel: 'Military Officer',
        desiredInvolvement: 'Owner-Operator',
        veteranStatus: 'Eligible for VetFran',
        location: 'San Diego, CA',
        timeframe: '3-6 months',
        creditScore: 740,
        status: 'active',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'fran-lead-008',
        name: 'Amanda Foster',
        type: 'Husband-Wife Team',
        contact: { email: 'afoster@email.com', phone: '602-555-0808' },
        liquidCapital: 400000,
        totalInvestmentCapacity: 800000,
        industryPreferences: ['Food Service', 'Children Services'],
        experienceLevel: 'Mixed (Corporate + Small Business)',
        desiredInvolvement: 'Full-Time',
        location: 'Phoenix, AZ',
        timeframe: '6-12 months',
        creditScore: 755,
        status: 'active',
        createdAt: new Date('2024-02-08')
      },
      {
        id: 'fran-lead-009',
        name: 'Christopher Lee',
        type: 'Converting Business Owner',
        contact: { email: 'clee@email.com', phone: '617-555-0909' },
        liquidCapital: 350000,
        totalInvestmentCapacity: 700000,
        industryPreferences: ['Fitness', 'Health & Wellness'],
        experienceLevel: 'Gym Owner',
        desiredInvolvement: 'Full-Time',
        currentBusinesses: ['Independent gym'],
        location: 'Boston, MA',
        timeframe: '1-3 months',
        creditScore: 770,
        status: 'active',
        createdAt: new Date('2024-01-25')
      },
      {
        id: 'fran-lead-010',
        name: 'Maria Gonzalez',
        type: 'Area Developer',
        contact: { email: 'mgonzalez@email.com', phone: '512-555-1010' },
        liquidCapital: 1500000,
        totalInvestmentCapacity: 5000000,
        industryPreferences: ['Quick Service Restaurant', 'Home Services'],
        experienceLevel: 'Multi-Unit Franchise Owner',
        desiredInvolvement: 'Area Development',
        currentFranchises: ['Multiple QSR brands'],
        location: 'Austin, TX',
        timeframe: '1-3 months',
        creditScore: 790,
        status: 'active',
        createdAt: new Date('2024-02-10')
      }
    ];

    return mockLeads.filter(lead => {
      if (criteria.minCapital && lead.liquidCapital < criteria.minCapital) return false;
      if (criteria.industry && !lead.industryPreferences.includes(criteria.industry)) return false;
      if (criteria.location && !lead.location.includes(criteria.location)) return false;
      return true;
    });
  }

  async findOpportunities(criteria = {}) {
    const mockOpportunities = [
      {
        id: 'fran-opp-001',
        franchiseName: 'Burger Boss',
        category: 'Quick Service Restaurant',
        franchiseFee: 45000,
        totalInvestment: { min: 300000, max: 500000 },
        liquidCapitalRequired: 150000,
        royaltyRate: 0.06,
        adFundRate: 0.02,
        unitCount: 450,
        yearEstablished: 2005,
        franchisingSince: 2010,
        territories: 'All US states',
        trainingProvided: 'Extensive',
        supportLevel: 'High',
        avgUnitRevenue: 850000,
        profitMargin: 0.18,
        veteranDiscount: true,
        description: 'Fast-growing better burger concept',
        status: 'available',
        listedDate: new Date('2024-02-01')
      },
      {
        id: 'fran-opp-002',
        franchiseName: 'Peak Performance Fitness',
        category: 'Fitness',
        franchiseFee: 60000,
        totalInvestment: { min: 500000, max: 1200000 },
        liquidCapitalRequired: 300000,
        royaltyRate: 0.07,
        adFundRate: 0.02,
        unitCount: 280,
        yearEstablished: 2012,
        franchisingSince: 2015,
        territories: 'Select markets',
        trainingProvided: 'Comprehensive',
        supportLevel: 'High',
        avgUnitRevenue: 1200000,
        profitMargin: 0.25,
        veteranDiscount: false,
        description: '24/7 fitness center with boutique feel',
        status: 'available',
        listedDate: new Date('2024-01-28')
      },
      {
        id: 'fran-opp-003',
        franchiseName: 'Golden Years Home Care',
        category: 'Senior Care',
        franchiseFee: 40000,
        totalInvestment: { min: 100000, max: 150000 },
        liquidCapitalRequired: 50000,
        royaltyRate: 0.05,
        adFundRate: 0.01,
        unitCount: 320,
        yearEstablished: 2008,
        franchisingSince: 2011,
        territories: 'All US states',
        trainingProvided: 'Extensive',
        supportLevel: 'Very High',
        avgUnitRevenue: 650000,
        profitMargin: 0.22,
        veteranDiscount: true,
        homeBasedOption: true,
        description: 'Non-medical home care for seniors',
        status: 'available',
        listedDate: new Date('2024-02-05')
      },
      {
        id: 'fran-opp-004',
        franchiseName: 'Fresh Bowls Kitchen',
        category: 'Fast Casual',
        franchiseFee: 50000,
        totalInvestment: { min: 400000, max: 700000 },
        liquidCapitalRequired: 200000,
        royaltyRate: 0.06,
        adFundRate: 0.03,
        unitCount: 150,
        yearEstablished: 2015,
        franchisingSince: 2018,
        territories: 'Major metros only',
        trainingProvided: 'Comprehensive',
        supportLevel: 'High',
        avgUnitRevenue: 950000,
        profitMargin: 0.20,
        veteranDiscount: false,
        description: 'Healthy bowls and wraps concept',
        status: 'available',
        listedDate: new Date('2024-02-10')
      },
      {
        id: 'fran-opp-005',
        franchiseName: 'STEM Stars Learning Center',
        category: 'Education',
        franchiseFee: 35000,
        totalInvestment: { min: 150000, max: 300000 },
        liquidCapitalRequired: 75000,
        royaltyRate: 0.08,
        adFundRate: 0.02,
        unitCount: 185,
        yearEstablished: 2010,
        franchisingSince: 2013,
        territories: 'All US states',
        trainingProvided: 'Extensive',
        supportLevel: 'High',
        avgUnitRevenue: 520000,
        profitMargin: 0.28,
        veteranDiscount: true,
        description: 'STEM education for kids ages 5-14',
        status: 'available',
        listedDate: new Date('2024-01-20')
      },
      {
        id: 'fran-opp-006',
        franchiseName: 'Radiant Beauty Bar',
        category: 'Beauty & Wellness',
        franchiseFee: 45000,
        totalInvestment: { min: 250000, max: 450000 },
        liquidCapitalRequired: 125000,
        royaltyRate: 0.06,
        adFundRate: 0.02,
        unitCount: 95,
        yearEstablished: 2016,
        franchisingSince: 2019,
        territories: 'Urban markets',
        trainingProvided: 'Comprehensive',
        supportLevel: 'Medium',
        avgUnitRevenue: 680000,
        profitMargin: 0.24,
        veteranDiscount: false,
        description: 'Express beauty services and blowouts',
        status: 'available',
        listedDate: new Date('2024-02-08')
      },
      {
        id: 'fran-opp-007',
        franchiseName: 'ProTech Auto Care',
        category: 'Automotive',
        franchiseFee: 40000,
        totalInvestment: { min: 200000, max: 400000 },
        liquidCapitalRequired: 100000,
        royaltyRate: 0.05,
        adFundRate: 0.02,
        unitCount: 220,
        yearEstablished: 2007,
        franchisingSince: 2012,
        territories: 'All US states',
        trainingProvided: 'Extensive',
        supportLevel: 'High',
        avgUnitRevenue: 750000,
        profitMargin: 0.20,
        veteranDiscount: true,
        description: 'Oil change and preventive maintenance',
        status: 'available',
        listedDate: new Date('2024-01-25')
      },
      {
        id: 'fran-opp-008',
        franchiseName: 'Little Explorers Academy',
        category: 'Children Services',
        franchiseFee: 55000,
        totalInvestment: { min: 500000, max: 1000000 },
        liquidCapitalRequired: 250000,
        royaltyRate: 0.07,
        adFundRate: 0.01,
        unitCount: 125,
        yearEstablished: 2013,
        franchisingSince: 2016,
        territories: 'Select states',
        trainingProvided: 'Extensive',
        supportLevel: 'Very High',
        avgUnitRevenue: 1100000,
        profitMargin: 0.19,
        veteranDiscount: false,
        description: 'Premium early childhood education',
        status: 'available',
        listedDate: new Date('2024-02-12')
      },
      {
        id: 'fran-opp-009',
        franchiseName: 'Handyman Heroes',
        category: 'Home Services',
        franchiseFee: 35000,
        totalInvestment: { min: 75000, max: 125000 },
        liquidCapitalRequired: 40000,
        royaltyRate: 0.06,
        adFundRate: 0.02,
        unitCount: 410,
        yearEstablished: 2005,
        franchisingSince: 2009,
        territories: 'All US states',
        trainingProvided: 'Comprehensive',
        supportLevel: 'High',
        avgUnitRevenue: 580000,
        profitMargin: 0.26,
        veteranDiscount: true,
        homeBasedOption: true,
        description: 'Professional handyman services',
        status: 'available',
        listedDate: new Date('2024-01-18')
      },
      {
        id: 'fran-opp-010',
        franchiseName: 'Taco Express',
        category: 'Quick Service Restaurant',
        franchiseFee: 40000,
        totalInvestment: { min: 350000, max: 600000 },
        liquidCapitalRequired: 175000,
        royaltyRate: 0.05,
        adFundRate: 0.03,
        unitCount: 580,
        yearEstablished: 2002,
        franchisingSince: 2006,
        territories: 'All US states',
        trainingProvided: 'Extensive',
        supportLevel: 'High',
        avgUnitRevenue: 920000,
        profitMargin: 0.17,
        veteranDiscount: true,
        description: 'Fast-casual Mexican restaurant',
        status: 'available',
        listedDate: new Date('2024-02-15')
      }
    ];

    return mockOpportunities.filter(opp => {
      if (criteria.category && opp.category !== criteria.category) return false;
      if (criteria.maxInvestment && opp.totalInvestment.min > criteria.maxInvestment) return false;
      if (criteria.veteranOnly && !opp.veteranDiscount) return false;
      return true;
    });
  }

  async scoreMatch(lead, opportunity) {
    let score = 0;
    const factors = [];

    // Industry preference match (30 points)
    const industryMatch = lead.industryPreferences.includes(opportunity.category);
    if (industryMatch) {
      score += 30;
      factors.push({ factor: 'Industry Match', points: 30, status: 'excellent' });
    } else {
      factors.push({ factor: 'Industry Match', points: 0, status: 'poor' });
    }

    // Financial capacity (30 points)
    const meetsLiquidRequirement = lead.liquidCapital >= opportunity.liquidCapitalRequired;
    const meetsTotalInvestment = lead.totalInvestmentCapacity >= opportunity.totalInvestment.min;
    
    if (meetsLiquidRequirement && meetsTotalInvestment) {
      const cushion = lead.liquidCapital / opportunity.liquidCapitalRequired;
      if (cushion >= 1.5) {
        score += 30;
        factors.push({ factor: 'Financial Capacity', points: 30, status: 'excellent' });
      } else {
        score += 25;
        factors.push({ factor: 'Financial Capacity', points: 25, status: 'good' });
      }
    } else if (meetsLiquidRequirement || meetsTotalInvestment) {
      score += 15;
      factors.push({ factor: 'Financial Capacity', points: 15, status: 'fair' });
    } else {
      score += 5;
      factors.push({ factor: 'Financial Capacity', points: 5, status: 'poor' });
    }

    // Experience level alignment (20 points)
    const experienceScore = {
      'First-Time Buyer': opportunity.supportLevel === 'Very High' || opportunity.supportLevel === 'High' ? 20 : 12,
      'Corporate Executive': opportunity.supportLevel === 'High' ? 20 : 15,
      'Business Owner': 18,
      'Franchise Owner': 20,
      'Multi-Unit Franchise Owner': 20,
      'Serial Entrepreneur': 18
    };
    const expPoints = experienceScore[lead.experienceLevel] || 10;
    score += expPoints;
    factors.push({ 
      factor: 'Experience Match', 
      points: expPoints, 
      status: expPoints >= 18 ? 'excellent' : expPoints >= 15 ? 'good' : 'fair' 
    });

    // Involvement model match (10 points)
    let involvementPoints = 10;
    if (lead.desiredInvolvement === 'Semi-Absentee' || lead.desiredInvolvement === 'Passive Investor') {
      if (opportunity.category === 'Home Services' || opportunity.homeBasedOption) {
        involvementPoints = 10;
      } else if (opportunity.category === 'Quick Service Restaurant') {
        involvementPoints = 5;
      }
    }
    score += involvementPoints;
    factors.push({ 
      factor: 'Involvement Model', 
      points: involvementPoints, 
      status: involvementPoints >= 10 ? 'excellent' : 'good' 
    });

    // Special considerations (10 points)
    if (lead.veteranStatus && opportunity.veteranDiscount) {
      score += 10;
      factors.push({ factor: 'Veteran Discount Available', points: 10, status: 'excellent' });
    } else if (lead.type === 'Multi-Unit Operator' && opportunity.unitCount > 100) {
      score += 10;
      factors.push({ factor: 'Established System', points: 10, status: 'excellent' });
    } else {
      score += 5;
      factors.push({ factor: 'Standard Terms', points: 5, status: 'good' });
    }

    return {
      score,
      maxScore: 100,
      percentage: Math.round(score),
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
      factors,
      recommendation: score >= 75 ? 'Highly Recommended - Strong Fit' : 
                     score >= 55 ? 'Recommended - Good Match' : 
                     'Consider Carefully',
      estimatedCommission: this.calculateCommission({ value: opportunity.franchiseFee })
    };
  }
}

export default FranchiseDivision;
