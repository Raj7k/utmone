-- Feature 4: Smart Link Rotator - Add destinations and smart_rotate to links table
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS destinations JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS smart_rotate BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN links.destinations IS 'Array of destination URLs with weights and stats: [{"url": "https://a.com", "weight": 50, "clicks": 0, "conversions": 0}]';
COMMENT ON COLUMN links.smart_rotate IS 'Enable Thompson Sampling auto-optimization for A/B testing';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_links_smart_rotate ON links(smart_rotate) WHERE smart_rotate = TRUE;