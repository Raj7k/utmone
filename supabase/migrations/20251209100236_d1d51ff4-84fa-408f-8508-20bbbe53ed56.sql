-- Add enrichment tracking columns to event_badge_scans
ALTER TABLE event_badge_scans ADD COLUMN IF NOT EXISTS enriched boolean DEFAULT false;
ALTER TABLE event_badge_scans ADD COLUMN IF NOT EXISTS enrichment_source text;
ALTER TABLE event_badge_scans ADD COLUMN IF NOT EXISTS enriched_at timestamp with time zone;
ALTER TABLE event_badge_scans ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE event_badge_scans ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE event_badge_scans ADD COLUMN IF NOT EXISTS enrichment_error text;

-- Create index for filtering by enrichment status
CREATE INDEX IF NOT EXISTS idx_badge_scans_enriched ON event_badge_scans(enriched) WHERE enriched = false;