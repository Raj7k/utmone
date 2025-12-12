-- Add indexes for fast link_clicks queries by workspace_id
CREATE INDEX IF NOT EXISTS idx_link_clicks_workspace_id ON public.link_clicks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_workspace_clicked_at ON public.link_clicks(workspace_id, clicked_at DESC);

-- Add index for links workspace queries
CREATE INDEX IF NOT EXISTS idx_links_workspace_status ON public.links(workspace_id, status);