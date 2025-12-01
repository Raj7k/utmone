-- Create attribution_journeys table for multi-touch attribution
CREATE TABLE IF NOT EXISTS public.attribution_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  touchpoints JSONB NOT NULL DEFAULT '[]'::jsonb,
  converted BOOLEAN NOT NULL DEFAULT false,
  revenue NUMERIC(10, 2) DEFAULT 0,
  journey_start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  journey_end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  conversion_event_id UUID REFERENCES public.conversion_events(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_attribution_journeys_visitor ON public.attribution_journeys(visitor_id);
CREATE INDEX idx_attribution_journeys_workspace ON public.attribution_journeys(workspace_id);
CREATE INDEX idx_attribution_journeys_converted ON public.attribution_journeys(converted);
CREATE INDEX idx_attribution_journeys_journey_end ON public.attribution_journeys(journey_end_at DESC);

-- Enable RLS
ALTER TABLE public.attribution_journeys ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view journeys in their workspace"
  ON public.attribution_journeys
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert journeys"
  ON public.attribution_journeys
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update journeys"
  ON public.attribution_journeys
  FOR UPDATE
  USING (true);

-- Add index on link_clicks for visitor_id lookups (use clicked_at column)
CREATE INDEX IF NOT EXISTS idx_link_clicks_visitor_clicked 
  ON public.link_clicks(visitor_id, clicked_at DESC) 
  WHERE visitor_id IS NOT NULL;