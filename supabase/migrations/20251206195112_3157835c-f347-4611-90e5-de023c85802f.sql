-- =====================================================
-- ROBUST ATTRIBUTION STACK: Complete Database Schema
-- =====================================================

-- 1. IDENTITY EDGES TABLE (Probabilistic Identity Graph)
-- Links visitors across devices with confidence scores
CREATE TABLE public.identity_edges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_visitor_id UUID NOT NULL,
  target_visitor_id UUID NOT NULL,
  match_type TEXT NOT NULL DEFAULT 'probabilistic' CHECK (match_type IN ('deterministic', 'probabilistic')),
  confidence NUMERIC NOT NULL DEFAULT 0.0 CHECK (confidence >= 0.0 AND confidence <= 1.0),
  signals JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  CONSTRAINT unique_edge UNIQUE (source_visitor_id, target_visitor_id, workspace_id)
);

-- Index for fast lookups
CREATE INDEX idx_identity_edges_source ON public.identity_edges(source_visitor_id);
CREATE INDEX idx_identity_edges_target ON public.identity_edges(target_visitor_id);
CREATE INDEX idx_identity_edges_workspace ON public.identity_edges(workspace_id);
CREATE INDEX idx_identity_edges_confidence ON public.identity_edges(confidence) WHERE confidence >= 0.7;

-- RLS for identity_edges
ALTER TABLE public.identity_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view identity edges in their workspace"
ON public.identity_edges FOR SELECT
USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Service role can insert identity edges"
ON public.identity_edges FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update identity edges"
ON public.identity_edges FOR UPDATE
USING (true);

-- 2. OFFLINE CONVERSIONS TABLE (Offline Data Ingestion)
-- Stores imported offline conversion data
CREATE TABLE public.offline_conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  revenue NUMERIC,
  conversion_date TIMESTAMP WITH TIME ZONE NOT NULL,
  source_file TEXT,
  matched_visitor_id UUID,
  matched_user_id UUID,
  match_status TEXT NOT NULL DEFAULT 'pending' CHECK (match_status IN ('pending', 'matched', 'unmatched')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  imported_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_offline_conversions_workspace ON public.offline_conversions(workspace_id);
CREATE INDEX idx_offline_conversions_email ON public.offline_conversions(email);
CREATE INDEX idx_offline_conversions_status ON public.offline_conversions(match_status);

-- RLS for offline_conversions
ALTER TABLE public.offline_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view offline conversions in their workspace"
ON public.offline_conversions FOR SELECT
USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can insert offline conversions in their workspace"
ON public.offline_conversions FOR INSERT
WITH CHECK (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can update offline conversions in their workspace"
ON public.offline_conversions FOR UPDATE
USING (has_workspace_access(auth.uid(), workspace_id));

-- 3. IMPORT BATCHES TABLE (Track import jobs)
CREATE TABLE public.import_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  total_rows INTEGER NOT NULL DEFAULT 0,
  matched_rows INTEGER NOT NULL DEFAULT 0,
  unmatched_rows INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  imported_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_import_batches_workspace ON public.import_batches(workspace_id);

-- RLS for import_batches
ALTER TABLE public.import_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view import batches in their workspace"
ON public.import_batches FOR SELECT
USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can insert import batches in their workspace"
ON public.import_batches FOR INSERT
WITH CHECK (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can update import batches in their workspace"
ON public.import_batches FOR UPDATE
USING (has_workspace_access(auth.uid(), workspace_id));

-- 4. ADD CONTENT_TAGS TO LINKS TABLE (Content Fingerprinting)
ALTER TABLE public.links 
ADD COLUMN IF NOT EXISTS content_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS content_title TEXT,
ADD COLUMN IF NOT EXISTS content_description TEXT,
ADD COLUMN IF NOT EXISTS content_analyzed_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_links_content_tags ON public.links USING GIN(content_tags);

-- 5. TOPIC ATTRIBUTION VIEW (Revenue by Topic)
CREATE OR REPLACE VIEW public.topic_attribution AS
SELECT 
  l.workspace_id,
  unnest(l.content_tags) as topic,
  COUNT(DISTINCT ce.id) as conversions,
  SUM(COALESCE(ce.event_value, 0)) as total_revenue,
  COUNT(DISTINCT l.id) as link_count
FROM public.links l
LEFT JOIN public.conversion_events ce ON ce.link_id = l.id
WHERE l.content_tags IS NOT NULL AND array_length(l.content_tags, 1) > 0
GROUP BY l.workspace_id, unnest(l.content_tags);

-- 6. CROSS-DEVICE ATTRIBUTION FUNCTION
-- Updates attribution calculation to include identity graph traversal
CREATE OR REPLACE FUNCTION public.get_unified_visitor_journeys(
  p_workspace_id UUID,
  p_visitor_id UUID
)
RETURNS TABLE (
  journey_visitor_id UUID,
  confidence NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return the original visitor and all linked visitors with confidence > 0.7
  RETURN QUERY
  SELECT p_visitor_id as journey_visitor_id, 1.0::NUMERIC as confidence
  UNION
  SELECT ie.target_visitor_id as journey_visitor_id, ie.confidence
  FROM identity_edges ie
  WHERE ie.source_visitor_id = p_visitor_id
    AND ie.workspace_id = p_workspace_id
    AND ie.confidence >= 0.7
  UNION
  SELECT ie.source_visitor_id as journey_visitor_id, ie.confidence
  FROM identity_edges ie
  WHERE ie.target_visitor_id = p_visitor_id
    AND ie.workspace_id = p_workspace_id
    AND ie.confidence >= 0.7;
END;
$$;

-- 7. ENHANCED ATTRIBUTION WITH CROSS-DEVICE SUPPORT
CREATE OR REPLACE FUNCTION public.calculate_cross_device_attribution(
  p_workspace_id UUID,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  source TEXT,
  medium TEXT,
  campaign TEXT,
  total_conversions BIGINT,
  cross_device_conversions BIGINT,
  credit NUMERIC,
  total_revenue NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH unified_journeys AS (
    -- Get all conversion events with unified visitor IDs
    SELECT 
      ce.id as conversion_id,
      ce.visitor_id,
      ce.event_value,
      COALESCE(
        (SELECT MAX(ie.confidence) 
         FROM identity_edges ie 
         WHERE (ie.source_visitor_id = ce.visitor_id OR ie.target_visitor_id = ce.visitor_id)
           AND ie.workspace_id = p_workspace_id
           AND ie.confidence >= 0.7),
        1.0
      ) as identity_confidence
    FROM conversion_events ce
    WHERE ce.workspace_id = p_workspace_id
      AND ce.attributed_at BETWEEN p_start_date AND p_end_date
  ),
  attributed_clicks AS (
    SELECT 
      l.utm_source as source,
      l.utm_medium as medium,
      l.utm_campaign as campaign,
      uj.conversion_id,
      uj.event_value,
      CASE WHEN uj.identity_confidence < 1.0 THEN 1 ELSE 0 END as is_cross_device
    FROM unified_journeys uj
    JOIN link_clicks lc ON lc.visitor_id = uj.visitor_id
    JOIN links l ON l.id = lc.link_id
    WHERE l.workspace_id = p_workspace_id
  )
  SELECT 
    COALESCE(ac.source, 'direct') as source,
    COALESCE(ac.medium, 'none') as medium,
    COALESCE(ac.campaign, 'none') as campaign,
    COUNT(DISTINCT ac.conversion_id)::BIGINT as total_conversions,
    SUM(ac.is_cross_device)::BIGINT as cross_device_conversions,
    1.0::NUMERIC as credit,
    SUM(COALESCE(ac.event_value, 0))::NUMERIC as total_revenue
  FROM attributed_clicks ac
  GROUP BY ac.source, ac.medium, ac.campaign
  ORDER BY total_revenue DESC;
END;
$$;