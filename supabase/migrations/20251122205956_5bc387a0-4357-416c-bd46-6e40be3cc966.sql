-- Create security definer functions to wrap materialized view queries with workspace access control
-- Since materialized views don't support RLS, we use functions instead

-- Function to get link analytics for a workspace
CREATE OR REPLACE FUNCTION get_link_analytics(p_workspace_id uuid)
RETURNS TABLE (
  link_id uuid,
  workspace_id uuid,
  title text,
  short_url text,
  destination_url text,
  created_at timestamptz,
  created_by uuid,
  total_clicks bigint,
  unique_clicks bigint,
  clicks_last_30_days bigint,
  clicks_last_7_days bigint,
  last_clicked_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM mv_link_analytics
  WHERE mv_link_analytics.workspace_id = p_workspace_id
  AND has_workspace_access(auth.uid(), p_workspace_id);
$$;

-- Function to get UTM campaign analytics for a workspace
CREATE OR REPLACE FUNCTION get_utm_analytics(p_workspace_id uuid)
RETURNS TABLE (
  workspace_id uuid,
  utm_campaign text,
  utm_source text,
  utm_medium text,
  utm_term text,
  utm_content text,
  total_links bigint,
  total_clicks bigint,
  unique_clicks bigint,
  last_clicked_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM mv_utm_campaign_analytics
  WHERE mv_utm_campaign_analytics.workspace_id = p_workspace_id
  AND has_workspace_access(auth.uid(), p_workspace_id);
$$;

-- Function to get geolocation analytics for a workspace
CREATE OR REPLACE FUNCTION get_geolocation_analytics(p_workspace_id uuid)
RETURNS TABLE (
  workspace_id uuid,
  country text,
  city text,
  click_count bigint,
  unique_clicks bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM mv_geolocation_analytics
  WHERE mv_geolocation_analytics.workspace_id = p_workspace_id
  AND has_workspace_access(auth.uid(), p_workspace_id);
$$;

-- Function to get device analytics for a workspace
CREATE OR REPLACE FUNCTION get_device_analytics(p_workspace_id uuid)
RETURNS TABLE (
  workspace_id uuid,
  device_type text,
  browser text,
  os text,
  click_count bigint,
  unique_clicks bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM mv_device_analytics
  WHERE mv_device_analytics.workspace_id = p_workspace_id
  AND has_workspace_access(auth.uid(), p_workspace_id);
$$;

-- Function to get time series analytics for a workspace
CREATE OR REPLACE FUNCTION get_time_series_analytics(
  p_workspace_id uuid,
  p_link_id uuid DEFAULT NULL,
  p_days integer DEFAULT 30
)
RETURNS TABLE (
  workspace_id uuid,
  link_id uuid,
  click_date date,
  total_clicks bigint,
  unique_clicks bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM mv_click_time_series
  WHERE mv_click_time_series.workspace_id = p_workspace_id
  AND has_workspace_access(auth.uid(), p_workspace_id)
  AND (p_link_id IS NULL OR mv_click_time_series.link_id = p_link_id)
  AND mv_click_time_series.click_date >= CURRENT_DATE - p_days;
$$;