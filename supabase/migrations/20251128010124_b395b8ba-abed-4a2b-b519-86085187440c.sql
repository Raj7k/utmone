-- Add workspace_id to link_clicks for efficient workspace-scoped analytics
ALTER TABLE link_clicks ADD COLUMN workspace_id UUID REFERENCES workspaces(id);

-- Create indexes for workspace-scoped analytics queries
CREATE INDEX idx_link_clicks_workspace ON link_clicks(workspace_id);
CREATE INDEX idx_link_clicks_workspace_date ON link_clicks(workspace_id, clicked_at DESC);

-- Backfill existing data from links table
UPDATE link_clicks lc 
SET workspace_id = l.workspace_id 
FROM links l 
WHERE lc.link_id = l.id AND lc.workspace_id IS NULL;

-- Create function to auto-populate workspace_id on new click inserts
CREATE OR REPLACE FUNCTION set_click_workspace_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.workspace_id IS NULL THEN
    SELECT workspace_id INTO NEW.workspace_id 
    FROM links WHERE id = NEW.link_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-populate workspace_id
CREATE TRIGGER trigger_set_click_workspace_id
BEFORE INSERT ON link_clicks
FOR EACH ROW
EXECUTE FUNCTION set_click_workspace_id();

-- Add additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_link_id ON link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON link_clicks(clicked_at DESC);