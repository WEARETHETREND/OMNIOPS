/**
 * Commercial Real Estate Division
 * 
 * Connects property investors, developers, and tenants with commercial properties
 * Focus: Office, retail, industrial, and multi-family properties
 */

import BaseDivision from '../../core/BaseDivision.js';

class CREDivision extends BaseDivision {
  constructor() {
    super({
      id: 'cre',
      name: 'Commercial Real Estate',
      description: 'Commercial property brokerage and investment',
      commissionRate: 0.05, // 5% commission
      dataSources: ['CoStar', 'LoopNet', 'CBRE', 'Zillow Commercial']
    });
  }

  async findLeads(criteria = {}) {
    const mockLeads = [
      {
        id: 'cre-lead-001',
        name: 'MetroWest Capital Partners',
        type: 'Investor',
        contact: { name: 'Jennifer Walsh', email: 'jwalsh@metrowest.com', phone: '212-555-0101' },
        investmentFocus: ['Office', 'Multi-Family'],
        budget: { min: 5000000, max: 50000000 },
        preferredLocations: ['New York, NY', 'Boston, MA', 'Washington, DC'],
        investmentType: 'Core',
        leverageTarget: 0.65,
        status: 'active',
        createdAt: new Date('2024-01-12')
      },
      {
        id: 'cre-lead-002',
        name: 'Pinnacle Development Group',
        type: 'Developer',
        contact: { name: 'Mark Thompson', email: 'mthompson@pinnacledev.com', phone: '404-555-0202' },
        investmentFocus: ['Mixed-Use', 'Multi-Family'],
        budget: { min: 10000000, max: 100000000 },
        preferredLocations: ['Atlanta, GA', 'Charlotte, NC', 'Nashville, TN'],
        investmentType: 'Value-Add',
        leverageTarget: 0.75,
        status: 'active',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'cre-lead-003',
        name: 'TechHub Corporate Services',
        type: 'Tenant',
        contact: { name: 'Sarah Kim', email: 'skim@techhub.com', phone: '415-555-0303' },
        investmentFocus: ['Office'],
        budget: { min: 0, max: 15000000 },
        preferredLocations: ['San Francisco, CA', 'San Jose, CA', 'Austin, TX'],
        spaceRequired: 75000,
        leaseType: 'Full Service Gross',
        status: 'active',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'cre-lead-004',
        name: 'Industrial Properties Fund',
        type: 'Investor',
        contact: { name: 'Robert Cruz', email: 'rcruz@indprop.com', phone: '469-555-0404' },
        investmentFocus: ['Industrial', 'Warehouse'],
        budget: { min: 8000000, max: 75000000 },
        preferredLocations: ['Dallas, TX', 'Phoenix, AZ', 'Las Vegas, NV'],
        investmentType: 'Core Plus',
        leverageTarget: 0.70,
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'cre-lead-005',
        name: 'Retail Ventures LLC',
        type: 'Investor',
        contact: { name: 'Amanda Foster', email: 'afoster@retailventures.com', phone: '305-555-0505' },
        investmentFocus: ['Retail', 'Shopping Center'],
        budget: { min: 3000000, max: 25000000 },
        preferredLocations: ['Miami, FL', 'Orlando, FL', 'Tampa, FL'],
        investmentType: 'Opportunistic',
        leverageTarget: 0.80,
        status: 'active',
        createdAt: new Date('2024-01-28')
      },
      {
        id: 'cre-lead-006',
        name: 'Apex Manufacturing',
        type: 'Tenant',
        contact: { name: 'David Martinez', email: 'dmartinez@apex-mfg.com', phone: '312-555-0606' },
        investmentFocus: ['Industrial'],
        budget: { min: 0, max: 8000000 },
        preferredLocations: ['Chicago, IL', 'Indianapolis, IN', 'Milwaukee, WI'],
        spaceRequired: 150000,
        leaseType: 'Triple Net',
        status: 'active',
        createdAt: new Date('2024-02-05')
      },
      {
        id: 'cre-lead-007',
        name: 'Sunrise Multifamily Investments',
        type: 'Investor',
        contact: { name: 'Lisa Anderson', email: 'landerson@sunrisemf.com', phone: '602-555-0707' },
        investmentFocus: ['Multi-Family'],
        budget: { min: 15000000, max: 120000000 },
        preferredLocations: ['Phoenix, AZ', 'Denver, CO', 'Salt Lake City, UT'],
        investmentType: 'Value-Add',
        leverageTarget: 0.70,
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'cre-lead-008',
        name: 'Premier Office Solutions',
        type: 'Tenant',
        contact: { name: 'James Wilson', email: 'jwilson@premieroff.com', phone: '713-555-0808' },
        investmentFocus: ['Office'],
        budget: { min: 0, max: 10000000 },
        preferredLocations: ['Houston, TX', 'Dallas, TX'],
        spaceRequired: 50000,
        leaseType: 'Modified Gross',
        status: 'active',
        createdAt: new Date('2024-02-08')
      },
      {
        id: 'cre-lead-009',
        name: 'Coastal Properties Group',
        type: 'Developer',
        contact: { name: 'Maria Gonzalez', email: 'mgonzalez@coastalprop.com', phone: '619-555-0909' },
        investmentFocus: ['Mixed-Use', 'Office'],
        budget: { min: 20000000, max: 150000000 },
        preferredLocations: ['San Diego, CA', 'Los Angeles, CA', 'Seattle, WA'],
        investmentType: 'Ground-Up Development',
        leverageTarget: 0.65,
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'cre-lead-010',
        name: 'National Logistics Group',
        type: 'Tenant',
        contact: { name: 'Christopher Lee', email: 'clee@natlogistics.com', phone: '973-555-1010' },
        investmentFocus: ['Industrial', 'Warehouse'],
        budget: { min: 0, max: 12000000 },
        preferredLocations: ['Newark, NJ', 'Philadelphia, PA', 'Baltimore, MD'],
        spaceRequired: 200000,
        leaseType: 'Triple Net',
        status: 'active',
        createdAt: new Date('2024-02-10')
      }
    ];

    return mockLeads.filter(lead => {
      if (criteria.type && lead.type !== criteria.type) return false;
      if (criteria.minBudget && lead.budget.max < criteria.minBudget) return false;
      if (criteria.propertyType && !lead.investmentFocus.includes(criteria.propertyType)) return false;
      return true;
    });
  }

  async findOpportunities(criteria = {}) {
    const mockOpportunities = [
      {
        id: 'cre-opp-001',
        title: 'Class A Office Building - Financial District',
        propertyType: 'Office',
        address: '100 Wall Street, New York, NY 10005',
        squareFeet: 250000,
        price: 125000000,
        pricePerSqFt: 500,
        capRate: 0.055,
        occupancy: 0.92,
        yearBuilt: 1985,
        yearRenovated: 2018,
        parking: 150,
        zoning: 'Commercial',
        condition: 'Excellent',
        tenantQuality: 'Investment Grade',
        leaseType: 'Full Service Gross',
        description: 'Prime Class A office building in Manhattan financial district',
        status: 'available',
        listedDate: new Date('2024-02-01')
      },
      {
        id: 'cre-opp-002',
        title: 'Luxury Multifamily Community',
        propertyType: 'Multi-Family',
        address: '500 Peachtree Street, Atlanta, GA 30308',
        units: 200,
        squareFeet: 180000,
        price: 45000000,
        pricePerUnit: 225000,
        capRate: 0.058,
        occupancy: 0.95,
        yearBuilt: 2019,
        parking: 250,
        amenities: ['Pool', 'Fitness Center', 'Rooftop Deck', 'Concierge'],
        condition: 'Excellent',
        description: 'Class A multifamily property in Midtown Atlanta',
        status: 'available',
        listedDate: new Date('2024-01-28')
      },
      {
        id: 'cre-opp-003',
        title: 'Tech-Ready Office Campus',
        propertyType: 'Office',
        address: '1000 Park Boulevard, San Francisco, CA 94103',
        squareFeet: 85000,
        price: 68000000,
        pricePerSqFt: 800,
        capRate: 0.048,
        occupancy: 0.88,
        yearBuilt: 2015,
        parking: 200,
        zoning: 'Commercial',
        condition: 'Excellent',
        tenantQuality: 'Tech Companies',
        leaseType: 'Modified Gross',
        description: 'Modern office campus designed for tech tenants',
        status: 'available',
        listedDate: new Date('2024-02-05')
      },
      {
        id: 'cre-opp-004',
        title: 'Industrial Distribution Center',
        propertyType: 'Industrial',
        address: '2500 Industrial Parkway, Dallas, TX 75247',
        squareFeet: 450000,
        price: 36000000,
        pricePerSqFt: 80,
        capRate: 0.065,
        occupancy: 1.0,
        yearBuilt: 2020,
        clearHeight: 32,
        docks: 60,
        parking: 150,
        condition: 'Excellent',
        description: 'Modern distribution facility with excellent logistics access',
        status: 'available',
        listedDate: new Date('2024-01-20')
      },
      {
        id: 'cre-opp-005',
        title: 'Neighborhood Shopping Center',
        propertyType: 'Retail',
        address: '750 Main Street, Miami, FL 33130',
        squareFeet: 75000,
        price: 18000000,
        pricePerSqFt: 240,
        capRate: 0.068,
        occupancy: 0.90,
        yearBuilt: 2005,
        yearRenovated: 2019,
        parking: 300,
        anchors: ['Grocery Store', 'Pharmacy'],
        condition: 'Good',
        description: 'Well-located neighborhood retail center',
        status: 'available',
        listedDate: new Date('2024-02-01')
      },
      {
        id: 'cre-opp-006',
        title: 'Warehouse & Distribution Facility',
        propertyType: 'Industrial',
        address: '1200 Logistics Drive, Chicago, IL 60632',
        squareFeet: 325000,
        price: 29250000,
        pricePerSqFt: 90,
        capRate: 0.062,
        occupancy: 1.0,
        yearBuilt: 2018,
        clearHeight: 30,
        docks: 48,
        parking: 125,
        condition: 'Excellent',
        description: 'Modern warehouse with rail access',
        status: 'available',
        listedDate: new Date('2024-01-25')
      },
      {
        id: 'cre-opp-007',
        title: 'Garden-Style Apartment Community',
        propertyType: 'Multi-Family',
        address: '3000 Mountain View Drive, Phoenix, AZ 85016',
        units: 150,
        squareFeet: 135000,
        price: 28500000,
        pricePerUnit: 190000,
        capRate: 0.062,
        occupancy: 0.93,
        yearBuilt: 2010,
        yearRenovated: 2021,
        parking: 225,
        amenities: ['Pool', 'Fitness Center', 'Clubhouse'],
        condition: 'Good',
        description: 'Value-add multifamily opportunity in growing market',
        status: 'available',
        listedDate: new Date('2024-02-08')
      },
      {
        id: 'cre-opp-008',
        title: 'Medical Office Building',
        propertyType: 'Office',
        address: '450 Healthcare Plaza, Houston, TX 77030',
        squareFeet: 62000,
        price: 21700000,
        pricePerSqFt: 350,
        capRate: 0.058,
        occupancy: 0.96,
        yearBuilt: 2016,
        parking: 200,
        zoning: 'Medical',
        condition: 'Excellent',
        tenantQuality: 'Healthcare Providers',
        leaseType: 'Triple Net',
        description: 'Class A medical office building near Texas Medical Center',
        status: 'available',
        listedDate: new Date('2024-02-02')
      },
      {
        id: 'cre-opp-009',
        title: 'Mixed-Use Development Site',
        propertyType: 'Mixed-Use',
        address: '800 Harbor Boulevard, San Diego, CA 92101',
        squareFeet: 0,
        landSize: 3.5,
        price: 35000000,
        capRate: null,
        zoning: 'Mixed-Use',
        allowedDensity: '100 units/acre',
        description: 'Prime development site for mixed-use project',
        entitlements: 'Approved for 350 residential units + 50,000 SF retail',
        status: 'available',
        listedDate: new Date('2024-01-15')
      },
      {
        id: 'cre-opp-010',
        title: 'Cold Storage Facility',
        propertyType: 'Industrial',
        address: '4000 Cold Chain Way, Newark, NJ 07114',
        squareFeet: 185000,
        price: 27750000,
        pricePerSqFt: 150,
        capRate: 0.060,
        occupancy: 1.0,
        yearBuilt: 2019,
        temperature: 'Multi-temp',
        docks: 25,
        parking: 75,
        condition: 'Excellent',
        description: 'State-of-the-art cold storage facility',
        status: 'available',
        listedDate: new Date('2024-02-12')
      }
    ];

    return mockOpportunities.filter(opp => {
      if (criteria.propertyType && opp.propertyType !== criteria.propertyType) return false;
      if (criteria.minPrice && opp.price < criteria.minPrice) return false;
      if (criteria.maxPrice && opp.price > criteria.maxPrice) return false;
      if (criteria.location && !opp.address.includes(criteria.location)) return false;
      return true;
    });
  }

  async scoreMatch(lead, opportunity) {
    let score = 0;
    const factors = [];

    // Property type match (30 points)
    if (lead.investmentFocus.includes(opportunity.propertyType)) {
      score += 30;
      factors.push({ factor: 'Property Type Match', points: 30, status: 'excellent' });
    } else {
      factors.push({ factor: 'Property Type Match', points: 0, status: 'poor' });
    }

    // Budget/Price alignment (25 points)
    if (lead.type === 'Tenant') {
      // For tenants, check if they can afford the space
      if (opportunity.squareFeet && lead.spaceRequired) {
        const sizeDiff = Math.abs(opportunity.squareFeet - lead.spaceRequired) / lead.spaceRequired;
        if (sizeDiff <= 0.15) {
          score += 25;
          factors.push({ factor: 'Space Size Match', points: 25, status: 'excellent' });
        } else if (sizeDiff <= 0.30) {
          score += 15;
          factors.push({ factor: 'Space Size Match', points: 15, status: 'good' });
        } else {
          score += 5;
          factors.push({ factor: 'Space Size Match', points: 5, status: 'fair' });
        }
      }
    } else {
      // For investors/developers, check budget
      if (opportunity.price >= lead.budget.min && opportunity.price <= lead.budget.max) {
        score += 25;
        factors.push({ factor: 'Price Within Budget', points: 25, status: 'excellent' });
      } else if (opportunity.price <= lead.budget.max * 1.2) {
        score += 15;
        factors.push({ factor: 'Price Slightly Above Budget', points: 15, status: 'good' });
      } else {
        score += 5;
        factors.push({ factor: 'Price Outside Budget', points: 5, status: 'poor' });
      }
    }

    // Location match (20 points)
    const locationMatch = lead.preferredLocations.some(loc => 
      opportunity.address.includes(loc.split(',')[0])
    );
    if (locationMatch) {
      score += 20;
      factors.push({ factor: 'Location Match', points: 20, status: 'excellent' });
    } else {
      score += 5;
      factors.push({ factor: 'Location Match', points: 5, status: 'fair' });
    }

    // Investment quality metrics (15 points)
    if (opportunity.capRate) {
      if (opportunity.capRate >= 0.06) {
        score += 15;
        factors.push({ factor: 'Strong Cap Rate', points: 15, status: 'excellent' });
      } else if (opportunity.capRate >= 0.05) {
        score += 10;
        factors.push({ factor: 'Good Cap Rate', points: 10, status: 'good' });
      } else {
        score += 5;
        factors.push({ factor: 'Market Rate Cap Rate', points: 5, status: 'fair' });
      }
    } else {
      factors.push({ factor: 'Cap Rate', points: 0, status: 'N/A' });
    }

    // Property condition/occupancy (10 points)
    if (opportunity.occupancy >= 0.90 && opportunity.condition === 'Excellent') {
      score += 10;
      factors.push({ factor: 'Property Quality', points: 10, status: 'excellent' });
    } else if (opportunity.occupancy >= 0.80) {
      score += 7;
      factors.push({ factor: 'Property Quality', points: 7, status: 'good' });
    } else {
      score += 3;
      factors.push({ factor: 'Property Quality', points: 3, status: 'fair' });
    }

    return {
      score,
      maxScore: 100,
      percentage: Math.round(score),
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
      factors,
      recommendation: score >= 70 ? 'Highly Recommended' : score >= 50 ? 'Recommended' : 'Consider with Caution',
      estimatedCommission: this.calculateCommission({ value: opportunity.price })
    };
  }
}

export default CREDivision;
