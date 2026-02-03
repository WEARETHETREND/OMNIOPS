/**
 * Supply Chain Brokerage Division
 * 
 * Connects manufacturers, distributors, and retailers with logistics providers
 * Focus: Freight carriers, 3PLs, warehousing, and transportation management
 */

import BaseDivision from '../../core/BaseDivision.js';

class SupplyChainDivision extends BaseDivision {
  constructor() {
    super({
      id: 'supply-chain',
      name: 'Supply Chain Brokerage',
      description: 'Freight and logistics service matching',
      commissionRate: 0.10, // 10% of annual contract value
      dataSources: ['DAT', 'Freightos', 'Project44', 'Direct Carrier Relationships']
    });
  }

  async findLeads(criteria = {}) {
    const mockLeads = [
      {
        id: 'sc-lead-001',
        name: 'TechProducts Manufacturing',
        type: 'Manufacturer',
        contact: { name: 'Jennifer Liu', email: 'jliu@techproducts.com', phone: '408-555-0101' },
        shipmentVolume: 'High',
        monthlyShipments: 500,
        primaryLanes: [
          { origin: 'San Jose, CA', destination: 'Dallas, TX', frequency: 50 },
          { origin: 'San Jose, CA', destination: 'Chicago, IL', frequency: 40 }
        ],
        freightTypes: ['LTL', 'FTL'],
        specialRequirements: ['Temperature Control', 'White Glove'],
        annualSpend: 2400000,
        currentProviders: ['Multiple regional carriers'],
        painPoints: ['Rate volatility', 'Capacity issues'],
        location: 'San Jose, CA',
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'sc-lead-002',
        name: 'National Retail Group',
        type: 'Retailer',
        contact: { name: 'Marcus Thompson', email: 'mthompson@nationalretail.com', phone: '612-555-0202' },
        shipmentVolume: 'Very High',
        monthlyShipments: 1200,
        primaryLanes: [
          { origin: 'Various', destination: '150 store locations', frequency: 1200 }
        ],
        freightTypes: ['FTL', 'Dedicated'],
        specialRequirements: ['Cross-Docking', 'Store Delivery'],
        annualSpend: 8500000,
        currentProviders: ['Multiple 3PLs'],
        painPoints: ['Consolidation opportunities', 'Visibility'],
        location: 'Minneapolis, MN',
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'sc-lead-003',
        name: 'Fresh Foods Distributors',
        type: 'Distributor',
        contact: { name: 'Sarah Rodriguez', email: 'srodriguez@freshfoods.com', phone: '404-555-0303' },
        shipmentVolume: 'High',
        monthlyShipments: 800,
        primaryLanes: [
          { origin: 'Atlanta, GA', destination: 'Southeast Region', frequency: 800 }
        ],
        freightTypes: ['Refrigerated FTL', 'LTL'],
        specialRequirements: ['Temperature Controlled', 'Food Grade'],
        annualSpend: 4200000,
        currentProviders: ['Regional reefer carriers'],
        painPoints: ['Temperature compliance', 'Weekend/holiday service'],
        location: 'Atlanta, GA',
        status: 'active',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'sc-lead-004',
        name: 'BuildRight Materials',
        type: 'Manufacturer',
        contact: { name: 'David Chen', email: 'dchen@buildright.com', phone: '713-555-0404' },
        shipmentVolume: 'Medium',
        monthlyShipments: 200,
        primaryLanes: [
          { origin: 'Houston, TX', destination: 'Construction sites nationwide', frequency: 200 }
        ],
        freightTypes: ['Flatbed', 'FTL'],
        specialRequirements: ['Heavy Haul', 'Job Site Delivery'],
        annualSpend: 1800000,
        currentProviders: ['Spot market mostly'],
        painPoints: ['Inconsistent service', 'Need dedicated capacity'],
        location: 'Houston, TX',
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'sc-lead-005',
        name: 'E-Commerce Fulfillment Co',
        type: 'E-Commerce',
        contact: { name: 'Amanda Foster', email: 'afoster@ecomfulfill.com', phone: '206-555-0505' },
        shipmentVolume: 'Very High',
        monthlyShipments: 2500,
        primaryLanes: [
          { origin: 'Seattle, WA', destination: 'Nationwide', frequency: 2500 }
        ],
        freightTypes: ['Parcel', 'LTL', 'FTL'],
        specialRequirements: ['2-Day Delivery', 'Returns Management'],
        annualSpend: 6800000,
        currentProviders: ['Major parcel carriers'],
        painPoints: ['Rate increases', 'Peak season capacity'],
        location: 'Seattle, WA',
        status: 'active',
        createdAt: new Date('2024-01-28')
      },
      {
        id: 'sc-lead-006',
        name: 'Chemical Solutions Inc',
        type: 'Manufacturer',
        contact: { name: 'Robert Miller', email: 'rmiller@chemsolutions.com', phone: '504-555-0606' },
        shipmentVolume: 'Medium',
        monthlyShipments: 150,
        primaryLanes: [
          { origin: 'New Orleans, LA', destination: 'Industrial customers nationwide', frequency: 150 }
        ],
        freightTypes: ['Tanker', 'FTL'],
        specialRequirements: ['Hazmat Certified', 'Tank Cleaning'],
        annualSpend: 2100000,
        currentProviders: ['Specialized chemical carriers'],
        painPoints: ['Carrier certification requirements', 'Insurance costs'],
        location: 'New Orleans, LA',
        status: 'active',
        createdAt: new Date('2024-02-05')
      },
      {
        id: 'sc-lead-007',
        name: 'Furniture Warehouse Network',
        type: 'Distributor',
        contact: { name: 'Lisa Anderson', email: 'landerson@furniturewarehouse.com', phone: '704-555-0707' },
        shipmentVolume: 'High',
        monthlyShipments: 600,
        primaryLanes: [
          { origin: 'Charlotte, NC', destination: 'Eastern US', frequency: 600 }
        ],
        freightTypes: ['FTL', 'LTL'],
        specialRequirements: ['Pad Wrap', 'White Glove', 'Inside Delivery'],
        annualSpend: 3600000,
        currentProviders: ['Furniture specialized carriers'],
        painPoints: ['Damage claims', 'Delivery appointment scheduling'],
        location: 'Charlotte, NC',
        status: 'active',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'sc-lead-008',
        name: 'Auto Parts Distribution',
        type: 'Distributor',
        contact: { name: 'Carlos Rivera', email: 'crivera@autoparts.com', phone: '313-555-0808' },
        shipmentVolume: 'Very High',
        monthlyShipments: 1500,
        primaryLanes: [
          { origin: 'Detroit, MI', destination: 'Auto dealerships nationwide', frequency: 1500 }
        ],
        freightTypes: ['LTL', 'FTL'],
        specialRequirements: ['Next Day Service', 'Emergency Shipments'],
        annualSpend: 5400000,
        currentProviders: ['National LTL network'],
        painPoints: ['Speed to market', 'Inventory carrying costs'],
        location: 'Detroit, MI',
        status: 'active',
        createdAt: new Date('2024-02-08')
      },
      {
        id: 'sc-lead-009',
        name: 'Pharmaceutical Logistics',
        type: 'Manufacturer',
        contact: { name: 'Dr. Emily Watson', email: 'ewatson@pharmalog.com', phone: '201-555-0909' },
        shipmentVolume: 'Medium',
        monthlyShipments: 250,
        primaryLanes: [
          { origin: 'Newark, NJ', destination: 'Hospitals and pharmacies nationwide', frequency: 250 }
        ],
        freightTypes: ['Air Freight', 'Temperature Controlled FTL'],
        specialRequirements: ['Cold Chain', 'Security', 'Chain of Custody'],
        annualSpend: 4500000,
        currentProviders: ['Specialized pharma carriers'],
        painPoints: ['Compliance documentation', 'Temperature excursions'],
        location: 'Newark, NJ',
        status: 'active',
        createdAt: new Date('2024-01-25')
      },
      {
        id: 'sc-lead-010',
        name: 'Agricultural Exports LLC',
        type: 'Exporter',
        contact: { name: 'Tom Bradley', email: 'tbradley@agexports.com', phone: '402-555-1010' },
        shipmentVolume: 'High',
        monthlyShipments: 400,
        primaryLanes: [
          { origin: 'Omaha, NE', destination: 'Port of Long Beach, CA', frequency: 200 },
          { origin: 'Omaha, NE', destination: 'Port of Savannah, GA', frequency: 200 }
        ],
        freightTypes: ['Intermodal', 'FTL'],
        specialRequirements: ['Export Documentation', 'Container Drayage'],
        annualSpend: 3200000,
        currentProviders: ['Class I railroads', 'Intermodal providers'],
        painPoints: ['Port congestion', 'Container availability'],
        location: 'Omaha, NE',
        status: 'active',
        createdAt: new Date('2024-02-10')
      }
    ];

    return mockLeads.filter(lead => {
      if (criteria.type && lead.type !== criteria.type) return false;
      if (criteria.minSpend && lead.annualSpend < criteria.minSpend) return false;
      if (criteria.freightType && !lead.freightTypes.includes(criteria.freightType)) return false;
      return true;
    });
  }

  async findOpportunities(criteria = {}) {
    const mockOpportunities = [
      {
        id: 'sc-opp-001',
        title: 'National LTL & FTL Network',
        provider: 'ProFreight Logistics',
        providerType: '3PL',
        services: ['LTL', 'FTL', 'Expedited', 'White Glove'],
        coverage: 'Nationwide',
        carrierNetwork: 5000,
        specialCapabilities: ['Temperature Control', 'Liftgate', 'Inside Delivery'],
        technology: 'Advanced TMS with real-time tracking',
        avgSavings: 0.18,
        minVolume: 100,
        contractTerms: [12, 24, 36],
        pricing: 'Volume-based discounts',
        status: 'available',
        listedDate: new Date('2024-02-01')
      },
      {
        id: 'sc-opp-002',
        title: 'Dedicated Fleet Solutions',
        provider: 'Dedicated Transport Services',
        providerType: 'Asset Carrier',
        services: ['Dedicated', 'FTL'],
        coverage: 'Regional and National',
        carrierNetwork: 'Own Fleet - 1,200 trucks',
        specialCapabilities: ['Cross-Docking', 'Store Delivery', 'Backhaul Optimization'],
        technology: 'Proprietary routing and scheduling',
        avgSavings: 0.15,
        minVolume: 500,
        contractTerms: [24, 36],
        pricing: 'Fixed monthly fee plus mileage',
        status: 'available',
        listedDate: new Date('2024-01-28')
      },
      {
        id: 'sc-opp-003',
        title: 'Refrigerated Transportation',
        provider: 'ColdChain Express',
        providerType: 'Specialized Carrier',
        services: ['Refrigerated FTL', 'Temperature Controlled LTL'],
        coverage: 'Nationwide',
        carrierNetwork: 'Own Fleet - 400 reefer units',
        specialCapabilities: ['Multi-temp', 'Food Grade', '24/7 Monitoring'],
        technology: 'Real-time temperature tracking',
        avgSavings: 0.12,
        minVolume: 200,
        contractTerms: [12, 24],
        pricing: 'Mileage-based with fuel surcharge',
        status: 'available',
        listedDate: new Date('2024-02-05')
      },
      {
        id: 'sc-opp-004',
        title: 'Heavy Haul & Specialized',
        provider: 'Titan Transport Group',
        providerType: 'Specialized Carrier',
        services: ['Flatbed', 'Heavy Haul', 'Oversize'],
        coverage: 'Nationwide',
        carrierNetwork: 'Own Fleet - 350 specialized trailers',
        specialCapabilities: ['Permitting', 'Escort Services', 'Job Site Delivery'],
        technology: 'Load tracking and documentation',
        avgSavings: 0.10,
        minVolume: 50,
        contractTerms: [12, 24, 36],
        pricing: 'Per-load pricing with volume discounts',
        status: 'available',
        listedDate: new Date('2024-01-20')
      },
      {
        id: 'sc-opp-005',
        title: 'E-Commerce Fulfillment Network',
        provider: 'FastShip Logistics',
        providerType: '3PL',
        services: ['Parcel', 'LTL', 'FTL', 'Last Mile'],
        coverage: 'Nationwide with 12 fulfillment centers',
        carrierNetwork: 'Multi-carrier partnerships',
        specialCapabilities: ['2-Day Delivery', 'Returns Management', 'Kitting'],
        technology: 'Integrated WMS and TMS',
        avgSavings: 0.20,
        minVolume: 1000,
        contractTerms: [12, 24],
        pricing: 'Per-shipment with volume tiers',
        status: 'available',
        listedDate: new Date('2024-02-08')
      },
      {
        id: 'sc-opp-006',
        title: 'Hazmat & Chemical Transport',
        provider: 'SafeChem Logistics',
        providerType: 'Specialized Carrier',
        services: ['Tanker', 'FTL', 'Hazmat'],
        coverage: 'Nationwide',
        carrierNetwork: 'Own Fleet - 200 tankers',
        specialCapabilities: ['Hazmat Certified', 'Tank Cleaning', 'Emergency Response'],
        technology: 'Compliance tracking and documentation',
        avgSavings: 0.08,
        minVolume: 50,
        contractTerms: [24, 36],
        pricing: 'Per-load with dedicated lane discounts',
        status: 'available',
        listedDate: new Date('2024-02-10')
      },
      {
        id: 'sc-opp-007',
        title: 'White Glove Home Delivery',
        provider: 'Premier Home Delivery',
        providerType: 'Specialized Carrier',
        services: ['FTL', 'LTL', 'Final Mile'],
        coverage: 'Eastern US',
        carrierNetwork: 'Own Fleet - 250 trucks',
        specialCapabilities: ['Pad Wrap', 'White Glove', 'Assembly', 'Room of Choice'],
        technology: 'Appointment scheduling and tracking',
        avgSavings: 0.14,
        minVolume: 200,
        contractTerms: [12, 24],
        pricing: 'Per-delivery with volume discounts',
        status: 'available',
        listedDate: new Date('2024-01-25')
      },
      {
        id: 'sc-opp-008',
        title: 'Express & Expedited Services',
        provider: 'RapidMove Express',
        providerType: '3PL',
        services: ['LTL', 'FTL', 'Expedited', 'Hot Shot'],
        coverage: 'Nationwide',
        carrierNetwork: 2500,
        specialCapabilities: ['Next Day Service', 'Emergency', 'Team Drivers'],
        technology: 'Real-time tracking and dynamic routing',
        avgSavings: 0.16,
        minVolume: 300,
        contractTerms: [12, 24, 36],
        pricing: 'Tiered pricing based on service level',
        status: 'available',
        listedDate: new Date('2024-02-12')
      },
      {
        id: 'sc-opp-009',
        title: 'Pharmaceutical Cold Chain',
        provider: 'MedTrans Logistics',
        providerType: 'Specialized Carrier',
        services: ['Air Freight', 'Temperature Controlled', 'Courier'],
        coverage: 'Nationwide with air network',
        carrierNetwork: 'Multi-modal partnerships',
        specialCapabilities: ['Cold Chain', 'Security', 'Chain of Custody', 'Validation'],
        technology: 'End-to-end visibility and compliance',
        avgSavings: 0.10,
        minVolume: 100,
        contractTerms: [24, 36],
        pricing: 'Per-shipment with guaranteed service',
        status: 'available',
        listedDate: new Date('2024-01-18')
      },
      {
        id: 'sc-opp-010',
        title: 'Intermodal & International',
        provider: 'Global Freight Partners',
        providerType: '3PL',
        services: ['Intermodal', 'FTL', 'Drayage'],
        coverage: 'Nationwide with port access',
        carrierNetwork: 'Rail and trucking partnerships',
        specialCapabilities: ['Export Documentation', 'Container Management', 'Customs Brokerage'],
        technology: 'Integrated tracking across modes',
        avgSavings: 0.22,
        minVolume: 150,
        contractTerms: [12, 24, 36],
        pricing: 'Per-container with volume discounts',
        status: 'available',
        listedDate: new Date('2024-02-15')
      }
    ];

    return mockOpportunities.filter(opp => {
      if (criteria.service && !opp.services.includes(criteria.service)) return false;
      if (criteria.coverage && opp.coverage !== criteria.coverage) return false;
      if (criteria.providerType && opp.providerType !== criteria.providerType) return false;
      return true;
    });
  }

  async scoreMatch(lead, opportunity) {
    let score = 0;
    const factors = [];

    // Service type match (30 points)
    const serviceMatch = lead.freightTypes.some(type => opportunity.services.includes(type));
    if (serviceMatch) {
      const matchCount = lead.freightTypes.filter(type => opportunity.services.includes(type)).length;
      const points = Math.min(30, matchCount * 15);
      score += points;
      factors.push({ factor: 'Service Type Match', points, status: points >= 24 ? 'excellent' : 'good' });
    } else {
      factors.push({ factor: 'Service Type Match', points: 0, status: 'poor' });
    }

    // Special requirements (25 points)
    const reqMatch = lead.specialRequirements.every(req => 
      opportunity.specialCapabilities.includes(req)
    );
    if (reqMatch) {
      score += 25;
      factors.push({ factor: 'Special Requirements Met', points: 25, status: 'excellent' });
    } else {
      const matchCount = lead.specialRequirements.filter(req => 
        opportunity.specialCapabilities.includes(req)
      ).length;
      const points = Math.round(25 * (matchCount / lead.specialRequirements.length));
      score += points;
      factors.push({ 
        factor: 'Special Requirements', 
        points, 
        status: points >= 20 ? 'good' : 'fair' 
      });
    }

    // Volume match (20 points)
    if (lead.monthlyShipments >= opportunity.minVolume * 2) {
      score += 20;
      factors.push({ factor: 'Volume Requirements', points: 20, status: 'excellent' });
    } else if (lead.monthlyShipments >= opportunity.minVolume) {
      score += 15;
      factors.push({ factor: 'Volume Requirements', points: 15, status: 'good' });
    } else {
      score += 5;
      factors.push({ factor: 'Volume Requirements', points: 5, status: 'poor' });
    }

    // Potential cost savings (15 points)
    const potentialSavings = lead.annualSpend * opportunity.avgSavings;
    if (potentialSavings >= 500000) {
      score += 15;
      factors.push({ factor: 'Cost Savings Potential', points: 15, status: 'excellent' });
    } else if (potentialSavings >= 200000) {
      score += 12;
      factors.push({ factor: 'Cost Savings Potential', points: 12, status: 'good' });
    } else {
      score += 8;
      factors.push({ factor: 'Cost Savings Potential', points: 8, status: 'fair' });
    }

    // Pain point resolution (10 points)
    const canResolvePainPoints = lead.painPoints.length > 0;
    if (canResolvePainPoints) {
      score += 10;
      factors.push({ factor: 'Addresses Pain Points', points: 10, status: 'excellent' });
    } else {
      score += 5;
      factors.push({ factor: 'Standard Service', points: 5, status: 'good' });
    }

    return {
      score,
      maxScore: 100,
      percentage: Math.round(score),
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
      factors,
      recommendation: score >= 75 ? 'Highly Recommended - Excellent Fit' : 
                     score >= 55 ? 'Recommended - Good Match' : 
                     'Review Carefully',
      estimatedAnnualSavings: Math.round(lead.annualSpend * opportunity.avgSavings),
      estimatedCommission: this.calculateCommission({ value: lead.annualSpend })
    };
  }
}

export default SupplyChainDivision;
