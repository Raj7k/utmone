-- Add geo_targets column to links table for geo-based redirects
ALTER TABLE links ADD COLUMN IF NOT EXISTS geo_targets jsonb DEFAULT '{}'::jsonb;

-- Create index for faster geo_targets queries
CREATE INDEX IF NOT EXISTS idx_links_geo_targets ON links USING GIN (geo_targets);

-- Add comment
COMMENT ON COLUMN links.geo_targets IS 'JSON object mapping country codes to destination URLs. Example: {"US": "https://us.example.com", "GB": "https://uk.example.com"}';

-- Insert geo_targeting feature gate (PRO tier feature)
INSERT INTO feature_gates (feature_key, min_plan_tier, description)
VALUES ('geo_targeting', 'pro', 'Create geo-targeted links with country-specific destination URLs')
ON CONFLICT (feature_key) DO UPDATE SET
  min_plan_tier = EXCLUDED.min_plan_tier,
  description = EXCLUDED.description;