/**
 * Government Contracts Division
 * 
 * Connects businesses with government contract opportunities
 * Focus: Federal, state, and local government procurement
 */

import BaseDivision from '../../core/BaseDivision.js';

class GovConDivision extends BaseDivision {
  constructor() {
    super({
      id: 'govcon',
      name: 'Government Contracts',
      description: 'Federal and state government contract brokerage',
      commissionRate: 0.08, // 8% commission
      dataSources: ['SAM.gov', 'Beta.SAM.gov', 'FedBizOpps', 'GSA Schedules']
    });
  }

  async findLeads(criteria = {}) {
    // In production, this would query SAM.gov, USASpending.gov, etc.
    const mockLeads = [
      {
        id: 'gc-lead-001',
        name: 'Advanced Defense Systems Inc',
        type: 'Defense Contractor',
        contact: { name: 'Sarah Mitchell', email: 'smitchell@adsystems.com', phone: '703-555-0101' },
        naicsCodes: ['541512', '541330', '541519'],
        cageCode: 'ABC12',
        capabilities: ['Cybersecurity', 'Cloud Computing', 'AI/ML'],
        pastPerformance: 'Excellent',
        securityClearances: ['Secret', 'Top Secret'],
        revenue: 15000000,
        location: 'Arlington, VA',
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'gc-lead-002',
        name: 'TechFlow Solutions LLC',
        type: 'IT Services',
        contact: { name: 'Michael Chen', email: 'mchen@techflow.com', phone: '301-555-0202' },
        naicsCodes: ['541511', '541512'],
        cageCode: 'DEF34',
        capabilities: ['Software Development', 'System Integration', 'DevSecOps'],
        pastPerformance: 'Satisfactory',
        securityClearances: ['Secret'],
        revenue: 8000000,
        location: 'Bethesda, MD',
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'gc-lead-003',
        name: 'Federal Facilities Management Corp',
        type: 'Facilities Services',
        contact: { name: 'Robert Johnson', email: 'rjohnson@fedfa.com', phone: '202-555-0303' },
        naicsCodes: ['561210', '562910'],
        cageCode: 'GHI56',
        capabilities: ['Janitorial Services', 'Grounds Maintenance', 'HVAC'],
        pastPerformance: 'Excellent',
        securityClearances: [],
        revenue: 5000000,
        location: 'Washington, DC',
        status: 'active',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'gc-lead-004',
        name: 'Quantum Research Associates',
        type: 'R&D Contractor',
        contact: { name: 'Dr. Emily Watson', email: 'ewatson@quantum.com', phone: '617-555-0404' },
        naicsCodes: ['541715', '541714'],
        cageCode: 'JKL78',
        capabilities: ['Materials Research', 'Quantum Computing', 'Advanced Analytics'],
        pastPerformance: 'Exceptional',
        securityClearances: ['Top Secret', 'SCI'],
        revenue: 25000000,
        location: 'Cambridge, MA',
        status: 'active',
        createdAt: new Date('2024-01-10')
      },
      {
        id: 'gc-lead-005',
        name: 'GlobalMed Healthcare Services',
        type: 'Healthcare Provider',
        contact: { name: 'Dr. James Rodriguez', email: 'jrodriguez@globalmed.com', phone: '210-555-0505' },
        naicsCodes: ['621111', '621399'],
        cageCode: 'MNO90',
        capabilities: ['Medical Services', 'Telemedicine', 'Healthcare IT'],
        pastPerformance: 'Excellent',
        securityClearances: [],
        revenue: 12000000,
        location: 'San Antonio, TX',
        status: 'active',
        createdAt: new Date('2024-01-25')
      },
      {
        id: 'gc-lead-006',
        name: 'Infrastructure Engineering Group',
        type: 'Engineering Services',
        contact: { name: 'Amanda Foster', email: 'afoster@infra-eng.com', phone: '404-555-0606' },
        naicsCodes: ['541330', '237310'],
        cageCode: 'PQR12',
        capabilities: ['Civil Engineering', 'Bridge Construction', 'Transportation Planning'],
        pastPerformance: 'Excellent',
        securityClearances: [],
        revenue: 18000000,
        location: 'Atlanta, GA',
        status: 'active',
        createdAt: new Date('2024-02-05')
      },
      {
        id: 'gc-lead-007',
        name: 'SecureNet Communications',
        type: 'Telecommunications',
        contact: { name: 'David Kim', email: 'dkim@securenet.com', phone: '571-555-0707' },
        naicsCodes: ['517311', '541513'],
        cageCode: 'STU34',
        capabilities: ['Secure Communications', '5G Networks', 'Satellite Systems'],
        pastPerformance: 'Satisfactory',
        securityClearances: ['Secret', 'Top Secret'],
        revenue: 22000000,
        location: 'Reston, VA',
        status: 'active',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'gc-lead-008',
        name: 'Environmental Solutions Group',
        type: 'Environmental Services',
        contact: { name: 'Lisa Thompson', email: 'lthompson@env-sol.com', phone: '303-555-0808' },
        naicsCodes: ['562910', '541620'],
        cageCode: 'VWX56',
        capabilities: ['Environmental Remediation', 'Hazmat Services', 'Sustainability Consulting'],
        pastPerformance: 'Excellent',
        securityClearances: [],
        revenue: 9000000,
        location: 'Denver, CO',
        status: 'active',
        createdAt: new Date('2024-02-08')
      },
      {
        id: 'gc-lead-009',
        name: 'DataForge Analytics',
        type: 'Data Analytics',
        contact: { name: 'Chris Martinez', email: 'cmartinez@dataforge.com', phone: '650-555-0909' },
        naicsCodes: ['541512', '541990'],
        cageCode: 'YZA78',
        capabilities: ['Big Data', 'Predictive Analytics', 'Data Visualization'],
        pastPerformance: 'Excellent',
        securityClearances: ['Secret'],
        revenue: 11000000,
        location: 'Palo Alto, CA',
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'gc-lead-010',
        name: 'Logistics Command Solutions',
        type: 'Logistics Services',
        contact: { name: 'Colonel (Ret.) Frank Harrison', email: 'fharrison@logcmd.com', phone: '619-555-1010' },
        naicsCodes: ['488510', '493110'],
        cageCode: 'BCD90',
        capabilities: ['Supply Chain Management', 'Warehousing', 'Distribution'],
        pastPerformance: 'Excellent',
        securityClearances: ['Secret'],
        revenue: 16000000,
        location: 'San Diego, CA',
        status: 'active',
        createdAt: new Date('2024-01-28')
      }
    ];

    return mockLeads.filter(lead => {
      if (criteria.naicsCode && !lead.naicsCodes.includes(criteria.naicsCode)) return false;
      if (criteria.minRevenue && lead.revenue < criteria.minRevenue) return false;
      if (criteria.securityClearance && !lead.securityClearances.includes(criteria.securityClearance)) return false;
      return true;
    });
  }

  async findOpportunities(criteria = {}) {
    // In production, this would query SAM.gov API
    const mockOpportunities = [
      {
        id: 'gc-opp-001',
        title: 'Cybersecurity Operations Support Services',
        agency: 'Department of Defense',
        type: 'RFP',
        solicitationNumber: 'W52P1J-24-R-0001',
        naicsCodes: ['541512'],
        value: 15000000,
        deadline: new Date('2024-04-15'),
        setAside: '8(a)',
        clearanceRequired: 'Secret',
        description: 'Comprehensive cybersecurity operations and incident response support for military networks',
        location: 'Fort Meade, MD',
        contractType: 'IDIQ',
        performancePeriod: '5 years',
        postedDate: new Date('2024-02-01'),
        status: 'open'
      },
      {
        id: 'gc-opp-002',
        title: 'Cloud Migration and DevSecOps Services',
        agency: 'General Services Administration',
        type: 'RFP',
        solicitationNumber: 'GS-00F-001AA',
        naicsCodes: ['541511', '541512'],
        value: 25000000,
        deadline: new Date('2024-05-01'),
        setAside: 'Small Business',
        clearanceRequired: null,
        description: 'Enterprise cloud migration and DevSecOps implementation for federal agencies',
        location: 'Multiple Locations',
        contractType: 'Multiple Award',
        performancePeriod: '3 years',
        postedDate: new Date('2024-02-10'),
        status: 'open'
      },
      {
        id: 'gc-opp-003',
        title: 'Federal Building Facilities Management',
        agency: 'General Services Administration',
        type: 'Solicitation',
        solicitationNumber: 'GS-PBS-24-0045',
        naicsCodes: ['561210'],
        value: 8000000,
        deadline: new Date('2024-03-30'),
        setAside: null,
        clearanceRequired: null,
        description: 'Comprehensive facilities management for federal buildings in the NCR',
        location: 'Washington, DC',
        contractType: 'Fixed Price',
        performancePeriod: '3 years',
        postedDate: new Date('2024-01-20'),
        status: 'open'
      },
      {
        id: 'gc-opp-004',
        title: 'Quantum Computing Research Initiative',
        agency: 'National Science Foundation',
        type: 'Grant/Cooperative Agreement',
        solicitationNumber: 'NSF-24-550',
        naicsCodes: ['541715'],
        value: 50000000,
        deadline: new Date('2024-06-15'),
        setAside: null,
        clearanceRequired: 'Top Secret',
        description: 'Advanced quantum computing research and development program',
        location: 'Various University Partners',
        contractType: 'Cooperative Agreement',
        performancePeriod: '5 years',
        postedDate: new Date('2024-02-05'),
        status: 'open'
      },
      {
        id: 'gc-opp-005',
        title: 'Veterans Healthcare Services',
        agency: 'Department of Veterans Affairs',
        type: 'RFP',
        solicitationNumber: 'VA-24-00N-0012',
        naicsCodes: ['621111', '621399'],
        value: 30000000,
        deadline: new Date('2024-04-20'),
        setAside: 'SDVOSB',
        clearanceRequired: null,
        description: 'Comprehensive healthcare services for veterans including primary care and mental health',
        location: 'Multiple VA Facilities',
        contractType: 'IDIQ',
        performancePeriod: '5 years',
        postedDate: new Date('2024-02-12'),
        status: 'open'
      },
      {
        id: 'gc-opp-006',
        title: 'Highway Infrastructure Improvement Project',
        agency: 'Department of Transportation',
        type: 'RFP',
        solicitationNumber: 'FHWA-24-0089',
        naicsCodes: ['237310', '541330'],
        value: 120000000,
        deadline: new Date('2024-05-30'),
        setAside: null,
        clearanceRequired: null,
        description: 'Design and construction of interstate highway improvements',
        location: 'Atlanta, GA Metro Area',
        contractType: 'Design-Build',
        performancePeriod: '4 years',
        postedDate: new Date('2024-02-08'),
        status: 'open'
      },
      {
        id: 'gc-opp-007',
        title: 'Next-Generation Secure Communications Network',
        agency: 'Department of Homeland Security',
        type: 'RFP',
        solicitationNumber: 'HSHQDC-24-R-0004',
        naicsCodes: ['517311', '541513'],
        value: 45000000,
        deadline: new Date('2024-04-30'),
        setAside: null,
        clearanceRequired: 'Top Secret',
        description: 'Design, implementation, and maintenance of secure communications infrastructure',
        location: 'Washington, DC',
        contractType: 'Cost Plus Fixed Fee',
        performancePeriod: '5 years',
        postedDate: new Date('2024-02-15'),
        status: 'open'
      },
      {
        id: 'gc-opp-008',
        title: 'Military Base Environmental Remediation',
        agency: 'Department of Defense',
        type: 'RFP',
        solicitationNumber: 'W912DQ-24-R-0023',
        naicsCodes: ['562910', '541620'],
        value: 18000000,
        deadline: new Date('2024-04-10'),
        setAside: 'Small Business',
        clearanceRequired: null,
        description: 'Environmental cleanup and remediation services for former military installations',
        location: 'Multiple Sites Nationwide',
        contractType: 'Firm Fixed Price',
        performancePeriod: '3 years',
        postedDate: new Date('2024-02-01'),
        status: 'open'
      },
      {
        id: 'gc-opp-009',
        title: 'Intelligence Community Data Analytics Platform',
        agency: 'Intelligence Advanced Research Projects Activity',
        type: 'RFP',
        solicitationNumber: 'IARPA-24-001',
        naicsCodes: ['541512', '541990'],
        value: 35000000,
        deadline: new Date('2024-05-15'),
        setAside: null,
        clearanceRequired: 'Top Secret/SCI',
        description: 'Advanced data analytics and AI/ML platform for intelligence analysis',
        location: 'Washington, DC Metro',
        contractType: 'Cost Plus Award Fee',
        performancePeriod: '4 years',
        postedDate: new Date('2024-02-18'),
        status: 'open'
      },
      {
        id: 'gc-opp-010',
        title: 'Global Military Logistics Support',
        agency: 'Defense Logistics Agency',
        type: 'RFP',
        solicitationNumber: 'SPE300-24-R-0001',
        naicsCodes: ['488510', '493110'],
        value: 75000000,
        deadline: new Date('2024-06-01'),
        setAside: null,
        clearanceRequired: 'Secret',
        description: 'Worldwide logistics support for military operations',
        location: 'Fort Belvoir, VA',
        contractType: 'IDIQ',
        performancePeriod: '5 years',
        postedDate: new Date('2024-02-20'),
        status: 'open'
      }
    ];

    return mockOpportunities.filter(opp => {
      if (criteria.naicsCode && !opp.naicsCodes.includes(criteria.naicsCode)) return false;
      if (criteria.minValue && opp.value < criteria.minValue) return false;
      if (criteria.agency && opp.agency !== criteria.agency) return false;
      if (criteria.setAside && opp.setAside !== criteria.setAside) return false;
      return true;
    });
  }

  async scoreMatch(lead, opportunity) {
    let score = 0;
    const factors = [];

    // NAICS code match (30 points)
    const naicsMatch = lead.naicsCodes.some(code => opportunity.naicsCodes.includes(code));
    if (naicsMatch) {
      score += 30;
      factors.push({ factor: 'NAICS Code Match', points: 30, status: 'excellent' });
    } else {
      factors.push({ factor: 'NAICS Code Match', points: 0, status: 'poor' });
    }

    // Security clearance (25 points)
    if (opportunity.clearanceRequired) {
      if (lead.securityClearances.includes(opportunity.clearanceRequired)) {
        score += 25;
        factors.push({ factor: 'Security Clearance', points: 25, status: 'excellent' });
      } else {
        factors.push({ factor: 'Security Clearance', points: 0, status: 'poor' });
      }
    } else {
      score += 15;
      factors.push({ factor: 'No Clearance Required', points: 15, status: 'good' });
    }

    // Past performance (20 points)
    const perfScore = {
      'Exceptional': 20,
      'Excellent': 18,
      'Satisfactory': 12,
      'Marginal': 5
    }[lead.pastPerformance] || 0;
    score += perfScore;
    factors.push({ 
      factor: 'Past Performance', 
      points: perfScore, 
      status: perfScore >= 18 ? 'excellent' : perfScore >= 12 ? 'good' : 'fair' 
    });

    // Contract size match (15 points)
    const revenueRatio = lead.revenue / opportunity.value;
    if (revenueRatio >= 0.5 && revenueRatio <= 3) {
      score += 15;
      factors.push({ factor: 'Contract Size Match', points: 15, status: 'excellent' });
    } else if (revenueRatio >= 0.2 && revenueRatio <= 5) {
      score += 10;
      factors.push({ factor: 'Contract Size Match', points: 10, status: 'good' });
    } else {
      score += 3;
      factors.push({ factor: 'Contract Size Match', points: 3, status: 'fair' });
    }

    // Geographic proximity (10 points)
    if (lead.location.includes(opportunity.location.split(',')[0])) {
      score += 10;
      factors.push({ factor: 'Geographic Match', points: 10, status: 'excellent' });
    } else {
      score += 5;
      factors.push({ factor: 'Geographic Match', points: 5, status: 'fair' });
    }

    return {
      score,
      maxScore: 100,
      percentage: Math.round(score),
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
      factors,
      recommendation: score >= 70 ? 'Highly Recommended' : score >= 50 ? 'Recommended' : 'Consider with Caution',
      estimatedCommission: this.calculateCommission({ value: opportunity.value })
    };
  }
}

export default GovConDivision;
