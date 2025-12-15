-- Create link_page_blocks table for storing page blocks
CREATE TABLE public.link_page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.link_pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('link', 'header', 'text', 'image', 'divider', 'social')),
  order_index INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}',
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for ordering
CREATE INDEX idx_link_page_blocks_page_order ON public.link_page_blocks(page_id, order_index);

-- Enable RLS
ALTER TABLE public.link_page_blocks ENABLE ROW LEVEL SECURITY;

-- RLS policy: Users can manage blocks for their workspace pages
CREATE POLICY "Users can manage blocks for their workspace pages"
  ON public.link_page_blocks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.link_pages lp
    WHERE lp.id = link_page_blocks.page_id
    AND has_workspace_access(auth.uid(), lp.workspace_id)
  ));

-- RLS policy: Public can view blocks for published pages
CREATE POLICY "Public can view blocks for published pages"
  ON public.link_page_blocks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.link_pages lp
    WHERE lp.id = link_page_blocks.page_id
    AND lp.is_published = true
  ));

-- Create link_page_events table for analytics
CREATE TABLE public.link_page_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.link_pages(id) ON DELETE CASCADE,
  block_id UUID REFERENCES public.link_page_blocks(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'block_click')),
  visitor_hash TEXT,
  user_agent_hash TEXT,
  referrer TEXT,
  country TEXT,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX idx_link_page_events_page_time ON public.link_page_events(page_id, created_at DESC);
CREATE INDEX idx_link_page_events_block ON public.link_page_events(block_id) WHERE block_id IS NOT NULL;
CREATE INDEX idx_link_page_events_type ON public.link_page_events(event_type, created_at DESC);

-- Enable RLS
ALTER TABLE public.link_page_events ENABLE ROW LEVEL SECURITY;

-- RLS policy: Public can insert events (for tracking)
CREATE POLICY "Public can insert events"
  ON public.link_page_events FOR INSERT
  WITH CHECK (true);

-- RLS policy: Users can view events for their workspace pages
CREATE POLICY "Users can view events for their workspace pages"
  ON public.link_page_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.link_pages lp
    WHERE lp.id = link_page_events.page_id
    AND has_workspace_access(auth.uid(), lp.workspace_id)
  ));

-- Trigger for updated_at on blocks
CREATE TRIGGER update_link_page_blocks_updated_at
  BEFORE UPDATE ON public.link_page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();