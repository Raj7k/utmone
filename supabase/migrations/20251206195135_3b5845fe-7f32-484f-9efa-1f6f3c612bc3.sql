-- Fix security definer view by converting to regular view with RLS
DROP VIEW IF EXISTS public.topic_attribution;

-- Create as a function instead for RLS enforcement
CREATE OR REPLACE FUNCTION public.get_topic_attribution(p_workspace_id UUID)
RETURNS TABLE (
  topic TEXT,
  conversions BIGINT,
  total_revenue NUMERIC,
  link_count BIGINT
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    unnest(l.content_tags) as topic,
    COUNT(DISTINCT ce.id)::BIGINT as conversions,
    SUM(COALESCE(ce.event_value, 0))::NUMERIC as total_revenue,
    COUNT(DISTINCT l.id)::BIGINT as link_count
  FROM public.links l
  LEFT JOIN public.conversion_events ce ON ce.link_id = l.id
  WHERE l.workspace_id = p_workspace_id
    AND l.content_tags IS NOT NULL 
    AND array_length(l.content_tags, 1) > 0
  GROUP BY unnest(l.content_tags)
  ORDER BY total_revenue DESC;
END;
$$;