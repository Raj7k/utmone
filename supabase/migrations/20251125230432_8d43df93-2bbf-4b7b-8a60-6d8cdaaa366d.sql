-- Add GA4 Measurement Protocol fields to workspaces table for server-side GTM tracking
ALTER TABLE workspaces
ADD COLUMN IF NOT EXISTS ga4_measurement_id TEXT,
ADD COLUMN IF NOT EXISTS ga4_api_secret TEXT;

COMMENT ON COLUMN workspaces.ga4_measurement_id IS 'GA4 Measurement ID for server-side event tracking (format: G-XXXXXXXXXX)';
COMMENT ON COLUMN workspaces.ga4_api_secret IS 'GA4 API Secret for Measurement Protocol authentication';