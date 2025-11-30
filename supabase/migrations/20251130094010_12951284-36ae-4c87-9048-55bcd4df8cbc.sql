-- Add visitor_id to link_clicks for full-funnel tracking
ALTER TABLE link_clicks ADD COLUMN IF NOT EXISTS visitor_id UUID;

-- Create index for visitor_id lookups
CREATE INDEX IF NOT EXISTS idx_link_clicks_visitor_id ON link_clicks(visitor_id);

-- Create pixel_configs table for tracking pixel management
CREATE TABLE IF NOT EXISTS pixel_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  pixel_id TEXT UNIQUE NOT NULL,
  domain_whitelist TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create index for pixel lookups
CREATE INDEX IF NOT EXISTS idx_pixel_configs_pixel_id ON pixel_configs(pixel_id);
CREATE INDEX IF NOT EXISTS idx_pixel_configs_workspace ON pixel_configs(workspace_id);

-- Enable RLS on pixel_configs
ALTER TABLE pixel_configs ENABLE ROW LEVEL SECURITY;

-- RLS policies for pixel_configs
CREATE POLICY "Users can view pixel configs in their workspace"
  ON pixel_configs FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create pixel configs in their workspace"
  ON pixel_configs FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update pixel configs in their workspace"
  ON pixel_configs FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- Add visitor_id to conversion_events if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversion_events' AND column_name = 'visitor_id') THEN
    ALTER TABLE conversion_events ADD COLUMN visitor_id UUID;
    CREATE INDEX idx_conversion_events_visitor_id ON conversion_events(visitor_id);
  END IF;
END $$;