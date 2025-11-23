-- Create ai_insights table for caching AI-generated analytics summaries
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL DEFAULT 'analytics_summary',
  summary_text TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_ai_insights_workspace_created 
ON public.ai_insights(workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_insights_expires 
ON public.ai_insights(expires_at);

-- Enable RLS
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view AI insights for their workspaces"
ON public.ai_insights FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
  OR workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "System can insert AI insights"
ON public.ai_insights FOR INSERT
WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.ai_insights IS 'Stores AI-generated analytics insights with 24-hour cache expiration';