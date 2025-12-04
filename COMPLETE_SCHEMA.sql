-- Complete EstateQuoter Schema - RUN THIS ENTIRE SCRIPT AT ONCE
-- Copy and paste all of this into Supabase SQL Editor

ALTER TABLE leads ADD COLUMN IF NOT EXISTS zip text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS needs text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_type text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS square_footage text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS bedrooms text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS bathrooms text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS access text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS customer_phone text;

-- Verify columns
SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' ORDER BY column_name;

