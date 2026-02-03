-- Migration 022: Multi-Division Platform Schema
-- Creates tables for the multi-division broker platform
-- Supports 10+ divisions with universal search and cross-division synergy

-- Business divisions configuration table
CREATE TABLE IF NOT EXISTS business_divisions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT true,
    commission_rate DECIMAL(5,4) DEFAULT 0.10, -- 10% default
    config JSONB, -- Division-specific configuration
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on enabled divisions
CREATE INDEX idx_divisions_enabled ON business_divisions(enabled);

-- Universal leads table - stores leads across all divisions
CREATE TABLE IF NOT EXISTS universal_leads (
    id SERIAL PRIMARY KEY,
    division_id VARCHAR(50) REFERENCES business_divisions(id),
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255), -- Email or phone
    industry VARCHAR(100),
    location VARCHAR(255),
    size INTEGER, -- Employees or revenue
    budget DECIMAL(15,2),
    metadata JSONB, -- Division-specific data
    source VARCHAR(100), -- Data source name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for lead searches
CREATE INDEX idx_leads_division ON universal_leads(division_id);
CREATE INDEX idx_leads_industry ON universal_leads(industry);
CREATE INDEX idx_leads_location ON universal_leads(location);
CREATE INDEX idx_leads_created ON universal_leads(created_at DESC);
CREATE INDEX idx_leads_metadata ON universal_leads USING GIN(metadata);

-- Universal opportunities table - stores opportunities across divisions
CREATE TABLE IF NOT EXISTS universal_opportunities (
    id SERIAL PRIMARY KEY,
    division_id VARCHAR(50) REFERENCES business_divisions(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    value DECIMAL(15,2), -- Contract or deal value
    industry VARCHAR(100),
    location VARCHAR(255),
    deadline TIMESTAMP,
    requirements JSONB,
    metadata JSONB, -- Division-specific data
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for opportunity searches
CREATE INDEX idx_opps_division ON universal_opportunities(division_id);
CREATE INDEX idx_opps_industry ON universal_opportunities(industry);
CREATE INDEX idx_opps_location ON universal_opportunities(location);
CREATE INDEX idx_opps_value ON universal_opportunities(value);
CREATE INDEX idx_opps_deadline ON universal_opportunities(deadline);
CREATE INDEX idx_opps_metadata ON universal_opportunities USING GIN(metadata);

-- Lead-opportunity matches with scoring
CREATE TABLE IF NOT EXISTS lead_opportunity_matches (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES universal_leads(id),
    opportunity_id INTEGER REFERENCES universal_opportunities(id),
    division_id VARCHAR(50) REFERENCES business_divisions(id),
    score INTEGER CHECK (score >= 0 AND score <= 100), -- 0-100 match score
    recommendation VARCHAR(255),
    reasoning JSONB, -- Detailed scoring breakdown
    confidence VARCHAR(20), -- High, Medium, Low
    status VARCHAR(50) DEFAULT 'pending', -- pending, contacted, qualified, converted, rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for match queries
CREATE INDEX idx_matches_lead ON lead_opportunity_matches(lead_id);
CREATE INDEX idx_matches_opp ON lead_opportunity_matches(opportunity_id);
CREATE INDEX idx_matches_division ON lead_opportunity_matches(division_id);
CREATE INDEX idx_matches_score ON lead_opportunity_matches(score DESC);
CREATE INDEX idx_matches_status ON lead_opportunity_matches(status);

-- Universal deals table - tracks commissions and revenue
CREATE TABLE IF NOT EXISTS universal_deals (
    id SERIAL PRIMARY KEY,
    division_id VARCHAR(50) REFERENCES business_divisions(id),
    lead_id INTEGER REFERENCES universal_leads(id),
    opportunity_id INTEGER REFERENCES universal_opportunities(id),
    match_id INTEGER REFERENCES lead_opportunity_matches(id),
    value DECIMAL(15,2) NOT NULL, -- Deal value
    commission DECIMAL(15,2), -- Calculated commission
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, closed, lost
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

-- Create indexes for deal tracking
CREATE INDEX idx_deals_division ON universal_deals(division_id);
CREATE INDEX idx_deals_lead ON universal_deals(lead_id);
CREATE INDEX idx_deals_opp ON universal_deals(opportunity_id);
CREATE INDEX idx_deals_status ON universal_deals(status);
CREATE INDEX idx_deals_value ON universal_deals(value DESC);
CREATE INDEX idx_deals_created ON universal_deals(created_at DESC);

-- Division revenue tracking
CREATE TABLE IF NOT EXISTS division_revenue (
    id SERIAL PRIMARY KEY,
    division_id VARCHAR(50) REFERENCES business_divisions(id),
    deal_id INTEGER REFERENCES universal_deals(id),
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(50) DEFAULT 'commission', -- commission, recurring, one-time
    period VARCHAR(20), -- Month/Year for reporting (e.g., '2026-02')
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for revenue analytics
CREATE INDEX idx_revenue_division ON division_revenue(division_id);
CREATE INDEX idx_revenue_type ON division_revenue(type);
CREATE INDEX idx_revenue_period ON division_revenue(period);
CREATE INDEX idx_revenue_recorded ON division_revenue(recorded_at DESC);
CREATE INDEX idx_revenue_amount ON division_revenue(amount DESC);

-- Insert default divisions
INSERT INTO business_divisions (id, name, description, commission_rate) VALUES
    ('govcon', 'Government Contracts', 'Federal, state, and local government contract opportunities', 0.08),
    ('cre', 'Commercial Real Estate', 'Office, retail, industrial, and multi-family properties', 0.05),
    ('grants', 'Grant Writing', 'Federal, state, and private grant opportunities', 0.12),
    ('franchise', 'Franchise Brokerage', 'Franchise opportunities across industries', 0.15),
    ('equipment', 'Equipment Leasing', 'Construction, manufacturing, and office equipment', 0.06),
    ('supply-chain', 'Supply Chain Brokerage', 'Logistics, freight, and supply chain optimization', 0.10),
    ('recruiting', 'Executive Search', 'C-level and executive recruitment', 0.20),
    ('insurance', 'Commercial Insurance', 'Business insurance policies and risk management', 0.15),
    ('loans', 'Business Loans', 'Commercial lending and financing solutions', 0.03),
    ('energy', 'Solar/Energy', 'Solar panels, energy efficiency, and renewable energy', 0.08)
ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_business_divisions_updated_at BEFORE UPDATE ON business_divisions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_universal_leads_updated_at BEFORE UPDATE ON universal_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_universal_opportunities_updated_at BEFORE UPDATE ON universal_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_opportunity_matches_updated_at BEFORE UPDATE ON lead_opportunity_matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_universal_deals_updated_at BEFORE UPDATE ON universal_deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries

-- View: Active divisions with stats
CREATE OR REPLACE VIEW active_divisions_stats AS
SELECT 
    bd.id,
    bd.name,
    bd.commission_rate,
    COUNT(DISTINCT ul.id) as lead_count,
    COUNT(DISTINCT uo.id) as opportunity_count,
    COUNT(DISTINCT ud.id) as deal_count,
    SUM(ud.value) as total_deal_value,
    SUM(ud.commission) as total_commission
FROM business_divisions bd
LEFT JOIN universal_leads ul ON bd.id = ul.division_id
LEFT JOIN universal_opportunities uo ON bd.id = uo.division_id
LEFT JOIN universal_deals ud ON bd.id = ud.division_id
WHERE bd.enabled = true
GROUP BY bd.id, bd.name, bd.commission_rate;

-- View: Top matches by score
CREATE OR REPLACE VIEW top_matches AS
SELECT 
    lom.id,
    lom.score,
    lom.recommendation,
    lom.confidence,
    lom.status,
    ul.name as lead_name,
    ul.industry as lead_industry,
    uo.title as opportunity_title,
    uo.value as opportunity_value,
    bd.name as division_name,
    lom.created_at
FROM lead_opportunity_matches lom
JOIN universal_leads ul ON lom.lead_id = ul.id
JOIN universal_opportunities uo ON lom.opportunity_id = uo.id
JOIN business_divisions bd ON lom.division_id = bd.id
WHERE lom.score >= 60
ORDER BY lom.score DESC, lom.created_at DESC;

-- View: Revenue summary by division
CREATE OR REPLACE VIEW revenue_by_division AS
SELECT 
    bd.id as division_id,
    bd.name as division_name,
    dr.period,
    COUNT(dr.id) as entry_count,
    SUM(dr.amount) as total_revenue,
    AVG(dr.amount) as avg_revenue,
    MIN(dr.amount) as min_revenue,
    MAX(dr.amount) as max_revenue
FROM business_divisions bd
LEFT JOIN division_revenue dr ON bd.id = dr.division_id
GROUP BY bd.id, bd.name, dr.period
ORDER BY dr.period DESC, total_revenue DESC NULLS LAST;

-- Comments for documentation
COMMENT ON TABLE business_divisions IS 'Configuration for all business divisions';
COMMENT ON TABLE universal_leads IS 'Unified lead storage across all divisions';
COMMENT ON TABLE universal_opportunities IS 'Cross-division opportunities';
COMMENT ON TABLE lead_opportunity_matches IS 'Scored matches with AI reasoning';
COMMENT ON TABLE universal_deals IS 'Commission tracking and deal lifecycle';
COMMENT ON TABLE division_revenue IS 'Revenue analytics and forecasting';

COMMENT ON COLUMN lead_opportunity_matches.score IS 'Match score from 0-100 using weighted algorithm';
COMMENT ON COLUMN lead_opportunity_matches.reasoning IS 'JSON object with detailed scoring breakdown';
COMMENT ON COLUMN universal_deals.commission IS 'Calculated based on division commission_rate';

-- Grant permissions (adjust for your specific users)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
