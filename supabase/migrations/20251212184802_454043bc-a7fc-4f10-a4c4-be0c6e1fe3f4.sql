-- Create click_queue table for batch processing clicks
CREATE TABLE IF NOT EXISTS public.click_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT,
  is_unique BOOLEAN DEFAULT false,
  og_variant_id UUID,
  qr_code_id UUID,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient queue processing
CREATE INDEX IF NOT EXISTS idx_click_queue_unprocessed ON public.click_queue(processed, created_at) WHERE processed = false;
CREATE INDEX IF NOT EXISTS idx_click_queue_link_id ON public.click_queue(link_id);
CREATE INDEX IF NOT EXISTS idx_click_queue_workspace_id ON public.click_queue(workspace_id);

-- Enable RLS
ALTER TABLE public.click_queue ENABLE ROW LEVEL SECURITY;

-- RLS policy: only service role can access (edge functions)
CREATE POLICY "Service role only" ON public.click_queue
  FOR ALL USING (false);

COMMENT ON TABLE public.click_queue IS 'Queue for batch processing link clicks - processed by edge function';