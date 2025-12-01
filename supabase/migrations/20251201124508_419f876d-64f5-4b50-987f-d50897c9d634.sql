-- Add soft delete and traffic scoring to links table
ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS traffic_score INTEGER DEFAULT 0;

-- Create workspace hygiene notifications table
CREATE TABLE IF NOT EXISTS public.workspace_hygiene_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('stale_links', 'deprecated_tags', 'broken_qr_codes')),
  item_count INTEGER NOT NULL DEFAULT 0,
  item_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  dismissed BOOLEAN DEFAULT false,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_hygiene_notifications_workspace_dismissed 
ON public.workspace_hygiene_notifications(workspace_id, dismissed);

-- Create index for soft-deleted links
CREATE INDEX IF NOT EXISTS idx_links_deleted_at 
ON public.links(deleted_at) WHERE deleted_at IS NOT NULL;

-- Create index for stale link detection
CREATE INDEX IF NOT EXISTS idx_links_stale_detection 
ON public.links(created_at, total_clicks) WHERE deleted_at IS NULL;

-- Function to calculate traffic score
CREATE OR REPLACE FUNCTION public.calculate_traffic_score(p_link_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_clicks INTEGER;
  v_unique_clicks INTEGER;
  v_recent_clicks INTEGER;
  v_has_qr BOOLEAN;
  v_score INTEGER := 0;
BEGIN
  -- Get link metrics
  SELECT 
    COALESCE(total_clicks, 0),
    COALESCE(unique_clicks, 0),
    COALESCE((SELECT COUNT(*) FROM link_clicks WHERE link_id = p_link_id AND clicked_at > now() - interval '30 days'), 0),
    EXISTS(SELECT 1 FROM qr_codes WHERE link_id = p_link_id)
  INTO v_total_clicks, v_unique_clicks, v_recent_clicks, v_has_qr
  FROM links
  WHERE id = p_link_id;
  
  -- Calculate score
  v_score := v_total_clicks + (v_unique_clicks * 2) + (v_recent_clicks * 5);
  
  -- Bonus for having QR codes (physical assets)
  IF v_has_qr THEN
    v_score := v_score + 20;
  END IF;
  
  RETURN v_score;
END;
$$;

-- Function to update traffic scores
CREATE OR REPLACE FUNCTION public.update_traffic_scores()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE links
  SET traffic_score = calculate_traffic_score(id)
  WHERE deleted_at IS NULL;
END;
$$;

-- Function to detect stale links (using correct column names)
CREATE OR REPLACE FUNCTION public.detect_stale_links(p_workspace_id UUID)
RETURNS TABLE(link_id UUID, title TEXT, short_url TEXT, created_at TIMESTAMP WITH TIME ZONE, last_clicked_at TIMESTAMP WITH TIME ZONE)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    title,
    short_url,
    created_at,
    last_clicked_at
  FROM links
  WHERE workspace_id = p_workspace_id
    AND deleted_at IS NULL
    AND created_at < now() - interval '90 days'
    AND (
      last_clicked_at IS NULL 
      OR last_clicked_at < now() - interval '30 days'
    )
    AND traffic_score < 10
  ORDER BY created_at DESC;
$$;

-- Enable RLS on hygiene notifications
ALTER TABLE public.workspace_hygiene_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for workspace hygiene notifications
CREATE POLICY "Users can view their workspace hygiene notifications"
ON public.workspace_hygiene_notifications
FOR SELECT
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
    UNION
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their workspace hygiene notifications"
ON public.workspace_hygiene_notifications
FOR UPDATE
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
    UNION
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  )
);

-- Trigger to update traffic scores on click
CREATE OR REPLACE FUNCTION public.update_link_traffic_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE links
  SET traffic_score = calculate_traffic_score(NEW.link_id)
  WHERE id = NEW.link_id;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_traffic_score
AFTER INSERT ON link_clicks
FOR EACH ROW
EXECUTE FUNCTION update_link_traffic_score();