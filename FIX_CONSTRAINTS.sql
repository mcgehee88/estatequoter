-- Fix database constraints to match form
-- Run this in Supabase SQL Editor

ALTER TABLE leads ALTER COLUMN estate_location DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN estate_location SET DEFAULT 'Not specified';

-- Verify
SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'estate_location';

