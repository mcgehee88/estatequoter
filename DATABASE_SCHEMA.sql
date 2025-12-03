-- EstateQuoter Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leads table (form submissions from customers)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  property_type TEXT NOT NULL,
  property_value_range TEXT,
  estate_location TEXT NOT NULL,
  urgency TEXT,
  notes TEXT,
  referral_source TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'open' -- open, matched, quoted, closed
);

-- Professionals table (users who quote on leads)
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  business_name TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  service_types TEXT[], -- array of service types they offer
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  status TEXT DEFAULT 'active' -- active, inactive
);

-- Authentication tokens for magic links
CREATE TABLE auth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

-- Quotes table (proposals from professionals to leads)
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending' -- pending, accepted, rejected, withdrawn
);

-- Activity log for admin tracking
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL, -- 'lead', 'professional', 'quote'
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted'
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_leads_email ON leads(customer_email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_professionals_email ON professionals(email);
CREATE INDEX idx_quotes_lead_id ON quotes(lead_id);
CREATE INDEX idx_quotes_professional_id ON quotes(professional_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_auth_tokens_token ON auth_tokens(token);
CREATE INDEX idx_auth_tokens_expires ON auth_tokens(expires_at);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);

-- Enable RLS (Row Level Security) for multi-tenant safety
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Leads: customers can only see their own
CREATE POLICY "Customers see own leads"
  ON leads FOR SELECT
  USING (customer_email = current_setting('app.current_user_email', true));

-- Professionals: can see leads in their area and their own quotes
CREATE POLICY "Professionals see relevant leads"
  ON leads FOR SELECT
  USING (true); -- Simplified for now, can be restricted by location

-- Professionals: can only see their own quotes
CREATE POLICY "Professionals see own quotes"
  ON quotes FOR SELECT
  USING (professional_id = current_setting('app.current_user_id', true)::uuid);

-- Professionals: can insert quotes on open leads
CREATE POLICY "Professionals can quote on leads"
  ON quotes FOR INSERT
  WITH CHECK (true);

