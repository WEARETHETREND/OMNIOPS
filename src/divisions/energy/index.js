/**
 * Solar & Energy Division
 * 
 * Connects commercial property owners with solar installers and energy solutions
 * Focus: Commercial solar, energy efficiency, renewable energy systems
 */

import BaseDivision from '../../core/BaseDivision.js';

class EnergyDivision extends BaseDivision {
  constructor() {
    super({
      id: 'energy',
      name: 'Solar & Energy Solutions',
      description: 'Commercial solar and renewable energy brokerage',
      commissionRate: 0.08, // 8% of project value
      dataSources: ['DSIRE', 'Solar Installer Networks', 'Utility Programs', 'NABCEP Registry']
    });
  }

  async findLeads(criteria = {}) {
    const mockLeads = [
      {
        id: 'energy-lead-001',
        name: 'Metro Warehouse Complex',
        type: 'Industrial',
        contact: { name: 'Jennifer Walsh', email: 'jwalsh@metrowarehouse.com', phone: '609-555-0101' },
        propertySize: 250000,
        roofSize: 200000,
        roofType: 'Flat commercial',
        roofAge: 5,
        annualEnergyUsage: 2500000,
        monthlyElectricBill: 22000,
        utilityRate: 0.12,
        utilityCompany: 'Jersey Central Power & Light',
        currentPowerSource: 'Grid',
        motivation: 'Cost savings',
        budget: { min: 800000, max: 1500000 },
        timeline: '6-12 months',
        taxStatus: 'For-profit',
        location: 'Newark, NJ',
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'energy-lead-002',
        name: 'SunValley Shopping Center',
        type: 'Retail',
        contact: { name: 'Michael Rodriguez', email: 'mrodriguez@sunvalley.com', phone: '602-555-0202' },
        propertySize: 180000,
        roofSize: 150000,
        roofType: 'Flat TPO',
        roofAge: 3,
        annualEnergyUsage: 1800000,
        monthlyElectricBill: 16500,
        utilityRate: 0.11,
        utilityCompany: 'Arizona Public Service',
        currentPowerSource: 'Grid',
        motivation: 'Sustainability goals',
        budget: { min: 600000, max: 1200000 },
        timeline: '3-6 months',
        taxStatus: 'For-profit',
        location: 'Phoenix, AZ',
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'energy-lead-003',
        name: 'TechPark Office Complex',
        type: 'Office',
        contact: { name: 'Sarah Chen', email: 'schen@techpark.com', phone: '512-555-0303' },
        propertySize: 120000,
        roofSize: 80000,
        roofType: 'Flat EPDM',
        roofAge: 8,
        annualEnergyUsage: 1200000,
        monthlyElectricBill: 11000,
        utilityRate: 0.092,
        utilityCompany: 'Austin Energy',
        currentPowerSource: 'Grid',
        motivation: 'Cost savings & sustainability',
        budget: { min: 400000, max: 800000 },
        timeline: '6-12 months',
        taxStatus: 'For-profit',
        location: 'Austin, TX',
        status: 'active',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'energy-lead-004',
        name: 'Precision Manufacturing Facility',
        type: 'Manufacturing',
        contact: { name: 'Robert Martinez', email: 'rmartinez@precision-mfg.com', phone: '414-555-0404' },
        propertySize: 300000,
        roofSize: 250000,
        roofType: 'Metal standing seam',
        roofAge: 4,
        annualEnergyUsage: 3500000,
        monthlyElectricBill: 28000,
        utilityRate: 0.095,
        utilityCompany: 'We Energies',
        currentPowerSource: 'Grid',
        motivation: 'Cost reduction',
        budget: { min: 1000000, max: 2000000 },
        timeline: '12+ months',
        taxStatus: 'For-profit',
        location: 'Milwaukee, WI',
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'energy-lead-005',
        name: 'Riverside School District',
        type: 'Education',
        contact: { name: 'Dr. Amanda Foster', email: 'afoster@riversideschools.org', phone: '916-555-0505' },
        propertySize: 450000,
        roofSize: 300000,
        roofType: 'Various - 5 buildings',
        roofAge: 6,
        annualEnergyUsage: 4200000,
        monthlyElectricBill: 38000,
        utilityRate: 0.15,
        utilityCompany: 'SMUD',
        currentPowerSource: 'Grid',
        motivation: 'Budget relief & education',
        budget: { min: 1500000, max: 3000000 },
        timeline: '12+ months',
        taxStatus: 'Nonprofit',
        location: 'Sacramento, CA',
        status: 'active',
        createdAt: new Date('2024-01-28')
      },
      {
        id: 'energy-lead-006',
        name: 'FreshFoods Distribution Center',
        type: 'Cold Storage',
        contact: { name: 'Carlos Rivera', email: 'crivera@freshfoods.com', phone: '404-555-0606' },
        propertySize: 200000,
        roofSize: 180000,
        roofType: 'Flat white TPO',
        roofAge: 2,
        annualEnergyUsage: 3200000,
        monthlyElectricBill: 32000,
        utilityRate: 0.10,
        utilityCompany: 'Georgia Power',
        currentPowerSource: 'Grid',
        motivation: 'High energy costs',
        budget: { min: 900000, max: 1800000 },
        timeline: '6-12 months',
        taxStatus: 'For-profit',
        location: 'Atlanta, GA',
        status: 'active',
        createdAt: new Date('2024-02-05')
      },
      {
        id: 'energy-lead-007',
        name: 'Downtown Hotel Group',
        type: 'Hospitality',
        contact: { name: 'Lisa Thompson', email: 'lthompson@downtownhotels.com', phone: '303-555-0707' },
        propertySize: 150000,
        roofSize: 100000,
        roofType: 'Flat modified bitumen',
        roofAge: 7,
        annualEnergyUsage: 2000000,
        monthlyElectricBill: 18000,
        utilityRate: 0.09,
        utilityCompany: 'Xcel Energy',
        currentPowerSource: 'Grid',
        motivation: 'Sustainability branding',
        budget: { min: 500000, max: 1000000 },
        timeline: '6-12 months',
        taxStatus: 'For-profit',
        location: 'Denver, CO',
        status: 'active',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'energy-lead-008',
        name: 'AgriCorp Processing Plant',
        type: 'Agriculture',
        contact: { name: 'David Kim', email: 'dkim@agricorp.com', phone: '559-555-0808' },
        propertySize: 280000,
        roofSize: 220000,
        roofType: 'Metal corrugated',
        roofAge: 10,
        annualEnergyUsage: 2800000,
        monthlyElectricBill: 26000,
        utilityRate: 0.13,
        utilityCompany: 'PG&E',
        currentPowerSource: 'Grid',
        motivation: 'Cost savings',
        budget: { min: 800000, max: 1600000 },
        timeline: '12+ months',
        taxStatus: 'For-profit',
        location: 'Fresno, CA',
        status: 'active',
        createdAt: new Date('2024-02-08')
      },
      {
        id: 'energy-lead-009',
        name: 'HealthFirst Medical Campus',
        type: 'Healthcare',
        contact: { name: 'Dr. Jennifer Martinez', email: 'jmartinez@healthfirst.com', phone: '858-555-0909' },
        propertySize: 220000,
        roofSize: 160000,
        roofType: 'Flat TPO',
        roofAge: 4,
        annualEnergyUsage: 2600000,
        monthlyElectricBill: 24000,
        utilityRate: 0.17,
        utilityCompany: 'San Diego Gas & Electric',
        currentPowerSource: 'Grid',
        motivation: 'Cost reduction & resilience',
        budget: { min: 900000, max: 1700000 },
        timeline: '6-12 months',
        taxStatus: 'Nonprofit',
        location: 'San Diego, CA',
        status: 'active',
        createdAt: new Date('2024-01-25')
      },
      {
        id: 'energy-lead-010',
        name: 'MegaMart Retail Chain',
        type: 'Big Box Retail',
        contact: { name: 'Christopher Lee', email: 'clee@megamart.com', phone: '702-555-1010' },
        propertySize: 500000,
        roofSize: 400000,
        roofType: 'Flat TPO - multiple locations',
        roofAge: 5,
        annualEnergyUsage: 5500000,
        monthlyElectricBill: 50000,
        utilityRate: 0.095,
        utilityCompany: 'NV Energy',
        currentPowerSource: 'Grid',
        motivation: 'Corporate sustainability goals',
        budget: { min: 2000000, max: 4000000 },
        timeline: '12+ months',
        taxStatus: 'For-profit',
        location: 'Las Vegas, NV',
        status: 'active',
        createdAt: new Date('2024-02-10')
      }
    ];

    return mockLeads.filter(lead => {
      if (criteria.type && lead.type !== criteria.type) return false;
      if (criteria.minRoofSize && lead.roofSize < criteria.minRoofSize) return false;
      if (criteria.minUsage && lead.annualEnergyUsage < criteria.minUsage) return false;
      return true;
    });
  }

  async findOpportunities(criteria = {}) {
    const mockOpportunities = [
      {
        id: 'energy-opp-001',
        title: 'Commercial Solar Installation',
        provider: 'SunPower Commercial',
        providerType: 'Tier 1 Installer',
        services: ['Design', 'Installation', 'Monitoring', 'Maintenance'],
        systemSizes: { min: 100, max: 2000 },
        panelType: 'Monocrystalline',
        efficiency: 0.22,
        warranty: { equipment: 25, performance: 25, workmanship: 10 },
        certifications: ['NABCEP', 'LEED AP', 'Licensed & Bonded'],
        financing: ['Cash', 'Loan', 'PPA', 'Lease'],
        pricePerWatt: { min: 2.50, max: 3.20 },
        projectTimeline: '3-6 months',
        coverage: ['Nationwide'],
        specializations: ['Large commercial', 'Industrial'],
        incentivesHelp: true,
        batteryStorage: true,
        status: 'available',
        listedDate: new Date('2024-02-01')
      },
      {
        id: 'energy-opp-002',
        title: 'Solar + Storage Solution',
        provider: 'EnergyTech Solutions',
        providerType: 'Full Service Provider',
        services: ['Design', 'Installation', 'Energy Storage', 'Monitoring', 'Maintenance'],
        systemSizes: { min: 200, max: 3000 },
        panelType: 'Bifacial',
        efficiency: 0.21,
        warranty: { equipment: 25, performance: 25, workmanship: 10 },
        certifications: ['NABCEP', 'Tesla Certified', 'Licensed & Insured'],
        financing: ['Cash', 'Loan', 'PPA', 'Lease', 'PACE'],
        pricePerWatt: { min: 2.80, max: 3.50 },
        projectTimeline: '4-8 months',
        coverage: ['Western US'],
        specializations: ['Solar + Storage', 'Microgrids', 'EV Charging'],
        incentivesHelp: true,
        batteryStorage: true,
        status: 'available',
        listedDate: new Date('2024-01-28')
      },
      {
        id: 'energy-opp-003',
        title: 'Turnkey Solar for Education',
        provider: 'ScholarSolar',
        providerType: 'Education Specialist',
        services: ['Design', 'Installation', 'Educational Programs', 'Monitoring'],
        systemSizes: { min: 300, max: 5000 },
        panelType: 'Monocrystalline',
        efficiency: 0.20,
        warranty: { equipment: 25, performance: 25, workmanship: 10 },
        certifications: ['NABCEP', 'School-approved contractors'],
        financing: ['ESPC', 'Municipal Lease', 'PPA'],
        pricePerWatt: { min: 2.40, max: 3.00 },
        projectTimeline: '6-12 months',
        coverage: ['Nationwide'],
        specializations: ['K-12', 'Higher Education', 'Non-profit'],
        incentivesHelp: true,
        batteryStorage: true,
        status: 'available',
        listedDate: new Date('2024-02-05')
      },
      {
        id: 'energy-opp-004',
        title: 'Industrial Solar Systems',
        provider: 'MegaWatt Industrial',
        providerType: 'Industrial Specialist',
        services: ['Design', 'Installation', 'Energy Audits', 'Monitoring', 'O&M'],
        systemSizes: { min: 500, max: 10000 },
        panelType: 'Monocrystalline High-Efficiency',
        efficiency: 0.22,
        warranty: { equipment: 25, performance: 25, workmanship: 15 },
        certifications: ['NABCEP', 'UL Listed', 'ISO 9001'],
        financing: ['Cash', 'Commercial Loan', 'PACE', 'Tax Equity'],
        pricePerWatt: { min: 2.20, max: 2.80 },
        projectTimeline: '6-18 months',
        coverage: ['Nationwide'],
        specializations: ['Manufacturing', 'Warehouse', 'Heavy Industry'],
        incentivesHelp: true,
        batteryStorage: true,
        status: 'available',
        listedDate: new Date('2024-01-20')
      },
      {
        id: 'energy-opp-005',
        title: 'Retail Solar Programs',
        provider: 'RetailPower Solutions',
        providerType: 'Retail Specialist',
        services: ['Design', 'Installation', 'Portfolio Management', 'Monitoring'],
        systemSizes: { min: 150, max: 5000 },
        panelType: 'Monocrystalline',
        efficiency: 0.21,
        warranty: { equipment: 25, performance: 25, workmanship: 10 },
        certifications: ['NABCEP', 'National accounts experience'],
        financing: ['PPA', 'Lease', 'Direct Purchase', 'PACE'],
        pricePerWatt: { min: 2.60, max: 3.30 },
        projectTimeline: '3-9 months',
        coverage: ['Nationwide'],
        specializations: ['Multi-site rollouts', 'Shopping centers', 'Big box retail'],
        incentivesHelp: true,
        batteryStorage: true,
        status: 'available',
        listedDate: new Date('2024-02-08')
      },
      {
        id: 'energy-opp-006',
        title: 'Solar for Healthcare',
        provider: 'HealthPower Energy',
        providerType: 'Healthcare Specialist',
        services: ['Design', 'Installation', 'Resilience Planning', 'Monitoring', 'Maintenance'],
        systemSizes: { min: 200, max: 3000 },
        panelType: 'Premium Monocrystalline',
        efficiency: 0.22,
        warranty: { equipment: 25, performance: 25, workmanship: 15 },
        certifications: ['NABCEP', 'Healthcare facility experience', 'Licensed'],
        financing: ['Cash', 'Tax-exempt Lease', 'ESPC', 'Bonds'],
        pricePerWatt: { min: 2.70, max: 3.40 },
        projectTimeline: '6-12 months',
        coverage: ['Nationwide'],
        specializations: ['Hospitals', 'Medical campuses', 'Critical load backup'],
        incentivesHelp: true,
        batteryStorage: true,
        status: 'available',
        listedDate: new Date('2024-01-25')
      },
      {
        id: 'energy-opp-007',
        title: 'Agricultural Solar Solutions',
        provider: 'AgriSolar Systems',
        providerType: 'Agriculture Specialist',
        services: ['Design', 'Installation', 'Agricultural Integration', 'Monitoring'],
        systemSizes: { min: 200, max: 4000 },
        panelType: 'Durable All-weather',
        efficiency: 0.20,
        warranty: { equipment: 25, performance: 25, workmanship: 10 },
        certifications: ['NABCEP', 'Agricultural background'],
        financing: ['Cash', 'Farm Credit', 'USDA Programs', 'PPA'],
        pricePerWatt: { min: 2.30, max: 2.90 },
        projectTimeline: '4-8 months',
        coverage: ['Agricultural regions'],
        specializations: ['Farms', 'Processing facilities', 'Agrivoltaics'],
        incentivesHelp: true,
        batteryStorage: true,
        status: 'available',
        listedDate: new Date('2024-02-10')
      },
      {
        id: 'energy-opp-008',
        title: 'Commercial PPA Programs',
        provider: 'CleanEnergy Finance Group',
        providerType: 'Finance Provider',
        services: ['Design', 'Installation', 'Ownership', 'Maintenance', 'Monitoring'],
        systemSizes: { min: 250, max: 10000 },
        panelType: 'Various - Portfolio Approach',
        efficiency: 0.20,
        warranty: { equipment: 25, performance: 25, workmanship: 10 },
        certifications: ['Tax equity provider', 'Multiple installer partners'],
        financing: ['PPA', 'Lease'],
        pricePerWatt: { min: 0, max: 0 },
        ppaRate: { min: 0.08, max: 0.12 },
        projectTimeline: '3-12 months',
        coverage: ['Select states'],
        specializations: ['No money down', 'Turnkey solutions', 'Large portfolios'],
        incentivesHelp: true,
        batteryStorage: true,
        status: 'available',
        listedDate: new Date('2024-02-12')
      },
      {
        id: 'energy-opp-009',
        title: 'Hospitality Energy Solutions',
        provider: 'HospitalityPower Systems',
        providerType: 'Hospitality Specialist',
        services: ['Design', 'Installation', 'Energy Management', 'Monitoring'],
        systemSizes: { min: 150, max: 2000 },
        panelType: 'Aesthetic Monocrystalline',
        efficiency: 0.21,
        warranty: { equipment: 25, performance: 25, workmanship: 10 },
        certifications: ['NABCEP', 'LEED AP', 'Hospitality experience'],
        financing: ['Cash', 'Loan', 'PPA', 'PACE'],
        pricePerWatt: { min: 2.70, max: 3.40 },
        projectTimeline: '3-6 months',
        coverage: ['Major metros'],
        specializations: ['Hotels', 'Resorts', 'Guest experience integration'],
        incentivesHelp: true,
        batteryStorage: true,
        status: 'available',
        listedDate: new Date('2024-01-18')
      },
      {
        id: 'energy-opp-010',
        title: 'Enterprise Solar Portfolio',
        provider: 'NationalSolar Partners',
        providerType: 'National Enterprise Provider',
        services: ['Design', 'Installation', 'Portfolio Management', 'Monitoring', 'O&M'],
        systemSizes: { min: 500, max: 20000 },
        panelType: 'Various - Best in Class',
        efficiency: 0.21,
        warranty: { equipment: 25, performance: 25, workmanship: 15 },
        certifications: ['NABCEP', 'National presence', 'Enterprise proven'],
        financing: ['All options', 'Custom structures'],
        pricePerWatt: { min: 2.30, max: 3.00 },
        projectTimeline: '6-24 months',
        coverage: ['Nationwide'],
        specializations: ['Multi-site', 'Corporate portfolios', 'National accounts'],
        incentivesHelp: true,
        batteryStorage: true,
        status: 'available',
        listedDate: new Date('2024-02-15')
      }
    ];

    return mockOpportunities.filter(opp => {
      if (criteria.minSystemSize && opp.systemSizes.max < criteria.minSystemSize) return false;
      if (criteria.maxSystemSize && opp.systemSizes.min > criteria.maxSystemSize) return false;
      if (criteria.financing && !opp.financing.includes(criteria.financing)) return false;
      return true;
    });
  }

  async scoreMatch(lead, opportunity) {
    let score = 0;
    const factors = [];

    // Property type specialization (25 points)
    const typeMatch = opportunity.specializations.some(spec => 
      spec.toLowerCase().includes(lead.type.toLowerCase()) ||
      lead.type.toLowerCase().includes(spec.toLowerCase())
    );
    if (typeMatch) {
      score += 25;
      factors.push({ factor: 'Property Type Expertise', points: 25, status: 'excellent' });
    } else {
      score += 10;
      factors.push({ factor: 'General Commercial Experience', points: 10, status: 'fair' });
    }

    // System size capability (25 points)
    const estimatedSystemSize = Math.round(lead.roofSize * 0.75 * 0.015);
    if (estimatedSystemSize >= opportunity.systemSizes.min && 
        estimatedSystemSize <= opportunity.systemSizes.max) {
      score += 25;
      factors.push({ factor: 'System Size Perfect Fit', points: 25, status: 'excellent' });
    } else if (estimatedSystemSize >= opportunity.systemSizes.min * 0.7 && 
               estimatedSystemSize <= opportunity.systemSizes.max * 1.3) {
      score += 18;
      factors.push({ factor: 'System Size Good Fit', points: 18, status: 'good' });
    } else {
      score += 8;
      factors.push({ factor: 'System Size Marginal', points: 8, status: 'fair' });
    }

    // Budget alignment (20 points)
    let budgetMatch = false;
    if (opportunity.ppaRate) {
      const savingsRate = lead.utilityRate * 0.85;
      if (opportunity.ppaRate.max < savingsRate) {
        score += 20;
        budgetMatch = true;
        factors.push({ factor: 'PPA Rate Provides Savings', points: 20, status: 'excellent' });
      } else {
        score += 10;
        factors.push({ factor: 'PPA Rate Marginal', points: 10, status: 'fair' });
      }
    } else {
      const estimatedCost = estimatedSystemSize * 1000 * opportunity.pricePerWatt.max;
      if (estimatedCost >= lead.budget.min && estimatedCost <= lead.budget.max) {
        score += 20;
        budgetMatch = true;
        factors.push({ factor: 'Project Cost Within Budget', points: 20, status: 'excellent' });
      } else if (estimatedCost <= lead.budget.max * 1.15) {
        score += 15;
        factors.push({ factor: 'Project Cost Near Budget', points: 15, status: 'good' });
      } else {
        score += 5;
        factors.push({ factor: 'Project Cost High', points: 5, status: 'fair' });
      }
    }

    // Financing options (15 points)
    const hasPreferredFinancing = opportunity.financing.some(opt => 
      (lead.taxStatus === 'Nonprofit' && ['PPA', 'Lease', 'ESPC', 'Municipal Lease'].includes(opt)) ||
      (lead.taxStatus === 'For-profit' && ['Cash', 'Loan', 'PPA', 'Lease', 'PACE'].includes(opt))
    );
    if (hasPreferredFinancing) {
      score += 15;
      factors.push({ factor: 'Suitable Financing Available', points: 15, status: 'excellent' });
    } else {
      score += 7;
      factors.push({ factor: 'Limited Financing Options', points: 7, status: 'fair' });
    }

    // Timeline match (15 points)
    const timelineScore = {
      '3-6 months': { '3-6 months': 15, '6-12 months': 12, '12+ months': 8 },
      '6-12 months': { '3-6 months': 12, '6-12 months': 15, '12+ months': 13 },
      '12+ months': { '3-6 months': 10, '6-12 months': 13, '12+ months': 15 }
    };
    const timelinePoints = timelineScore[lead.timeline]?.[opportunity.projectTimeline.split('-')[0] + '-' + opportunity.projectTimeline.split(' ')[1]] || 8;
    score += timelinePoints;
    factors.push({ 
      factor: 'Timeline Alignment', 
      points: timelinePoints, 
      status: timelinePoints >= 14 ? 'excellent' : timelinePoints >= 12 ? 'good' : 'fair' 
    });

    // Calculate final estimates for return
    const finalEstimatedCost = estimatedSystemSize * 1000 * (opportunity.pricePerWatt?.max || 3.0);
    const annualSavings = Math.round(lead.monthlyElectricBill * 12 * 0.75);

    return {
      score,
      maxScore: 100,
      percentage: Math.round(score),
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
      factors,
      recommendation: score >= 75 ? 'Highly Recommended - Excellent Match' : 
                     score >= 55 ? 'Good Fit - Present to Client' : 
                     'Consider Other Providers',
      estimatedSystemSize: `${estimatedSystemSize} kW`,
      estimatedCost: opportunity.ppaRate ? 'PPA - No upfront cost' : `$${Math.round(finalEstimatedCost).toLocaleString()}`,
      estimatedAnnualSavings: `$${annualSavings.toLocaleString()}`,
      estimatedCommission: this.calculateCommission({ value: finalEstimatedCost }),
      paybackPeriod: opportunity.ppaRate ? 'N/A - PPA' : `${Math.round(finalEstimatedCost / annualSavings)} years`
    };
  }
}

export default EnergyDivision;
