-- Add ALL missing columns to leads table
-- Run this entire script in Supabase SQL Editor

ALTER TABLE leads ADD COLUMN IF NOT EXISTS access text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS access_other text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS bathrooms text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS bedrooms text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS clear_out text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS client text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS device text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS extra_rooms text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS extra_rooms_other text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fullness text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_media boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS high_value text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS high_value_other text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS home_value text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ip text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS isp text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS latitude numeric;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS likely_vpn boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS longitude numeric;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS media_count integer;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS oversized text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS oversized_other text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS page_url text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS postal text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referrer text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS timeline text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_agent text;

-- Verify all columns exist
SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' ORDER BY column_name;

