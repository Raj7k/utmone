-- Add is_system_domain flag to domains table
ALTER TABLE domains ADD COLUMN is_system_domain boolean DEFAULT false;

-- Mark go.utm.one and utm.click as system domains
UPDATE domains SET is_system_domain = true WHERE domain IN ('go.utm.one', 'utm.click');

-- Create index for system domain queries
CREATE INDEX idx_domains_system ON domains(is_system_domain) WHERE is_system_domain = true;

-- Add comment for clarity
COMMENT ON COLUMN domains.is_system_domain IS 'System-level default domains available to all workspaces (go.utm.one, utm.click)';