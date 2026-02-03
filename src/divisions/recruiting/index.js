/**
 * Executive Search & Recruiting Division
 * 
 * Connects companies with C-level and executive talent
 * Focus: Executive search, leadership placement
 */

import BaseDivision from '../../core/BaseDivision.js';

class RecruitingDivision extends BaseDivision {
  constructor() {
    super({
      id: 'recruiting',
      name: 'Executive Search',
      description: 'C-level and executive recruitment services',
      commissionRate: 0.20, // 20% of first-year compensation
      dataSources: ['LinkedIn Recruiter', 'Executive Networks', 'Industry Associations']
    });
  }

  async findLeads(criteria = {}) {
    const mockLeads = [
      {
        id: 'rec-lead-001',
        name: 'TechVision Corp',
        type: 'Technology',
        contact: { name: 'Sarah Chen', email: 'schen@techvision.com', phone: '415-555-0101' },
        openPosition: 'Chief Technology Officer',
        urgency: 'High',
        targetCompensation: { base: 350000, bonus: 150000, equity: 500000 },
        requirements: {
          experience: '15+ years',
          education: 'MS/PhD in Computer Science preferred',
          skills: ['Cloud Architecture', 'AI/ML', 'Team Building'],
          industry: 'SaaS'
        },
        location: 'San Francisco, CA',
        remote: 'Hybrid',
        companySize: 500,
        companyStage: 'Series C',
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'rec-lead-002',
        name: 'National Retail Group',
        type: 'Retail',
        contact: { name: 'Michael Thompson', email: 'mthompson@nationalretail.com', phone: '612-555-0202' },
        openPosition: 'Chief Operating Officer',
        urgency: 'Medium',
        targetCompensation: { base: 400000, bonus: 200000, equity: 300000 },
        requirements: {
          experience: '20+ years in retail operations',
          education: 'MBA required',
          skills: ['Supply Chain', 'P&L Management', 'Digital Transformation'],
          industry: 'Retail'
        },
        location: 'Minneapolis, MN',
        remote: 'On-site',
        companySize: 15000,
        companyStage: 'Public',
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'rec-lead-003',
        name: 'BioMed Therapeutics',
        type: 'Healthcare',
        contact: { name: 'Dr. Jennifer Walsh', email: 'jwalsh@biomed.com', phone: '617-555-0303' },
        openPosition: 'Chief Medical Officer',
        urgency: 'High',
        targetCompensation: { base: 450000, bonus: 200000, equity: 800000 },
        requirements: {
          experience: '15+ years clinical experience',
          education: 'MD required, PhD preferred',
          skills: ['Clinical Trials', 'Regulatory Affairs', 'FDA Approval Process'],
          industry: 'Biotechnology'
        },
        location: 'Boston, MA',
        remote: 'Hybrid',
        companySize: 250,
        companyStage: 'Series B',
        status: 'active',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'rec-lead-004',
        name: 'Global Finance Partners',
        type: 'Financial Services',
        contact: { name: 'Robert Martinez', email: 'rmartinez@globalfp.com', phone: '212-555-0404' },
        openPosition: 'Chief Financial Officer',
        urgency: 'High',
        targetCompensation: { base: 500000, bonus: 300000, equity: 400000 },
        requirements: {
          experience: '20+ years in financial services',
          education: 'MBA, CPA required',
          skills: ['IPO Experience', 'M&A', 'Strategic Planning'],
          industry: 'Financial Services'
        },
        location: 'New York, NY',
        remote: 'Hybrid',
        companySize: 2000,
        companyStage: 'Pre-IPO',
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'rec-lead-005',
        name: 'CleanEnergy Innovations',
        type: 'Energy',
        contact: { name: 'Amanda Foster', email: 'afoster@cleanenergy.com', phone: '720-555-0505' },
        openPosition: 'Chief Executive Officer',
        urgency: 'Medium',
        targetCompensation: { base: 600000, bonus: 400000, equity: 2000000 },
        requirements: {
          experience: '20+ years with C-suite experience',
          education: 'MBA or advanced degree',
          skills: ['Scale-up Experience', 'Fundraising', 'Government Relations'],
          industry: 'Clean Energy'
        },
        location: 'Denver, CO',
        remote: 'On-site',
        companySize: 180,
        companyStage: 'Series C',
        status: 'active',
        createdAt: new Date('2024-01-28')
      },
      {
        id: 'rec-lead-006',
        name: 'Digital Marketing Solutions',
        type: 'Marketing/Advertising',
        contact: { name: 'Lisa Anderson', email: 'landerson@digitalmkt.com', phone: '310-555-0606' },
        openPosition: 'Chief Marketing Officer',
        urgency: 'Medium',
        targetCompensation: { base: 320000, bonus: 130000, equity: 250000 },
        requirements: {
          experience: '15+ years in digital marketing',
          education: 'Bachelor required, MBA preferred',
          skills: ['Brand Building', 'Growth Marketing', 'Marketing Analytics'],
          industry: 'Marketing'
        },
        location: 'Los Angeles, CA',
        remote: 'Hybrid',
        companySize: 400,
        companyStage: 'Series B',
        status: 'active',
        createdAt: new Date('2024-02-05')
      },
      {
        id: 'rec-lead-007',
        name: 'Manufacturing Excellence Inc',
        type: 'Manufacturing',
        contact: { name: 'David Kim', email: 'dkim@mfgexcel.com', phone: '313-555-0707' },
        openPosition: 'Chief Supply Chain Officer',
        urgency: 'High',
        targetCompensation: { base: 380000, bonus: 180000, equity: 200000 },
        requirements: {
          experience: '20+ years in manufacturing',
          education: 'Bachelor in Engineering, MBA preferred',
          skills: ['Lean Manufacturing', 'Global Supply Chain', 'Six Sigma'],
          industry: 'Manufacturing'
        },
        location: 'Detroit, MI',
        remote: 'On-site',
        companySize: 5000,
        companyStage: 'Private Equity Backed',
        status: 'active',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'rec-lead-008',
        name: 'CyberSecure Systems',
        type: 'Cybersecurity',
        contact: { name: 'Jennifer Rodriguez', email: 'jrodriguez@cybersecure.com', phone: '703-555-0808' },
        openPosition: 'Chief Information Security Officer',
        urgency: 'High',
        targetCompensation: { base: 400000, bonus: 180000, equity: 600000 },
        requirements: {
          experience: '15+ years in cybersecurity',
          education: 'Bachelor in CS, Security certifications required',
          skills: ['CISO Experience', 'Compliance', 'Incident Response'],
          industry: 'Cybersecurity'
        },
        location: 'Arlington, VA',
        remote: 'Hybrid',
        companySize: 350,
        companyStage: 'Series C',
        status: 'active',
        createdAt: new Date('2024-02-08')
      },
      {
        id: 'rec-lead-009',
        name: 'FinTech Ventures',
        type: 'FinTech',
        contact: { name: 'Christopher Lee', email: 'clee@fintechventures.com', phone: '512-555-0909' },
        openPosition: 'Chief Product Officer',
        urgency: 'Medium',
        targetCompensation: { base: 350000, bonus: 150000, equity: 700000 },
        requirements: {
          experience: '12+ years in product management',
          education: 'Bachelor required, technical background preferred',
          skills: ['Product Strategy', 'FinTech', 'User Experience'],
          industry: 'Financial Technology'
        },
        location: 'Austin, TX',
        remote: 'Hybrid',
        companySize: 220,
        companyStage: 'Series B',
        status: 'active',
        createdAt: new Date('2024-01-25')
      },
      {
        id: 'rec-lead-010',
        name: 'HealthTech Innovations',
        type: 'Healthcare Technology',
        contact: { name: 'Dr. Maria Gonzalez', email: 'mgonzalez@healthtech.com', phone: '858-555-1010' },
        openPosition: 'Chief Commercial Officer',
        urgency: 'High',
        targetCompensation: { base: 420000, bonus: 250000, equity: 500000 },
        requirements: {
          experience: '15+ years in healthcare sales',
          education: 'Bachelor required, MBA preferred',
          skills: ['Enterprise Sales', 'Healthcare Systems', 'Revenue Growth'],
          industry: 'HealthTech'
        },
        location: 'San Diego, CA',
        remote: 'Hybrid',
        companySize: 300,
        companyStage: 'Series C',
        status: 'active',
        createdAt: new Date('2024-02-10')
      }
    ];

    return mockLeads.filter(lead => {
      if (criteria.position && !lead.openPosition.includes(criteria.position)) return false;
      if (criteria.industry && lead.type !== criteria.industry) return false;
      if (criteria.minComp && lead.targetCompensation.base < criteria.minComp) return false;
      return true;
    });
  }

  async findOpportunities(criteria = {}) {
    const mockOpportunities = [
      {
        id: 'rec-opp-001',
        name: 'Sarah Mitchell',
        currentTitle: 'SVP of Engineering',
        targetRoles: ['Chief Technology Officer', 'VP of Engineering'],
        yearsExperience: 18,
        education: 'PhD Computer Science - Stanford',
        currentCompany: 'Major Tech Corp',
        industry: 'Technology',
        expertise: ['Cloud Architecture', 'AI/ML', 'Platform Engineering', 'Team Building'],
        achievements: [
          'Led cloud migration for 500+ person org',
          'Built AI/ML platform serving 10M users',
          'Scaled engineering team from 50 to 300'
        ],
        compensationExpectations: { base: 400000, bonus: 200000, equity: 1000000 },
        location: 'San Francisco, CA',
        remotePreference: 'Hybrid or Remote',
        availability: 'Available',
        status: 'passive',
        listedDate: new Date('2024-02-01')
      },
      {
        id: 'rec-opp-002',
        name: 'Michael Thompson',
        currentTitle: 'COO',
        targetRoles: ['Chief Operating Officer', 'President'],
        yearsExperience: 25,
        education: 'MBA - Harvard Business School',
        currentCompany: 'Regional Retail Chain',
        industry: 'Retail',
        expertise: ['Retail Operations', 'Supply Chain', 'P&L Management', 'Multi-site Operations'],
        achievements: [
          'Turned around $2B retail operation',
          'Reduced costs by 22% while improving service',
          'Led digital transformation initiative'
        ],
        compensationExpectations: { base: 450000, bonus: 250000, equity: 500000 },
        location: 'Chicago, IL',
        remotePreference: 'Flexible',
        availability: 'Considering',
        status: 'passive',
        listedDate: new Date('2024-01-28')
      },
      {
        id: 'rec-opp-003',
        name: 'Dr. Jennifer Walsh',
        currentTitle: 'Chief Medical Officer',
        targetRoles: ['Chief Medical Officer', 'VP Clinical Development'],
        yearsExperience: 20,
        education: 'MD/PhD - Johns Hopkins',
        currentCompany: 'Mid-size Biotech',
        industry: 'Biotechnology',
        expertise: ['Clinical Trials', 'Regulatory Affairs', 'FDA Submissions', 'Oncology'],
        achievements: [
          'Led 3 successful FDA approvals',
          'Published 50+ peer-reviewed papers',
          'Built clinical operations from ground up'
        ],
        compensationExpectations: { base: 500000, bonus: 250000, equity: 1000000 },
        location: 'Boston, MA',
        remotePreference: 'Hybrid',
        availability: 'Open',
        status: 'active',
        listedDate: new Date('2024-02-05')
      },
      {
        id: 'rec-opp-004',
        name: 'Robert Chen',
        currentTitle: 'CFO',
        targetRoles: ['Chief Financial Officer'],
        yearsExperience: 22,
        education: 'MBA - Wharton, CPA',
        currentCompany: 'Financial Services Firm',
        industry: 'Financial Services',
        expertise: ['IPO Leadership', 'M&A', 'Strategic Planning', 'Investor Relations'],
        achievements: [
          'Led successful IPO ($1.5B valuation)',
          'Negotiated 5 strategic acquisitions',
          'Restructured debt saving $50M annually'
        ],
        compensationExpectations: { base: 550000, bonus: 350000, equity: 800000 },
        location: 'New York, NY',
        remotePreference: 'On-site or Hybrid',
        availability: 'Considering',
        status: 'passive',
        listedDate: new Date('2024-01-20')
      },
      {
        id: 'rec-opp-005',
        name: 'Amanda Foster',
        currentTitle: 'CEO',
        targetRoles: ['Chief Executive Officer', 'President'],
        yearsExperience: 24,
        education: 'MBA - Stanford GSB',
        currentCompany: 'Clean Energy Startup',
        industry: 'Clean Energy',
        expertise: ['Scale-up Leadership', 'Fundraising', 'Government Relations', 'Strategic Growth'],
        achievements: [
          'Grew company from $5M to $200M revenue',
          'Raised $350M in funding',
          'Secured major government contracts'
        ],
        compensationExpectations: { base: 650000, bonus: 450000, equity: 2500000 },
        location: 'San Francisco, CA',
        remotePreference: 'Flexible',
        availability: 'Open to right opportunity',
        status: 'passive',
        listedDate: new Date('2024-02-08')
      },
      {
        id: 'rec-opp-006',
        name: 'Lisa Anderson',
        currentTitle: 'CMO',
        targetRoles: ['Chief Marketing Officer', 'VP Marketing'],
        yearsExperience: 17,
        education: 'MBA - Northwestern Kellogg',
        currentCompany: 'Digital Media Company',
        industry: 'Marketing',
        expertise: ['Brand Building', 'Growth Marketing', 'Performance Marketing', 'Marketing Analytics'],
        achievements: [
          'Grew brand awareness by 300%',
          'Reduced CAC by 45% while scaling',
          'Built marketing team of 75 people'
        ],
        compensationExpectations: { base: 350000, bonus: 150000, equity: 400000 },
        location: 'Los Angeles, CA',
        remotePreference: 'Hybrid',
        availability: 'Available',
        status: 'active',
        listedDate: new Date('2024-02-10')
      },
      {
        id: 'rec-opp-007',
        name: 'David Park',
        currentTitle: 'SVP Supply Chain',
        targetRoles: ['Chief Supply Chain Officer', 'COO'],
        yearsExperience: 23,
        education: 'MS Industrial Engineering, MBA',
        currentCompany: 'Global Manufacturer',
        industry: 'Manufacturing',
        expertise: ['Global Supply Chain', 'Lean Manufacturing', 'Six Sigma', 'Procurement'],
        achievements: [
          'Reduced supply chain costs by $180M',
          'Implemented lean across 15 facilities',
          'Managed $2B procurement budget'
        ],
        compensationExpectations: { base: 400000, bonus: 200000, equity: 300000 },
        location: 'Detroit, MI',
        remotePreference: 'On-site',
        availability: 'Considering',
        status: 'passive',
        listedDate: new Date('2024-01-25')
      },
      {
        id: 'rec-opp-008',
        name: 'Jennifer Martinez',
        currentTitle: 'CISO',
        targetRoles: ['Chief Information Security Officer', 'VP Security'],
        yearsExperience: 16,
        education: 'MS Cybersecurity, CISSP, CISM',
        currentCompany: 'Fortune 500 Tech Company',
        industry: 'Cybersecurity',
        expertise: ['Enterprise Security', 'Compliance', 'Incident Response', 'Zero Trust'],
        achievements: [
          'Built security program for 10,000+ employees',
          'Achieved SOC2, ISO 27001 certifications',
          'Reduced security incidents by 75%'
        ],
        compensationExpectations: { base: 420000, bonus: 200000, equity: 700000 },
        location: 'Washington, DC',
        remotePreference: 'Hybrid',
        availability: 'Open',
        status: 'active',
        listedDate: new Date('2024-02-12')
      },
      {
        id: 'rec-opp-009',
        name: 'Christopher Lee',
        currentTitle: 'VP Product',
        targetRoles: ['Chief Product Officer', 'VP Product'],
        yearsExperience: 14,
        education: 'MS Computer Science, MBA',
        currentCompany: 'FinTech Unicorn',
        industry: 'FinTech',
        expertise: ['Product Strategy', 'FinTech', 'Payments', 'User Experience'],
        achievements: [
          'Launched 15+ successful products',
          'Grew MAU from 1M to 20M',
          'Built product org of 120 people'
        ],
        compensationExpectations: { base: 380000, bonus: 170000, equity: 900000 },
        location: 'Austin, TX',
        remotePreference: 'Remote or Hybrid',
        availability: 'Available',
        status: 'active',
        listedDate: new Date('2024-01-18')
      },
      {
        id: 'rec-opp-010',
        name: 'Dr. Maria Rodriguez',
        currentTitle: 'Chief Commercial Officer',
        targetRoles: ['Chief Commercial Officer', 'Chief Revenue Officer'],
        yearsExperience: 19,
        education: 'MBA - UCLA Anderson',
        currentCompany: 'Healthcare Technology Company',
        industry: 'HealthTech',
        expertise: ['Enterprise Sales', 'Healthcare Systems', 'Revenue Operations', 'Channel Development'],
        achievements: [
          'Grew revenue from $50M to $400M',
          'Built sales team of 200+',
          'Established partnerships with top 20 health systems'
        ],
        compensationExpectations: { base: 450000, bonus: 300000, equity: 800000 },
        location: 'San Diego, CA',
        remotePreference: 'Hybrid',
        availability: 'Considering',
        status: 'passive',
        listedDate: new Date('2024-02-15')
      }
    ];

    return mockOpportunities.filter(opp => {
      if (criteria.role && !opp.targetRoles.includes(criteria.role)) return false;
      if (criteria.industry && opp.industry !== criteria.industry) return false;
      if (criteria.minExperience && opp.yearsExperience < criteria.minExperience) return false;
      return true;
    });
  }

  async scoreMatch(lead, opportunity) {
    let score = 0;
    const factors = [];

    // Role match (30 points)
    const roleMatch = opportunity.targetRoles.includes(lead.openPosition);
    if (roleMatch) {
      score += 30;
      factors.push({ factor: 'Role Match', points: 30, status: 'excellent' });
    } else {
      factors.push({ factor: 'Role Match', points: 0, status: 'poor' });
    }

    // Industry experience (25 points)
    const industryMatch = opportunity.industry === lead.type;
    if (industryMatch) {
      score += 25;
      factors.push({ factor: 'Industry Experience', points: 25, status: 'excellent' });
    } else {
      const relatedIndustries = {
        'Technology': ['Cybersecurity', 'FinTech', 'HealthTech'],
        'Healthcare': ['Biotechnology', 'HealthTech'],
        'Financial Services': ['FinTech']
      };
      const isRelated = relatedIndustries[lead.type]?.includes(opportunity.industry) ||
                       relatedIndustries[opportunity.industry]?.includes(lead.type);
      if (isRelated) {
        score += 15;
        factors.push({ factor: 'Related Industry', points: 15, status: 'good' });
      } else {
        score += 5;
        factors.push({ factor: 'Different Industry', points: 5, status: 'fair' });
      }
    }

    // Skills & expertise match (20 points)
    const requiredSkills = lead.requirements.skills;
    const matchingSkills = requiredSkills.filter(skill => 
      opportunity.expertise.some(exp => exp.includes(skill) || skill.includes(exp))
    );
    const skillMatchPct = matchingSkills.length / requiredSkills.length;
    const skillPoints = Math.round(20 * skillMatchPct);
    score += skillPoints;
    factors.push({ 
      factor: 'Skills Match', 
      points: skillPoints, 
      status: skillPoints >= 16 ? 'excellent' : skillPoints >= 12 ? 'good' : 'fair' 
    });

    // Compensation alignment (15 points)
    const totalLead = lead.targetCompensation.base + lead.targetCompensation.bonus;
    const totalCandidate = opportunity.compensationExpectations.base + opportunity.compensationExpectations.bonus;
    const compDiff = Math.abs(totalLead - totalCandidate) / totalLead;
    
    if (compDiff <= 0.10) {
      score += 15;
      factors.push({ factor: 'Compensation Alignment', points: 15, status: 'excellent' });
    } else if (compDiff <= 0.20) {
      score += 12;
      factors.push({ factor: 'Compensation Alignment', points: 12, status: 'good' });
    } else if (compDiff <= 0.30) {
      score += 8;
      factors.push({ factor: 'Compensation Alignment', points: 8, status: 'fair' });
    } else {
      score += 3;
      factors.push({ factor: 'Compensation Gap', points: 3, status: 'poor' });
    }

    // Location & remote preferences (10 points)
    const locationMatch = opportunity.location.includes(lead.location.split(',')[0]) ||
                         opportunity.remotePreference.includes('Remote') ||
                         lead.remote === 'Hybrid';
    if (locationMatch) {
      score += 10;
      factors.push({ factor: 'Location/Remote Fit', points: 10, status: 'excellent' });
    } else {
      score += 4;
      factors.push({ factor: 'Location Mismatch', points: 4, status: 'fair' });
    }

    return {
      score,
      maxScore: 100,
      percentage: Math.round(score),
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
      factors,
      recommendation: score >= 75 ? 'Highly Recommended - Present to Client' : 
                     score >= 55 ? 'Good Match - Worth Exploring' : 
                     'Poor Fit - Consider Alternatives',
      estimatedCommission: this.calculateCommission({ 
        value: lead.targetCompensation.base + lead.targetCompensation.bonus 
      }),
      candidateStatus: opportunity.status
    };
  }
}

export default RecruitingDivision;
