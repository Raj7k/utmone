-- Phase 1.1: Link Preview Hover Cards - Create link_previews table
CREATE TABLE link_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  destination_url TEXT NOT NULL,
  page_title TEXT,
  favicon_url TEXT,
  og_image_url TEXT,
  is_ssl_secure BOOLEAN DEFAULT false,
  is_safe BOOLEAN DEFAULT true,
  threats JSONB DEFAULT '[]',
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  UNIQUE(link_id)
);

CREATE INDEX idx_link_previews_link_id ON link_previews(link_id);
CREATE INDEX idx_link_previews_expires ON link_previews(expires_at);

-- Enable RLS
ALTER TABLE link_previews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for link_previews
CREATE POLICY "Users can view previews for their workspace links"
  ON link_previews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM links l
      JOIN workspaces w ON l.workspace_id = w.id
      WHERE l.id = link_previews.link_id
      AND (
        w.owner_id = auth.uid() OR
        EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = w.id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Service role can manage all previews"
  ON link_previews FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Phase 1.2: Trust Badges System - Add security_status to links
CREATE TYPE security_status AS ENUM ('safe', 'threats_detected', 'not_scanned', 'pending');

ALTER TABLE links ADD COLUMN security_status security_status DEFAULT 'not_scanned';

CREATE INDEX idx_links_security_status ON links(security_status);