-- Create conversion_events table for tracking conversions
CREATE TABLE IF NOT EXISTS public.conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  click_id UUID REFERENCES public.link_clicks(id) ON DELETE SET NULL,
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'lead', 'signup', 'purchase', 'custom'
  event_name TEXT, -- Custom event name
  event_value DECIMAL(10, 2), -- Revenue for purchase events
  currency TEXT DEFAULT 'USD',
  metadata JSONB DEFAULT '{}',
  user_identifier TEXT, -- Email, user_id, etc for deduplication
  attributed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_conversion_events_link_id ON public.conversion_events(link_id);
CREATE INDEX idx_conversion_events_workspace_id ON public.conversion_events(workspace_id);
CREATE INDEX idx_conversion_events_click_id ON public.conversion_events(click_id);
CREATE INDEX idx_conversion_events_created_at ON public.conversion_events(created_at DESC);
CREATE INDEX idx_conversion_events_event_type ON public.conversion_events(event_type);

-- Add conversion tracking columns to links table
ALTER TABLE public.links 
ADD COLUMN IF NOT EXISTS total_conversions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS conversion_rate DECIMAL(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_revenue DECIMAL(12, 2) DEFAULT 0;

-- Enable RLS on conversion_events
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view conversions for links in their workspaces
CREATE POLICY "Users can view conversions in their workspaces"
ON public.conversion_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = conversion_events.link_id
    AND has_workspace_access(auth.uid(), links.workspace_id)
  )
);

-- Policy: Service role can insert conversion events (for API)
CREATE POLICY "Service role can insert conversion events"
ON public.conversion_events
FOR INSERT
WITH CHECK (true);

-- Function to update link conversion stats
CREATE OR REPLACE FUNCTION public.update_link_conversion_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total_conversions and total_revenue on the link
  UPDATE public.links
  SET 
    total_conversions = COALESCE((
      SELECT COUNT(*) 
      FROM public.conversion_events 
      WHERE link_id = NEW.link_id
    ), 0),
    total_revenue = COALESCE((
      SELECT SUM(event_value) 
      FROM public.conversion_events 
      WHERE link_id = NEW.link_id AND event_type = 'purchase'
    ), 0),
    conversion_rate = CASE 
      WHEN total_clicks > 0 THEN 
        ROUND((COALESCE((
          SELECT COUNT(*) 
          FROM public.conversion_events 
          WHERE link_id = NEW.link_id
        ), 0)::DECIMAL / total_clicks) * 100, 2)
      ELSE 0
    END,
    updated_at = NOW()
  WHERE id = NEW.link_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update conversion stats when new event is inserted
CREATE TRIGGER update_conversion_stats_trigger
AFTER INSERT ON public.conversion_events
FOR EACH ROW
EXECUTE FUNCTION public.update_link_conversion_stats();