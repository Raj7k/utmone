-- utm.one Self-Hosted Seed Data
-- Default configuration and system domains

-- Insert system domains (available to all workspaces)
-- Note: Replace these with your actual domains
INSERT INTO domains (workspace_id, domain, is_verified, is_primary, created_by)
VALUES 
    (NULL, 'utm.one', TRUE, TRUE, '00000000-0000-0000-0000-000000000000'),
    (NULL, 'utm.click', TRUE, FALSE, '00000000-0000-0000-0000-000000000000')
ON CONFLICT (domain) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE workspaces IS 'Multi-tenant workspaces for organizing links and teams';
COMMENT ON TABLE domains IS 'Custom domains for branded short links';
COMMENT ON TABLE links IS 'Short links with UTM tracking';
COMMENT ON TABLE link_clicks IS 'Analytics data for link clicks';
COMMENT ON TABLE qr_codes IS 'Generated QR codes for short links';
