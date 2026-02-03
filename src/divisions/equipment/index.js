/**
 * Equipment Leasing Division
 * 
 * Connects businesses needing equipment with leasing providers
 * Focus: Heavy equipment, machinery, vehicles, and technology
 */

import BaseDivision from '../../core/BaseDivision.js';

class EquipmentDivision extends BaseDivision {
  constructor() {
    super({
      id: 'equipment',
      name: 'Equipment Leasing',
      description: 'Commercial equipment leasing brokerage',
      commissionRate: 0.06, // 6% of first year lease payments
      dataSources: ['Equipment Leasing Association', 'Direct Lender Relationships', 'Manufacturer Programs']
    });
  }

  async findLeads(criteria = {}) {
    const mockLeads = [
      {
        id: 'eq-lead-001',
        name: 'Summit Construction LLC',
        type: 'Construction',
        contact: { name: 'Tom Bradley', email: 'tbradley@summitconst.com', phone: '303-555-0101' },
        equipmentNeeds: ['Excavator', 'Bulldozer', 'Crane'],
        estimatedValue: 750000,
        yearsInBusiness: 12,
        creditScore: 720,
        revenue: 8500000,
        urgency: 'High',
        preferredTerms: 48,
        location: 'Denver, CO',
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'eq-lead-002',
        name: 'Advanced Manufacturing Corp',
        type: 'Manufacturing',
        contact: { name: 'Lisa Wong', email: 'lwong@advmfg.com', phone: '414-555-0202' },
        equipmentNeeds: ['CNC Machine', 'Industrial Robot', '3D Printer'],
        estimatedValue: 1200000,
        yearsInBusiness: 18,
        creditScore: 750,
        revenue: 25000000,
        urgency: 'Medium',
        preferredTerms: 60,
        location: 'Milwaukee, WI',
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'eq-lead-003',
        name: 'Metro Medical Group',
        type: 'Healthcare',
        contact: { name: 'Dr. James Patterson', email: 'jpatterson@metromedical.com', phone: '713-555-0303' },
        equipmentNeeds: ['MRI Machine', 'CT Scanner', 'X-Ray System'],
        estimatedValue: 2500000,
        yearsInBusiness: 8,
        creditScore: 740,
        revenue: 15000000,
        urgency: 'High',
        preferredTerms: 84,
        location: 'Houston, TX',
        status: 'active',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'eq-lead-004',
        name: 'Fresh Valley Farms',
        type: 'Agriculture',
        contact: { name: 'Robert Henderson', email: 'rhenderson@freshvalley.com', phone: '515-555-0404' },
        equipmentNeeds: ['Combine Harvester', 'Tractor', 'Irrigation System'],
        estimatedValue: 650000,
        yearsInBusiness: 25,
        creditScore: 710,
        revenue: 4500000,
        urgency: 'Medium',
        preferredTerms: 72,
        location: 'Des Moines, IA',
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'eq-lead-005',
        name: 'Rapid Logistics Inc',
        type: 'Transportation',
        contact: { name: 'Maria Garcia', email: 'mgarcia@rapidlogistics.com', phone: '404-555-0505' },
        equipmentNeeds: ['Semi Truck', 'Refrigerated Trailer'],
        estimatedValue: 280000,
        yearsInBusiness: 6,
        creditScore: 690,
        revenue: 3200000,
        urgency: 'High',
        preferredTerms: 60,
        location: 'Atlanta, GA',
        status: 'active',
        createdAt: new Date('2024-01-28')
      },
      {
        id: 'eq-lead-006',
        name: 'TechStart Solutions',
        type: 'Technology',
        contact: { name: 'David Park', email: 'dpark@techstart.com', phone: '512-555-0606' },
        equipmentNeeds: ['Server Equipment', 'Network Infrastructure', 'Workstations'],
        estimatedValue: 450000,
        yearsInBusiness: 4,
        creditScore: 700,
        revenue: 6800000,
        urgency: 'Medium',
        preferredTerms: 36,
        location: 'Austin, TX',
        status: 'active',
        createdAt: new Date('2024-02-05')
      },
      {
        id: 'eq-lead-007',
        name: 'Coastal Seafood Processing',
        type: 'Food Processing',
        contact: { name: 'Sarah Mitchell', email: 'smitchell@coastalseafood.com', phone: '206-555-0707' },
        equipmentNeeds: ['Industrial Freezer', 'Processing Line', 'Packaging Equipment'],
        estimatedValue: 850000,
        yearsInBusiness: 15,
        creditScore: 730,
        revenue: 12000000,
        urgency: 'Medium',
        preferredTerms: 60,
        location: 'Seattle, WA',
        status: 'active',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'eq-lead-008',
        name: 'PrintPro Graphics',
        type: 'Printing',
        contact: { name: 'Carlos Rivera', email: 'crivera@printpro.com', phone: '305-555-0808' },
        equipmentNeeds: ['Digital Press', 'Large Format Printer', 'Bindery Equipment'],
        estimatedValue: 380000,
        yearsInBusiness: 10,
        creditScore: 715,
        revenue: 4800000,
        urgency: 'Low',
        preferredTerms: 48,
        location: 'Miami, FL',
        status: 'active',
        createdAt: new Date('2024-02-08')
      },
      {
        id: 'eq-lead-009',
        name: 'Elite Fitness Centers',
        type: 'Fitness',
        contact: { name: 'Amanda Foster', email: 'afoster@elitefitness.com', phone: '480-555-0909' },
        equipmentNeeds: ['Cardio Equipment', 'Strength Training', 'Group Fitness Gear'],
        estimatedValue: 320000,
        yearsInBusiness: 7,
        creditScore: 705,
        revenue: 2800000,
        urgency: 'Medium',
        preferredTerms: 60,
        location: 'Phoenix, AZ',
        status: 'active',
        createdAt: new Date('2024-01-25')
      },
      {
        id: 'eq-lead-010',
        name: 'GreenScape Landscaping',
        type: 'Landscaping',
        contact: { name: 'Michael Torres', email: 'mtorres@greenscape.com', phone: '919-555-1010' },
        equipmentNeeds: ['Skid Steer', 'Dump Truck', 'Commercial Mowers'],
        estimatedValue: 195000,
        yearsInBusiness: 9,
        creditScore: 695,
        revenue: 2100000,
        urgency: 'High',
        preferredTerms: 48,
        location: 'Raleigh, NC',
        status: 'active',
        createdAt: new Date('2024-02-10')
      }
    ];

    return mockLeads.filter(lead => {
      if (criteria.type && lead.type !== criteria.type) return false;
      if (criteria.minValue && lead.estimatedValue < criteria.minValue) return false;
      if (criteria.minCreditScore && lead.creditScore < criteria.minCreditScore) return false;
      return true;
    });
  }

  async findOpportunities(criteria = {}) {
    const mockOpportunities = [
      {
        id: 'eq-opp-001',
        title: 'Heavy Construction Equipment Package',
        lender: 'National Equipment Finance',
        equipmentTypes: ['Excavator', 'Bulldozer', 'Crane', 'Loader'],
        maxFinanceAmount: 5000000,
        minCreditScore: 680,
        interestRate: 0.059,
        terms: [36, 48, 60],
        downPayment: 0.10,
        industryFocus: ['Construction'],
        specialPrograms: ['New business discount', 'Seasonal payment options'],
        approvalTime: '24-48 hours',
        fundingSpeed: 'Fast',
        restrictions: 'Must be in business 2+ years',
        status: 'available',
        listedDate: new Date('2024-02-01')
      },
      {
        id: 'eq-opp-002',
        title: 'Advanced Manufacturing Equipment',
        lender: 'TechEquip Leasing',
        equipmentTypes: ['CNC Machine', 'Industrial Robot', '3D Printer', 'Laser Cutter'],
        maxFinanceAmount: 3000000,
        minCreditScore: 700,
        interestRate: 0.055,
        terms: [48, 60, 84],
        downPayment: 0.15,
        industryFocus: ['Manufacturing'],
        specialPrograms: ['Technology refresh option', 'Upgrade path'],
        approvalTime: '2-3 days',
        fundingSpeed: 'Medium',
        restrictions: 'ISO 9001 preferred',
        status: 'available',
        listedDate: new Date('2024-01-28')
      },
      {
        id: 'eq-opp-003',
        title: 'Medical Equipment Financing',
        lender: 'Healthcare Finance Solutions',
        equipmentTypes: ['MRI Machine', 'CT Scanner', 'X-Ray System', 'Ultrasound'],
        maxFinanceAmount: 10000000,
        minCreditScore: 720,
        interestRate: 0.048,
        terms: [60, 84, 96],
        downPayment: 0.10,
        industryFocus: ['Healthcare'],
        specialPrograms: ['100% financing available', 'Soft costs included'],
        approvalTime: '3-5 days',
        fundingSpeed: 'Medium',
        restrictions: 'Medical license required',
        status: 'available',
        listedDate: new Date('2024-02-05')
      },
      {
        id: 'eq-opp-004',
        title: 'Agricultural Equipment Program',
        lender: 'AgriLease Partners',
        equipmentTypes: ['Combine Harvester', 'Tractor', 'Irrigation System', 'Planter'],
        maxFinanceAmount: 2500000,
        minCreditScore: 660,
        interestRate: 0.062,
        terms: [60, 72, 84],
        downPayment: 0.10,
        industryFocus: ['Agriculture'],
        specialPrograms: ['Seasonal payment structure', 'Harvest payment options'],
        approvalTime: '24-48 hours',
        fundingSpeed: 'Fast',
        restrictions: 'Farm operation required',
        status: 'available',
        listedDate: new Date('2024-01-20')
      },
      {
        id: 'eq-opp-005',
        title: 'Commercial Transportation Fleet',
        lender: 'TransFleet Finance',
        equipmentTypes: ['Semi Truck', 'Trailer', 'Delivery Van', 'Box Truck'],
        maxFinanceAmount: 2000000,
        minCreditScore: 650,
        interestRate: 0.068,
        terms: [48, 60, 72],
        downPayment: 0.15,
        industryFocus: ['Transportation', 'Logistics'],
        specialPrograms: ['Fleet discounts', 'Mileage-based options'],
        approvalTime: '12-24 hours',
        fundingSpeed: 'Very Fast',
        restrictions: 'DOT authority required',
        status: 'available',
        listedDate: new Date('2024-02-08')
      },
      {
        id: 'eq-opp-006',
        title: 'IT & Technology Equipment',
        lender: 'Digital Assets Leasing',
        equipmentTypes: ['Server Equipment', 'Network Infrastructure', 'Workstations', 'Storage'],
        maxFinanceAmount: 1500000,
        minCreditScore: 680,
        interestRate: 0.052,
        terms: [24, 36, 48],
        downPayment: 0.00,
        industryFocus: ['Technology', 'All Industries'],
        specialPrograms: ['$1 buyout option', 'Tech refresh every 3 years'],
        approvalTime: '24 hours',
        fundingSpeed: 'Fast',
        restrictions: 'None',
        status: 'available',
        listedDate: new Date('2024-02-10')
      },
      {
        id: 'eq-opp-007',
        title: 'Food Processing & Industrial',
        lender: 'Industrial Finance Group',
        equipmentTypes: ['Industrial Freezer', 'Processing Line', 'Packaging Equipment', 'Conveyor'],
        maxFinanceAmount: 4000000,
        minCreditScore: 700,
        interestRate: 0.058,
        terms: [48, 60, 72],
        downPayment: 0.10,
        industryFocus: ['Food Processing', 'Manufacturing'],
        specialPrograms: ['Energy efficiency incentives', 'Bundled installation'],
        approvalTime: '2-3 days',
        fundingSpeed: 'Medium',
        restrictions: 'FDA/USDA compliance required',
        status: 'available',
        listedDate: new Date('2024-01-25')
      },
      {
        id: 'eq-opp-008',
        title: 'Printing & Graphics Equipment',
        lender: 'Print Industry Leasing',
        equipmentTypes: ['Digital Press', 'Large Format Printer', 'Bindery Equipment', 'Finishing'],
        maxFinanceAmount: 1200000,
        minCreditScore: 670,
        interestRate: 0.064,
        terms: [36, 48, 60],
        downPayment: 0.10,
        industryFocus: ['Printing'],
        specialPrograms: ['Manufacturer partnerships', 'Trade-in options'],
        approvalTime: '1-2 days',
        fundingSpeed: 'Fast',
        restrictions: 'Commercial printing license',
        status: 'available',
        listedDate: new Date('2024-02-12')
      },
      {
        id: 'eq-opp-009',
        title: 'Fitness & Wellness Equipment',
        lender: 'Fitness Finance Pro',
        equipmentTypes: ['Cardio Equipment', 'Strength Training', 'Group Fitness', 'Locker Room'],
        maxFinanceAmount: 800000,
        minCreditScore: 660,
        interestRate: 0.066,
        terms: [48, 60, 72],
        downPayment: 0.10,
        industryFocus: ['Fitness', 'Wellness'],
        specialPrograms: ['Gym startup packages', 'Equipment warranties included'],
        approvalTime: '24-48 hours',
        fundingSpeed: 'Fast',
        restrictions: 'Business license required',
        status: 'available',
        listedDate: new Date('2024-02-01')
      },
      {
        id: 'eq-opp-010',
        title: 'Landscaping & Grounds Care',
        lender: 'Green Industry Finance',
        equipmentTypes: ['Skid Steer', 'Dump Truck', 'Commercial Mower', 'Trailer'],
        maxFinanceAmount: 600000,
        minCreditScore: 640,
        interestRate: 0.072,
        terms: [36, 48, 60],
        downPayment: 0.15,
        industryFocus: ['Landscaping', 'Grounds Maintenance'],
        specialPrograms: ['Seasonal businesses welcome', 'Equipment packages'],
        approvalTime: '12-24 hours',
        fundingSpeed: 'Very Fast',
        restrictions: 'Commercial insurance required',
        status: 'available',
        listedDate: new Date('2024-02-15')
      }
    ];

    return mockOpportunities.filter(opp => {
      if (criteria.equipmentType && !opp.equipmentTypes.includes(criteria.equipmentType)) return false;
      if (criteria.maxAmount && opp.maxFinanceAmount < criteria.maxAmount) return false;
      if (criteria.industry && !opp.industryFocus.includes(criteria.industry)) return false;
      return true;
    });
  }

  async scoreMatch(lead, opportunity) {
    let score = 0;
    const factors = [];

    // Equipment type match (30 points)
    const equipmentMatch = lead.equipmentNeeds.some(eq => opportunity.equipmentTypes.includes(eq));
    if (equipmentMatch) {
      const matchCount = lead.equipmentNeeds.filter(eq => opportunity.equipmentTypes.includes(eq)).length;
      const points = Math.min(30, matchCount * 12);
      score += points;
      factors.push({ factor: 'Equipment Match', points, status: points >= 24 ? 'excellent' : 'good' });
    } else {
      factors.push({ factor: 'Equipment Match', points: 0, status: 'poor' });
    }

    // Credit score qualification (25 points)
    if (lead.creditScore >= opportunity.minCreditScore + 30) {
      score += 25;
      factors.push({ factor: 'Credit Qualification', points: 25, status: 'excellent' });
    } else if (lead.creditScore >= opportunity.minCreditScore + 10) {
      score += 20;
      factors.push({ factor: 'Credit Qualification', points: 20, status: 'good' });
    } else if (lead.creditScore >= opportunity.minCreditScore) {
      score += 15;
      factors.push({ factor: 'Credit Qualification', points: 15, status: 'fair' });
    } else {
      score += 5;
      factors.push({ factor: 'Credit Qualification', points: 5, status: 'poor' });
    }

    // Industry focus match (20 points)
    const industryMatch = opportunity.industryFocus.includes(lead.type) || 
                         opportunity.industryFocus.includes('All Industries');
    if (industryMatch) {
      score += 20;
      factors.push({ factor: 'Industry Specialization', points: 20, status: 'excellent' });
    } else {
      score += 8;
      factors.push({ factor: 'Industry Specialization', points: 8, status: 'fair' });
    }

    // Finance amount capacity (15 points)
    if (lead.estimatedValue <= opportunity.maxFinanceAmount * 0.8) {
      score += 15;
      factors.push({ factor: 'Finance Capacity', points: 15, status: 'excellent' });
    } else if (lead.estimatedValue <= opportunity.maxFinanceAmount) {
      score += 12;
      factors.push({ factor: 'Finance Capacity', points: 12, status: 'good' });
    } else {
      score += 5;
      factors.push({ factor: 'Finance Capacity', points: 5, status: 'poor' });
    }

    // Term flexibility (10 points)
    const termMatch = opportunity.terms.includes(lead.preferredTerms);
    if (termMatch) {
      score += 10;
      factors.push({ factor: 'Term Options', points: 10, status: 'excellent' });
    } else {
      const closestTerm = opportunity.terms.reduce((prev, curr) => 
        Math.abs(curr - lead.preferredTerms) < Math.abs(prev - lead.preferredTerms) ? curr : prev
      );
      const termDiff = Math.abs(closestTerm - lead.preferredTerms);
      if (termDiff <= 12) {
        score += 7;
        factors.push({ factor: 'Term Options', points: 7, status: 'good' });
      } else {
        score += 4;
        factors.push({ factor: 'Term Options', points: 4, status: 'fair' });
      }
    }

    return {
      score,
      maxScore: 100,
      percentage: Math.round(score),
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
      factors,
      recommendation: score >= 75 ? 'Highly Recommended' : 
                     score >= 55 ? 'Recommended' : 
                     'Review Carefully',
      estimatedCommission: this.calculateCommission({ 
        value: lead.estimatedValue * opportunity.interestRate * (lead.preferredTerms / 12)
      }),
      estimatedMonthlyPayment: Math.round(
        lead.estimatedValue * (1 - opportunity.downPayment) * 
        (opportunity.interestRate / 12) / 
        (1 - Math.pow(1 + opportunity.interestRate / 12, -lead.preferredTerms))
      )
    };
  }
}

export default EquipmentDivision;
