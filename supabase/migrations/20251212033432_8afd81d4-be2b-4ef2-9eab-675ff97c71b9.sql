-- Add Sentinel Mode columns to links table
ALTER TABLE public.links 
ADD COLUMN IF NOT EXISTS sentinel_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sentinel_config jsonb DEFAULT '{}'::jsonb;

-- Create sentinel_saves table for tracking saved clicks
CREATE TABLE IF NOT EXISTS public.sentinel_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid REFERENCES public.links(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
  save_type text NOT NULL CHECK (save_type IN ('inventory', 'health', 'ai_bot', 'auto_heal')),
  original_destination text NOT NULL,
  redirected_to text NOT NULL,
  estimated_value decimal(10,2) DEFAULT 0,
  visitor_info jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  saved_at timestamptz DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_sentinel_saves_link ON public.sentinel_saves(link_id);
CREATE INDEX IF NOT EXISTS idx_sentinel_saves_workspace ON public.sentinel_saves(workspace_id);
CREATE INDEX IF NOT EXISTS idx_sentinel_saves_type ON public.sentinel_saves(save_type);
CREATE INDEX IF NOT EXISTS idx_sentinel_saves_date ON public.sentinel_saves(saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_links_sentinel ON public.links(sentinel_enabled) WHERE sentinel_enabled = true;

-- Enable RLS
ALTER TABLE public.sentinel_saves ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sentinel_saves
CREATE POLICY "Users can view sentinel saves for their workspaces"
ON public.sentinel_saves
FOR SELECT
USING (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "System can insert sentinel saves"
ON public.sentinel_saves
FOR INSERT
WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE public.sentinel_saves IS 'Tracks clicks saved by Sentinel Mode from dead ends, out-of-stock, broken links';
COMMENT ON COLUMN public.sentinel_saves.save_type IS 'Type of save: inventory (stock-aware), health (404/500), ai_bot (LLM optimization), auto_heal (sitemap recovery)';
COMMENT ON COLUMN public.sentinel_saves.estimated_value IS 'Estimated dollar value of the saved click based on workspace avg click value';