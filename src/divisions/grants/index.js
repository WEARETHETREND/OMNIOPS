/**
 * Grant Writing Division
 * 
 * Connects nonprofits, research institutions, and businesses with grant opportunities
 * Focus: Federal grants, foundation grants, and state programs
 */

import BaseDivision from '../../core/BaseDivision.js';

class GrantsDivision extends BaseDivision {
  constructor() {
    super({
      id: 'grants',
      name: 'Grant Writing',
      description: 'Grant research and proposal development services',
      commissionRate: 0.12, // 12% commission on first-year funding
      dataSources: ['Grants.gov', 'Foundation Directory', 'GrantWatch', 'State Grant Portals']
    });
  }

  async findLeads(criteria = {}) {
    const mockLeads = [
      {
        id: 'grant-lead-001',
        name: 'Community Health Foundation',
        type: 'Nonprofit',
        contact: { name: 'Dr. Susan Martinez', email: 'smartinez@commhealth.org', phone: '617-555-0101' },
        ein: '04-1234567',
        mission: 'Providing healthcare access to underserved communities',
        focusAreas: ['Healthcare', 'Public Health', 'Community Development'],
        annualBudget: 2500000,
        trackRecord: 'Strong',
        grantHistory: ['NIH', 'CDC', 'Local foundations'],
        location: 'Boston, MA',
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'grant-lead-002',
        name: 'Innovation Research Institute',
        type: 'Research Institution',
        contact: { name: 'Dr. Michael Chang', email: 'mchang@innovate-ri.edu', phone: '650-555-0202' },
        ein: '94-7654321',
        mission: 'Advancing technological innovation through research',
        focusAreas: ['Technology', 'AI/ML', 'Clean Energy'],
        annualBudget: 15000000,
        trackRecord: 'Excellent',
        grantHistory: ['NSF', 'DOE', 'DARPA'],
        location: 'Palo Alto, CA',
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'grant-lead-003',
        name: 'Green Earth Environmental Alliance',
        type: 'Nonprofit',
        contact: { name: 'Jennifer Woods', email: 'jwoods@greenearth.org', phone: '206-555-0303' },
        ein: '91-2345678',
        mission: 'Environmental conservation and climate action',
        focusAreas: ['Environment', 'Climate Change', 'Conservation'],
        annualBudget: 1800000,
        trackRecord: 'Good',
        grantHistory: ['EPA', 'Private foundations'],
        location: 'Seattle, WA',
        status: 'active',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'grant-lead-004',
        name: 'Urban Education Collaborative',
        type: 'Nonprofit',
        contact: { name: 'Marcus Johnson', email: 'mjohnson@urbanedu.org', phone: '312-555-0404' },
        ein: '36-3456789',
        mission: 'Improving educational outcomes in urban schools',
        focusAreas: ['Education', 'Youth Development', 'STEM'],
        annualBudget: 3200000,
        trackRecord: 'Excellent',
        grantHistory: ['Dept of Education', 'Gates Foundation', 'Local funders'],
        location: 'Chicago, IL',
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'grant-lead-005',
        name: 'BioMed Research Corporation',
        type: 'Small Business',
        contact: { name: 'Dr. Rachel Lee', email: 'rlee@biomed-rc.com', phone: '301-555-0505' },
        ein: '52-4567890',
        mission: 'Developing innovative medical treatments',
        focusAreas: ['Healthcare', 'Biotechnology', 'Medical Devices'],
        annualBudget: 5000000,
        trackRecord: 'Strong',
        grantHistory: ['NIH SBIR', 'NSF'],
        location: 'Bethesda, MD',
        status: 'active',
        createdAt: new Date('2024-01-28')
      },
      {
        id: 'grant-lead-006',
        name: 'Rural Development Network',
        type: 'Nonprofit',
        contact: { name: 'Tom Anderson', email: 'tanderson@ruraldev.org', phone: '515-555-0606' },
        ein: '42-5678901',
        mission: 'Economic development in rural communities',
        focusAreas: ['Economic Development', 'Agriculture', 'Infrastructure'],
        annualBudget: 1200000,
        trackRecord: 'Good',
        grantHistory: ['USDA', 'EDA', 'State grants'],
        location: 'Des Moines, IA',
        status: 'active',
        createdAt: new Date('2024-02-05')
      },
      {
        id: 'grant-lead-007',
        name: 'Arts & Culture Foundation',
        type: 'Nonprofit',
        contact: { name: 'Elena Rodriguez', email: 'erodriguez@artsculture.org', phone: '505-555-0707' },
        ein: '85-6789012',
        mission: 'Promoting arts and cultural heritage',
        focusAreas: ['Arts', 'Culture', 'Heritage Preservation'],
        annualBudget: 950000,
        trackRecord: 'Good',
        grantHistory: ['NEA', 'State arts councils', 'Private donors'],
        location: 'Santa Fe, NM',
        status: 'active',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'grant-lead-008',
        name: 'Advanced Materials Lab',
        type: 'Research Institution',
        contact: { name: 'Dr. David Park', email: 'dpark@advmat.edu', phone: '617-555-0808' },
        ein: '04-7890123',
        mission: 'Materials science research and development',
        focusAreas: ['Materials Science', 'Nanotechnology', 'Manufacturing'],
        annualBudget: 8500000,
        trackRecord: 'Excellent',
        grantHistory: ['NSF', 'DOD', 'Industry partnerships'],
        location: 'Cambridge, MA',
        status: 'active',
        createdAt: new Date('2024-02-08')
      },
      {
        id: 'grant-lead-009',
        name: 'Housing Alliance',
        type: 'Nonprofit',
        contact: { name: 'Lisa Thompson', email: 'lthompson@housingalliance.org', phone: '503-555-0909' },
        ein: '93-8901234',
        mission: 'Affordable housing and homelessness prevention',
        focusAreas: ['Housing', 'Homelessness', 'Community Development'],
        annualBudget: 2800000,
        trackRecord: 'Strong',
        grantHistory: ['HUD', 'State housing authority', 'Foundations'],
        location: 'Portland, OR',
        status: 'active',
        createdAt: new Date('2024-01-25')
      },
      {
        id: 'grant-lead-010',
        name: 'Clean Energy Innovations Inc',
        type: 'Small Business',
        contact: { name: 'Carlos Rivera', email: 'crivera@cleanenergy-inn.com', phone: '720-555-1010' },
        ein: '84-9012345',
        mission: 'Developing renewable energy technologies',
        focusAreas: ['Clean Energy', 'Solar', 'Energy Storage'],
        annualBudget: 3500000,
        trackRecord: 'Good',
        grantHistory: ['DOE SBIR', 'State energy office'],
        location: 'Denver, CO',
        status: 'active',
        createdAt: new Date('2024-02-10')
      }
    ];

    return mockLeads.filter(lead => {
      if (criteria.type && lead.type !== criteria.type) return false;
      if (criteria.focusArea && !lead.focusAreas.includes(criteria.focusArea)) return false;
      if (criteria.minBudget && lead.annualBudget < criteria.minBudget) return false;
      return true;
    });
  }

  async findOpportunities(criteria = {}) {
    const mockOpportunities = [
      {
        id: 'grant-opp-001',
        title: 'Community Health Centers Capital Development',
        funder: 'Health Resources and Services Administration',
        type: 'Federal Grant',
        programNumber: 'HRSA-24-001',
        focusAreas: ['Healthcare', 'Public Health', 'Infrastructure'],
        fundingAmount: 2000000,
        matchRequired: true,
        matchPercentage: 0.25,
        eligibility: ['Nonprofit', 'FQHC'],
        deadline: new Date('2024-04-30'),
        applicationLength: 'Extensive',
        competitiveness: 'High',
        avgAwardSize: 500000,
        description: 'Capital development grants for community health centers',
        restrictions: 'Must serve underserved populations',
        postedDate: new Date('2024-02-01'),
        status: 'open'
      },
      {
        id: 'grant-opp-002',
        title: 'NSF Research Infrastructure',
        funder: 'National Science Foundation',
        type: 'Federal Grant',
        programNumber: 'NSF-24-550',
        focusAreas: ['Technology', 'Research', 'Infrastructure'],
        fundingAmount: 10000000,
        matchRequired: false,
        eligibility: ['Research Institution', 'University'],
        deadline: new Date('2024-06-15'),
        applicationLength: 'Extensive',
        competitiveness: 'Very High',
        avgAwardSize: 2500000,
        description: 'Major research infrastructure development',
        restrictions: 'Must demonstrate research excellence',
        postedDate: new Date('2024-02-05'),
        status: 'open'
      },
      {
        id: 'grant-opp-003',
        title: 'Environmental Justice Initiative',
        funder: 'Environmental Protection Agency',
        type: 'Federal Grant',
        programNumber: 'EPA-24-003',
        focusAreas: ['Environment', 'Community Development', 'Public Health'],
        fundingAmount: 1500000,
        matchRequired: false,
        eligibility: ['Nonprofit', 'Local Government'],
        deadline: new Date('2024-05-01'),
        applicationLength: 'Moderate',
        competitiveness: 'Moderate',
        avgAwardSize: 350000,
        description: 'Environmental justice projects in underserved communities',
        restrictions: 'Must be in designated EJ area',
        postedDate: new Date('2024-01-28'),
        status: 'open'
      },
      {
        id: 'grant-opp-004',
        title: 'STEM Education Enhancement',
        funder: 'Department of Education',
        type: 'Federal Grant',
        programNumber: 'ED-24-125',
        focusAreas: ['Education', 'STEM', 'Youth Development'],
        fundingAmount: 5000000,
        matchRequired: true,
        matchPercentage: 0.10,
        eligibility: ['Nonprofit', 'School District'],
        deadline: new Date('2024-04-15'),
        applicationLength: 'Moderate',
        competitiveness: 'High',
        avgAwardSize: 750000,
        description: 'STEM education programs for K-12 students',
        restrictions: 'Title I schools priority',
        postedDate: new Date('2024-02-10'),
        status: 'open'
      },
      {
        id: 'grant-opp-005',
        title: 'NIH Biomedical Research SBIR',
        funder: 'National Institutes of Health',
        type: 'SBIR/STTR',
        programNumber: 'NIH-24-SBIR-001',
        focusAreas: ['Healthcare', 'Biotechnology', 'Medical Devices'],
        fundingAmount: 1000000,
        matchRequired: false,
        eligibility: ['Small Business'],
        deadline: new Date('2024-04-01'),
        applicationLength: 'Extensive',
        competitiveness: 'Very High',
        avgAwardSize: 300000,
        description: 'Phase II SBIR for biomedical innovations',
        restrictions: 'Must have completed Phase I',
        postedDate: new Date('2024-01-20'),
        status: 'open'
      },
      {
        id: 'grant-opp-006',
        title: 'Rural Business Development',
        funder: 'USDA Rural Development',
        type: 'Federal Grant',
        programNumber: 'USDA-24-008',
        focusAreas: ['Economic Development', 'Agriculture', 'Rural'],
        fundingAmount: 3000000,
        matchRequired: true,
        matchPercentage: 0.20,
        eligibility: ['Nonprofit', 'Local Government', 'Cooperative'],
        deadline: new Date('2024-05-30'),
        applicationLength: 'Moderate',
        competitiveness: 'Moderate',
        avgAwardSize: 500000,
        description: 'Rural business and economic development',
        restrictions: 'Must be in rural area (population < 50,000)',
        postedDate: new Date('2024-02-08'),
        status: 'open'
      },
      {
        id: 'grant-opp-007',
        title: 'Arts & Cultural Heritage',
        funder: 'National Endowment for the Arts',
        type: 'Federal Grant',
        programNumber: 'NEA-24-001',
        focusAreas: ['Arts', 'Culture', 'Heritage Preservation'],
        fundingAmount: 500000,
        matchRequired: true,
        matchPercentage: 0.50,
        eligibility: ['Nonprofit', '501(c)(3)'],
        deadline: new Date('2024-03-15'),
        applicationLength: 'Short',
        competitiveness: 'High',
        avgAwardSize: 50000,
        description: 'Supporting arts organizations and cultural projects',
        restrictions: 'Must have 2+ years operating history',
        postedDate: new Date('2024-01-15'),
        status: 'open'
      },
      {
        id: 'grant-opp-008',
        title: 'Advanced Manufacturing Research',
        funder: 'National Institute of Standards and Technology',
        type: 'Federal Grant',
        programNumber: 'NIST-24-MEP-001',
        focusAreas: ['Manufacturing', 'Technology', 'Materials Science'],
        fundingAmount: 8000000,
        matchRequired: true,
        matchPercentage: 0.50,
        eligibility: ['Research Institution', 'University'],
        deadline: new Date('2024-07-01'),
        applicationLength: 'Extensive',
        competitiveness: 'Very High',
        avgAwardSize: 2000000,
        description: 'Advanced manufacturing technologies research',
        restrictions: 'Industry partnership required',
        postedDate: new Date('2024-02-12'),
        status: 'open'
      },
      {
        id: 'grant-opp-009',
        title: 'Affordable Housing Development',
        funder: 'Department of Housing and Urban Development',
        type: 'Federal Grant',
        programNumber: 'HUD-24-HOME-001',
        focusAreas: ['Housing', 'Community Development', 'Homelessness'],
        fundingAmount: 12000000,
        matchRequired: true,
        matchPercentage: 0.25,
        eligibility: ['Nonprofit', 'Local Government', 'Housing Authority'],
        deadline: new Date('2024-05-15'),
        applicationLength: 'Extensive',
        competitiveness: 'High',
        avgAwardSize: 1500000,
        description: 'Affordable housing construction and rehabilitation',
        restrictions: 'Must serve households at 80% AMI or below',
        postedDate: new Date('2024-02-01'),
        status: 'open'
      },
      {
        id: 'grant-opp-010',
        title: 'Clean Energy Innovation SBIR',
        funder: 'Department of Energy',
        type: 'SBIR/STTR',
        programNumber: 'DOE-24-SBIR-045',
        focusAreas: ['Clean Energy', 'Solar', 'Energy Storage'],
        fundingAmount: 2500000,
        matchRequired: false,
        eligibility: ['Small Business'],
        deadline: new Date('2024-04-30'),
        applicationLength: 'Extensive',
        competitiveness: 'Very High',
        avgAwardSize: 400000,
        description: 'Clean energy technology development',
        restrictions: 'Must demonstrate technical feasibility',
        postedDate: new Date('2024-02-15'),
        status: 'open'
      }
    ];

    return mockOpportunities.filter(opp => {
      if (criteria.focusArea && !opp.focusAreas.includes(criteria.focusArea)) return false;
      if (criteria.minAmount && opp.avgAwardSize < criteria.minAmount) return false;
      if (criteria.type && opp.type !== criteria.type) return false;
      return true;
    });
  }

  async scoreMatch(lead, opportunity) {
    let score = 0;
    const factors = [];

    // Mission/Focus area alignment (35 points)
    const focusMatch = lead.focusAreas.some(area => opportunity.focusAreas.includes(area));
    if (focusMatch) {
      const matchCount = lead.focusAreas.filter(area => opportunity.focusAreas.includes(area)).length;
      const points = Math.min(35, matchCount * 15);
      score += points;
      factors.push({ factor: 'Mission Alignment', points, status: points >= 30 ? 'excellent' : 'good' });
    } else {
      factors.push({ factor: 'Mission Alignment', points: 0, status: 'poor' });
    }

    // Eligibility match (25 points)
    const eligible = opportunity.eligibility.includes(lead.type);
    if (eligible) {
      score += 25;
      factors.push({ factor: 'Eligibility', points: 25, status: 'excellent' });
    } else {
      factors.push({ factor: 'Eligibility', points: 0, status: 'poor' });
    }

    // Track record vs competitiveness (20 points)
    const trackScore = {
      'Excellent': { 'Very High': 20, 'High': 18, 'Moderate': 15 },
      'Strong': { 'Very High': 15, 'High': 18, 'Moderate': 20 },
      'Good': { 'Very High': 10, 'High': 15, 'Moderate': 18 }
    };
    const points = trackScore[lead.trackRecord]?.[opportunity.competitiveness] || 5;
    score += points;
    factors.push({ 
      factor: 'Competitive Positioning', 
      points, 
      status: points >= 18 ? 'excellent' : points >= 15 ? 'good' : 'fair' 
    });

    // Budget capacity for match requirement (10 points)
    if (opportunity.matchRequired) {
      const matchAmount = opportunity.avgAwardSize * opportunity.matchPercentage;
      if (lead.annualBudget >= matchAmount * 10) {
        score += 10;
        factors.push({ factor: 'Match Requirement Capacity', points: 10, status: 'excellent' });
      } else if (lead.annualBudget >= matchAmount * 5) {
        score += 6;
        factors.push({ factor: 'Match Requirement Capacity', points: 6, status: 'good' });
      } else {
        score += 2;
        factors.push({ factor: 'Match Requirement Capacity', points: 2, status: 'fair' });
      }
    } else {
      score += 8;
      factors.push({ factor: 'No Match Required', points: 8, status: 'good' });
    }

    // Grant history alignment (10 points)
    const hasRelevantHistory = lead.grantHistory.some(funder => 
      opportunity.funder.includes(funder) || funder === opportunity.type.split(' ')[0]
    );
    if (hasRelevantHistory) {
      score += 10;
      factors.push({ factor: 'Relevant Grant History', points: 10, status: 'excellent' });
    } else if (lead.grantHistory.length > 0) {
      score += 5;
      factors.push({ factor: 'Grant Experience', points: 5, status: 'good' });
    } else {
      score += 2;
      factors.push({ factor: 'Limited Grant History', points: 2, status: 'fair' });
    }

    return {
      score,
      maxScore: 100,
      percentage: Math.round(score),
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
      factors,
      recommendation: score >= 70 ? 'Highly Recommended - Strong Match' : 
                     score >= 50 ? 'Recommended - Good Fit' : 
                     'Consider Carefully - Challenges Expected',
      estimatedCommission: this.calculateCommission({ value: opportunity.avgAwardSize })
    };
  }
}

export default GrantsDivision;
