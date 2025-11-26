-- Add URL versioning and duplicate handling support
-- This enables Ultimate edition features for enterprise duplicate management

-- Add version control columns to links table
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_link_id UUID REFERENCES links(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_ab_test BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS duplicate_strategy TEXT DEFAULT 'smart';

-- Create index for parent-child relationships
CREATE INDEX IF NOT EXISTS idx_links_parent_link_id ON links(parent_link_id) WHERE parent_link_id IS NOT NULL;

-- Create index for version lookups
CREATE INDEX IF NOT EXISTS idx_links_destination_version ON links(destination_url, version);

-- Create url_duplicate_config table for workspace-level duplicate handling settings
CREATE TABLE IF NOT EXISTS url_duplicate_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  strategy TEXT NOT NULL DEFAULT 'smart',
  compare_utm BOOLEAN DEFAULT true,
  compare_campaign BOOLEAN DEFAULT true,
  compare_schedule BOOLEAN DEFAULT true,
  auto_version BOOLEAN DEFAULT true,
  suggest_alternatives BOOLEAN DEFAULT true,
  track_lineage BOOLEAN DEFAULT true,
  merge_analytics BOOLEAN DEFAULT false,
  smart_routing BOOLEAN DEFAULT true,
  ab_test_mode BOOLEAN DEFAULT false,
  max_versions INTEGER DEFAULT 10,
  archive_old BOOLEAN DEFAULT true,
  notify_on_duplicate BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(workspace_id)
);

-- Enable RLS on url_duplicate_config
ALTER TABLE url_duplicate_config ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can manage duplicate config for their workspaces
CREATE POLICY "Users can manage duplicate config in their workspace"
ON url_duplicate_config
FOR ALL
USING (has_workspace_access(auth.uid(), workspace_id));

-- Create function to get next version number for a URL
CREATE OR REPLACE FUNCTION get_next_url_version(
  p_workspace_id UUID,
  p_destination_url TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_max_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version), 0) INTO v_max_version
  FROM links
  WHERE workspace_id = p_workspace_id 
    AND destination_url = p_destination_url;
  
  RETURN v_max_version + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment on new columns
COMMENT ON COLUMN links.version IS 'URL version number for duplicate management (v1, v2, v3...)';
COMMENT ON COLUMN links.parent_link_id IS 'References parent link for version tracking and lineage';
COMMENT ON COLUMN links.is_ab_test IS 'Indicates if this link is part of an A/B test variant';
COMMENT ON COLUMN links.duplicate_strategy IS 'Strategy used when this link was created (smart, ask, always-new, use-existing)';
