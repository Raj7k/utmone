-- Create RPC function to consolidate dashboard data into 1 call
CREATE OR REPLACE FUNCTION get_dashboard_summary(p_workspace_id uuid, p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
  v_links_count integer;
  v_clicks_today integer;
  v_qr_count integer;
  v_domains_count integer;
  v_pixel_count integer;
  v_has_viewed_analytics boolean;
  v_has_invited_team boolean;
  v_recent_links jsonb;
BEGIN
  -- 1. Total links count
  SELECT COUNT(*)::integer INTO v_links_count
  FROM links
  WHERE workspace_id = p_workspace_id AND deleted_at IS NULL;
  
  -- 2. Clicks today
  SELECT COUNT(*)::integer INTO v_clicks_today
  FROM link_clicks
  WHERE workspace_id = p_workspace_id
    AND clicked_at >= DATE_TRUNC('day', NOW());
  
  -- 3. QR codes count
  SELECT COUNT(*)::integer INTO v_qr_count
  FROM qr_codes
  WHERE workspace_id = p_workspace_id;
  
  -- 4. Custom domains count
  SELECT COUNT(*)::integer INTO v_domains_count
  FROM domains
  WHERE workspace_id = p_workspace_id
    AND is_verified = true
    AND domain NOT IN ('go.utm.one', 'utm.click');
  
  -- 5. Pixel configs count
  SELECT COUNT(*)::integer INTO v_pixel_count
  FROM pixel_configs
  WHERE workspace_id = p_workspace_id;
  
  -- 6. Profile onboarding flags
  IF p_user_id IS NOT NULL THEN
    SELECT 
      first_analytics_viewed_at IS NOT NULL,
      COALESCE(team_members_invited_count, 0) > 0
    INTO v_has_viewed_analytics, v_has_invited_team
    FROM profiles
    WHERE id = p_user_id;
  ELSE
    v_has_viewed_analytics := false;
    v_has_invited_team := false;
  END IF;
  
  -- 7. Recent links (top 20)
  SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  INTO v_recent_links
  FROM (
    SELECT id, title, slug, short_url, destination_url, status, total_clicks, created_at
    FROM links
    WHERE workspace_id = p_workspace_id
      AND deleted_at IS NULL
      AND (link_type IS NULL OR link_type != 'sales')
    ORDER BY created_at DESC
    LIMIT 20
  ) t;
  
  -- Build result
  v_result := jsonb_build_object(
    'linksCount', v_links_count,
    'clicksToday', v_clicks_today,
    'qrCount', v_qr_count,
    'domainsCount', v_domains_count,
    'pixelCount', v_pixel_count,
    'hasViewedAnalytics', COALESCE(v_has_viewed_analytics, false),
    'hasInvitedTeam', COALESCE(v_has_invited_team, false),
    'recentLinks', v_recent_links
  );
  
  RETURN v_result;
END;
$$;