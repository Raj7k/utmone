-- Aggregate link hero stats in a single RPC
CREATE OR REPLACE FUNCTION public.get_links_hero_stats(p_workspace_id uuid)
RETURNS TABLE (
  total_active_links integer,
  this_week_clicks integer,
  last_week_clicks integer,
  click_trend integer,
  top_link_id uuid,
  top_link_title text,
  top_link_short_url text,
  top_link_total_clicks bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seven_days_ago timestamptz := NOW() - INTERVAL '7 days';
  fourteen_days_ago timestamptz := NOW() - INTERVAL '14 days';
BEGIN
  IF NOT public.has_workspace_access(auth.uid(), p_workspace_id) THEN
    RAISE EXCEPTION 'Access denied for workspace %', p_workspace_id;
  END IF;

  SELECT COUNT(*) INTO total_active_links
  FROM public.links
  WHERE workspace_id = p_workspace_id
    AND status = 'active';

  SELECT COUNT(*) INTO this_week_clicks
  FROM public.link_clicks
  WHERE workspace_id = p_workspace_id
    AND clicked_at >= seven_days_ago;

  SELECT COUNT(*) INTO last_week_clicks
  FROM public.link_clicks
  WHERE workspace_id = p_workspace_id
    AND clicked_at >= fourteen_days_ago
    AND clicked_at < seven_days_ago;

  click_trend := CASE
    WHEN last_week_clicks > 0 THEN ROUND(((this_week_clicks - last_week_clicks)::numeric / last_week_clicks) * 100)
    ELSE 0
  END;

  SELECT l.id, l.title, l.short_url, l.total_clicks
  INTO top_link_id, top_link_title, top_link_short_url, top_link_total_clicks
  FROM public.links l
  WHERE l.workspace_id = p_workspace_id
    AND l.status = 'active'
  ORDER BY l.total_clicks DESC NULLS LAST
  LIMIT 1;

  RETURN NEXT;
END;
$$;
