/**
 * Business Loans Division
 * 
 * Connects businesses needing capital with lenders and loan products
 * Focus: Term loans, lines of credit, SBA loans, equipment financing
 */

import BaseDivision from '../../core/BaseDivision.js';

class LoansDivision extends BaseDivision {
  constructor() {
    super({
      id: 'loans',
      name: 'Business Loans',
      description: 'Business financing and capital placement',
      commissionRate: 0.03, // 3% of funded amount
      dataSources: ['Lender Networks', 'SBA Registry', 'Alternative Lending Platforms']
    });
  }

  async findLeads(criteria = {}) {
    const mockLeads = [
      {
        id: 'loan-lead-001',
        name: 'TechGrowth Solutions',
        type: 'Technology',
        contact: { name: 'Jennifer Liu', email: 'jliu@techgrowth.com', phone: '408-555-0101' },
        yearsInBusiness: 6,
        revenue: 5800000,
        monthlyRevenue: 480000,
        creditScore: 720,
        loanAmount: 500000,
        loanPurpose: 'Expansion',
        useOfFunds: 'Hiring, marketing, new office space',
        timeInBusiness: 72,
        profitability: 'Profitable',
        collateral: 'Accounts receivable, equipment',
        personalGuarantee: 'Yes',
        urgency: 'Medium',
        location: 'San Jose, CA',
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'loan-lead-002',
        name: 'BuildRight Construction',
        type: 'Construction',
        contact: { name: 'Michael Torres', email: 'mtorres@buildright.com', phone: '713-555-0202' },
        yearsInBusiness: 15,
        revenue: 12000000,
        monthlyRevenue: 1000000,
        creditScore: 690,
        loanAmount: 1200000,
        loanPurpose: 'Equipment Purchase',
        useOfFunds: 'New heavy equipment fleet',
        timeInBusiness: 180,
        profitability: 'Profitable',
        collateral: 'Equipment, real estate',
        personalGuarantee: 'Yes',
        urgency: 'High',
        location: 'Houston, TX',
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'loan-lead-003',
        name: 'Fresh Foods Market',
        type: 'Retail',
        contact: { name: 'Sarah Martinez', email: 'smartinez@freshfoods.com', phone: '206-555-0303' },
        yearsInBusiness: 8,
        revenue: 3200000,
        monthlyRevenue: 265000,
        creditScore: 705,
        loanAmount: 250000,
        loanPurpose: 'Working Capital',
        useOfFunds: 'Inventory, seasonal needs',
        timeInBusiness: 96,
        profitability: 'Break-even',
        collateral: 'Inventory, equipment',
        personalGuarantee: 'Yes',
        urgency: 'High',
        location: 'Seattle, WA',
        status: 'active',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'loan-lead-004',
        name: 'Advanced Manufacturing Inc',
        type: 'Manufacturing',
        contact: { name: 'Robert Chen', email: 'rchen@advmfg.com', phone: '414-555-0404' },
        yearsInBusiness: 22,
        revenue: 28000000,
        monthlyRevenue: 2300000,
        creditScore: 740,
        loanAmount: 2500000,
        loanPurpose: 'Business Acquisition',
        useOfFunds: 'Acquire competitor',
        timeInBusiness: 264,
        profitability: 'Highly Profitable',
        collateral: 'Real estate, equipment, inventory',
        personalGuarantee: 'Yes',
        urgency: 'Medium',
        location: 'Milwaukee, WI',
        status: 'active',
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'loan-lead-005',
        name: 'Metro Medical Practice',
        type: 'Healthcare',
        contact: { name: 'Dr. Amanda Foster', email: 'afoster@metromedical.com', phone: '617-555-0505' },
        yearsInBusiness: 4,
        revenue: 2400000,
        monthlyRevenue: 200000,
        creditScore: 715,
        loanAmount: 400000,
        loanPurpose: 'Equipment & Expansion',
        useOfFunds: 'Medical equipment, office build-out',
        timeInBusiness: 48,
        profitability: 'Profitable',
        collateral: 'Equipment, future receivables',
        personalGuarantee: 'Yes',
        urgency: 'Medium',
        location: 'Boston, MA',
        status: 'active',
        createdAt: new Date('2024-01-28')
      },
      {
        id: 'loan-lead-006',
        name: 'QuickServe Restaurant Group',
        type: 'Restaurant',
        contact: { name: 'Carlos Rivera', email: 'crivera@quickserve.com', phone: '305-555-0606' },
        yearsInBusiness: 7,
        revenue: 4500000,
        monthlyRevenue: 375000,
        creditScore: 680,
        loanAmount: 350000,
        loanPurpose: 'New Location',
        useOfFunds: 'Build-out, equipment, working capital',
        timeInBusiness: 84,
        profitability: 'Profitable',
        collateral: 'Equipment, franchise rights',
        personalGuarantee: 'Yes',
        urgency: 'High',
        location: 'Miami, FL',
        status: 'active',
        createdAt: new Date('2024-02-05')
      },
      {
        id: 'loan-lead-007',
        name: 'LogiTrans Freight Services',
        type: 'Transportation',
        contact: { name: 'David Kim', email: 'dkim@logitrans.com', phone: '404-555-0707' },
        yearsInBusiness: 11,
        revenue: 8500000,
        monthlyRevenue: 710000,
        creditScore: 695,
        loanAmount: 750000,
        loanPurpose: 'Fleet Expansion',
        useOfFunds: 'Purchase additional trucks',
        timeInBusiness: 132,
        profitability: 'Profitable',
        collateral: 'Fleet vehicles',
        personalGuarantee: 'Yes',
        urgency: 'Medium',
        location: 'Atlanta, GA',
        status: 'active',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'loan-lead-008',
        name: 'DigitalWorks Agency',
        type: 'Professional Services',
        contact: { name: 'Lisa Anderson', email: 'landerson@digitalworks.com', phone: '512-555-0808' },
        yearsInBusiness: 5,
        revenue: 3800000,
        monthlyRevenue: 315000,
        creditScore: 710,
        loanAmount: 200000,
        loanPurpose: 'Growth Capital',
        useOfFunds: 'Staff expansion, technology',
        timeInBusiness: 60,
        profitability: 'Profitable',
        collateral: 'Accounts receivable',
        personalGuarantee: 'Yes',
        urgency: 'Low',
        location: 'Austin, TX',
        status: 'active',
        createdAt: new Date('2024-02-08')
      },
      {
        id: 'loan-lead-009',
        name: 'GreenTech Solar Installations',
        type: 'Energy',
        contact: { name: 'Jennifer Rodriguez', email: 'jrodriguez@greentech.com', phone: '720-555-0909' },
        yearsInBusiness: 3,
        revenue: 4200000,
        monthlyRevenue: 350000,
        creditScore: 695,
        loanAmount: 600000,
        loanPurpose: 'Working Capital & Growth',
        useOfFunds: 'Project financing, inventory',
        timeInBusiness: 36,
        profitability: 'Break-even',
        collateral: 'Equipment, contracts',
        personalGuarantee: 'Yes',
        urgency: 'High',
        location: 'Denver, CO',
        status: 'active',
        createdAt: new Date('2024-01-25')
      },
      {
        id: 'loan-lead-010',
        name: 'Precision Machine Shop',
        type: 'Manufacturing',
        contact: { name: 'Thomas Bradley', email: 'tbradley@precision-ms.com', phone: '313-555-1010' },
        yearsInBusiness: 18,
        revenue: 6800000,
        monthlyRevenue: 565000,
        creditScore: 725,
        loanAmount: 800000,
        loanPurpose: 'Equipment & Real Estate',
        useOfFunds: 'Buy building, new CNC machines',
        timeInBusiness: 216,
        profitability: 'Profitable',
        collateral: 'Real estate, equipment',
        personalGuarantee: 'Yes',
        urgency: 'Medium',
        location: 'Detroit, MI',
        status: 'active',
        createdAt: new Date('2024-02-10')
      }
    ];

    return mockLeads.filter(lead => {
      if (criteria.type && lead.type !== criteria.type) return false;
      if (criteria.minAmount && lead.loanAmount < criteria.minAmount) return false;
      if (criteria.maxAmount && lead.loanAmount > criteria.maxAmount) return false;
      if (criteria.minCreditScore && lead.creditScore < criteria.minCreditScore) return false;
      return true;
    });
  }

  async findOpportunities(criteria = {}) {
    const mockOpportunities = [
      {
        id: 'loan-opp-001',
        title: 'SBA 7(a) Loan Program',
        lender: 'National Business Bank',
        lenderType: 'SBA Preferred Lender',
        productType: 'SBA 7(a)',
        loanRange: { min: 50000, max: 5000000 },
        interestRate: { min: 0.0675, max: 0.095 },
        term: { min: 84, max: 300 },
        minCreditScore: 680,
        minTimeInBusiness: 24,
        collateral: 'Required for loans over $350k',
        personalGuarantee: 'Required',
        downPayment: 0.10,
        approvalTime: '30-45 days',
        bestFor: ['Expansion', 'Equipment', 'Real Estate', 'Working Capital'],
        restrictions: 'SBA eligibility required',
        advantages: ['Lower rates', 'Longer terms', 'Lower down payment'],
        status: 'available',
        listedDate: new Date('2024-02-01')
      },
      {
        id: 'loan-opp-002',
        title: 'Equipment Financing',
        lender: 'EquipLend Financial',
        lenderType: 'Specialty Lender',
        productType: 'Equipment Loan',
        loanRange: { min: 100000, max: 5000000 },
        interestRate: { min: 0.055, max: 0.085 },
        term: { min: 36, max: 84 },
        minCreditScore: 650,
        minTimeInBusiness: 12,
        collateral: 'Equipment being financed',
        personalGuarantee: 'Required',
        downPayment: 0.15,
        approvalTime: '3-5 days',
        bestFor: ['Equipment Purchase'],
        restrictions: 'Equipment must be for business use',
        advantages: ['Fast approval', 'Equipment as collateral', '100% financing available'],
        status: 'available',
        listedDate: new Date('2024-01-28')
      },
      {
        id: 'loan-opp-003',
        title: 'Business Line of Credit',
        lender: 'FlexCredit Partners',
        lenderType: 'Traditional Bank',
        productType: 'Line of Credit',
        loanRange: { min: 50000, max: 1000000 },
        interestRate: { min: 0.075, max: 0.115 },
        term: { min: 12, max: 36 },
        minCreditScore: 700,
        minTimeInBusiness: 24,
        collateral: 'Blanket lien on assets',
        personalGuarantee: 'Required',
        downPayment: 0,
        approvalTime: '7-10 days',
        bestFor: ['Working Capital', 'Seasonal needs'],
        restrictions: 'Revenue covenants apply',
        advantages: ['Revolving credit', 'Pay interest only on used funds', 'Flexible draws'],
        status: 'available',
        listedDate: new Date('2024-02-05')
      },
      {
        id: 'loan-opp-004',
        title: 'Commercial Real Estate Loan',
        lender: 'PropertyFinance Group',
        lenderType: 'Commercial Bank',
        productType: 'Real Estate Loan',
        loanRange: { min: 500000, max: 10000000 },
        interestRate: { min: 0.065, max: 0.085 },
        term: { min: 120, max: 300 },
        minCreditScore: 700,
        minTimeInBusiness: 36,
        collateral: 'Property being financed',
        personalGuarantee: 'Required',
        downPayment: 0.20,
        approvalTime: '30-60 days',
        bestFor: ['Real Estate', 'Building Purchase'],
        restrictions: 'Owner-occupied only',
        advantages: ['Long amortization', 'Fixed rates available', 'Tax benefits'],
        status: 'available',
        listedDate: new Date('2024-01-20')
      },
      {
        id: 'loan-opp-005',
        title: 'Revenue-Based Financing',
        lender: 'GrowthCapital Ventures',
        lenderType: 'Alternative Lender',
        productType: 'Revenue-Based',
        loanRange: { min: 50000, max: 500000 },
        interestRate: { min: 0.12, max: 0.20 },
        term: { min: 12, max: 24 },
        minCreditScore: 600,
        minTimeInBusiness: 12,
        collateral: 'Not required',
        personalGuarantee: 'Limited',
        downPayment: 0,
        approvalTime: '2-3 days',
        bestFor: ['Working Capital', 'Growth'],
        restrictions: 'Minimum $30k monthly revenue',
        advantages: ['Fast funding', 'No fixed payments', 'Revenue-based repayment'],
        status: 'available',
        listedDate: new Date('2024-02-08')
      },
      {
        id: 'loan-opp-006',
        title: 'Business Acquisition Loan',
        lender: 'M&A Finance Partners',
        lenderType: 'SBA Preferred Lender',
        productType: 'SBA 7(a) Acquisition',
        loanRange: { min: 250000, max: 5000000 },
        interestRate: { min: 0.07, max: 0.095 },
        term: { min: 84, max: 120 },
        minCreditScore: 700,
        minTimeInBusiness: 24,
        collateral: 'Business assets & real estate',
        personalGuarantee: 'Required',
        downPayment: 0.10,
        approvalTime: '45-60 days',
        bestFor: ['Business Acquisition'],
        restrictions: 'Seller note may be required',
        advantages: ['Finance up to 90%', 'Include working capital', 'Seller financing allowed'],
        status: 'available',
        listedDate: new Date('2024-01-25')
      },
      {
        id: 'loan-opp-007',
        title: 'Term Loan - Growth Capital',
        lender: 'Business Growth Lenders',
        lenderType: 'Traditional Bank',
        productType: 'Term Loan',
        loanRange: { min: 100000, max: 2000000 },
        interestRate: { min: 0.07, max: 0.105 },
        term: { min: 36, max: 84 },
        minCreditScore: 680,
        minTimeInBusiness: 36,
        collateral: 'Business assets',
        personalGuarantee: 'Required',
        downPayment: 0,
        approvalTime: '10-14 days',
        bestFor: ['Expansion', 'Equipment', 'Working Capital'],
        restrictions: 'Profitable operations required',
        advantages: ['Fixed payments', 'Competitive rates', 'No prepayment penalty'],
        status: 'available',
        listedDate: new Date('2024-02-10')
      },
      {
        id: 'loan-opp-008',
        title: 'Invoice Factoring',
        lender: 'ReceivablesFirst Funding',
        lenderType: 'Factor',
        productType: 'Factoring',
        loanRange: { min: 25000, max: 2000000 },
        interestRate: { min: 0.02, max: 0.05 },
        term: { min: 1, max: 3 },
        minCreditScore: 550,
        minTimeInBusiness: 6,
        collateral: 'Accounts receivable',
        personalGuarantee: 'Limited',
        downPayment: 0,
        approvalTime: '1-2 days',
        bestFor: ['Working Capital', 'Cash flow needs'],
        restrictions: 'B2B invoices only',
        advantages: ['Immediate cash', 'No debt on balance sheet', 'Credit not main factor'],
        status: 'available',
        listedDate: new Date('2024-02-12')
      },
      {
        id: 'loan-opp-009',
        title: 'SBA 504 Loan - Real Estate',
        lender: 'Community Development Corp',
        lenderType: 'CDC / SBA Lender',
        productType: 'SBA 504',
        loanRange: { min: 500000, max: 5500000 },
        interestRate: { min: 0.055, max: 0.075 },
        term: { min: 120, max: 300 },
        minCreditScore: 680,
        minTimeInBusiness: 24,
        collateral: 'Real estate & equipment',
        personalGuarantee: 'Required',
        downPayment: 0.10,
        approvalTime: '45-90 days',
        bestFor: ['Real Estate', 'Equipment'],
        restrictions: 'Must create/retain jobs',
        advantages: ['Lower down payment', 'Fixed rates', 'Long-term financing'],
        status: 'available',
        listedDate: new Date('2024-01-18')
      },
      {
        id: 'loan-opp-010',
        title: 'Merchant Cash Advance',
        lender: 'FastFund MCA',
        lenderType: 'Alternative Lender',
        productType: 'Merchant Cash Advance',
        loanRange: { min: 10000, max: 500000 },
        interestRate: { min: 0.15, max: 0.35 },
        term: { min: 3, max: 12 },
        minCreditScore: 500,
        minTimeInBusiness: 6,
        collateral: 'Not required',
        personalGuarantee: 'Required',
        downPayment: 0,
        approvalTime: '24-48 hours',
        bestFor: ['Emergency capital', 'Short-term needs'],
        restrictions: 'Minimum monthly card sales',
        advantages: ['Very fast funding', 'Easy approval', 'No fixed payments'],
        status: 'available',
        listedDate: new Date('2024-02-15')
      }
    ];

    return mockOpportunities.filter(opp => {
      if (criteria.productType && opp.productType !== criteria.productType) return false;
      if (criteria.minAmount && opp.loanRange.max < criteria.minAmount) return false;
      if (criteria.maxAmount && opp.loanRange.min > criteria.maxAmount) return false;
      return true;
    });
  }

  async scoreMatch(lead, opportunity) {
    let score = 0;
    const factors = [];

    // Loan amount fit (30 points)
    if (lead.loanAmount >= opportunity.loanRange.min && lead.loanAmount <= opportunity.loanRange.max) {
      score += 30;
      factors.push({ factor: 'Loan Amount Fit', points: 30, status: 'excellent' });
    } else if (lead.loanAmount >= opportunity.loanRange.min * 0.8 && lead.loanAmount <= opportunity.loanRange.max * 1.1) {
      score += 20;
      factors.push({ factor: 'Loan Amount Close', points: 20, status: 'good' });
    } else {
      score += 5;
      factors.push({ factor: 'Loan Amount Mismatch', points: 5, status: 'poor' });
    }

    // Credit score qualification (25 points)
    if (lead.creditScore >= opportunity.minCreditScore + 30) {
      score += 25;
      factors.push({ factor: 'Strong Credit', points: 25, status: 'excellent' });
    } else if (lead.creditScore >= opportunity.minCreditScore + 10) {
      score += 20;
      factors.push({ factor: 'Good Credit', points: 20, status: 'good' });
    } else if (lead.creditScore >= opportunity.minCreditScore) {
      score += 15;
      factors.push({ factor: 'Meets Credit Min', points: 15, status: 'fair' });
    } else {
      score += 5;
      factors.push({ factor: 'Below Credit Requirement', points: 5, status: 'poor' });
    }

    // Time in business (20 points)
    if (lead.timeInBusiness >= opportunity.minTimeInBusiness * 2) {
      score += 20;
      factors.push({ factor: 'Strong Business History', points: 20, status: 'excellent' });
    } else if (lead.timeInBusiness >= opportunity.minTimeInBusiness * 1.5) {
      score += 17;
      factors.push({ factor: 'Good Business History', points: 17, status: 'good' });
    } else if (lead.timeInBusiness >= opportunity.minTimeInBusiness) {
      score += 14;
      factors.push({ factor: 'Meets Time Requirement', points: 14, status: 'fair' });
    } else {
      score += 5;
      factors.push({ factor: 'Insufficient Time in Business', points: 5, status: 'poor' });
    }

    // Purpose/product match (15 points)
    const purposeMatch = opportunity.bestFor.includes(lead.loanPurpose);
    if (purposeMatch) {
      score += 15;
      factors.push({ factor: 'Purpose Match', points: 15, status: 'excellent' });
    } else {
      score += 7;
      factors.push({ factor: 'Purpose Compatible', points: 7, status: 'fair' });
    }

    // Urgency vs approval time (10 points)
    const approvalDays = parseInt(opportunity.approvalTime);
    if (lead.urgency === 'High' && approvalDays <= 5) {
      score += 10;
      factors.push({ factor: 'Fast Funding Match', points: 10, status: 'excellent' });
    } else if (lead.urgency === 'Medium' && approvalDays <= 14) {
      score += 10;
      factors.push({ factor: 'Timeline Match', points: 10, status: 'excellent' });
    } else if (lead.urgency === 'Low') {
      score += 8;
      factors.push({ factor: 'Timeline Acceptable', points: 8, status: 'good' });
    } else {
      score += 4;
      factors.push({ factor: 'Timeline Mismatch', points: 4, status: 'fair' });
    }

    const avgRate = (opportunity.interestRate.min + opportunity.interestRate.max) / 2;
    const monthlyPayment = this.calculateMonthlyPayment(
      lead.loanAmount, 
      avgRate, 
      opportunity.term.max
    );

    return {
      score,
      maxScore: 100,
      percentage: Math.round(score),
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor',
      factors,
      recommendation: score >= 75 ? 'Highly Recommended - Strong Fit' : 
                     score >= 55 ? 'Good Option - Present to Client' : 
                     'Consider Other Options',
      estimatedRate: `${(avgRate * 100).toFixed(2)}%`,
      estimatedMonthlyPayment: Math.round(monthlyPayment),
      estimatedCommission: this.calculateCommission({ value: lead.loanAmount })
    };
  }

  calculateMonthlyPayment(principal, annualRate, months) {
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return principal / months;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  }
}

export default LoansDivision;
