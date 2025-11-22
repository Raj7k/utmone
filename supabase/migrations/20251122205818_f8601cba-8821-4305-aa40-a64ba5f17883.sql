-- Create materialized views for analytics to reduce query load
-- These act as pre-computed query results that can be refreshed periodically

-- 1. Click analytics summary by link (last 90 days)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_link_analytics AS
SELECT 
  l.id as link_id,
  l.workspace_id,
  l.title,
  l.short_url,
  l.destination_url,
  l.created_at,
  l.created_by,
  COUNT(lc.id) as total_clicks,
  COUNT(DISTINCT CASE WHEN lc.is_unique THEN lc.ip_address END) as unique_clicks,
  COUNT(CASE WHEN lc.clicked_at >= NOW() - INTERVAL '30 days' THEN 1 END) as clicks_last_30_days,
  COUNT(CASE WHEN lc.clicked_at >= NOW() - INTERVAL '7 days' THEN 1 END) as clicks_last_7_days,
  MAX(lc.clicked_at) as last_clicked_at
FROM links l
LEFT JOIN link_clicks lc ON l.id = lc.link_id 
  AND lc.clicked_at >= NOW() - INTERVAL '90 days'
GROUP BY l.id, l.workspace_id, l.title, l.short_url, l.destination_url, l.created_at, l.created_by;

CREATE UNIQUE INDEX idx_mv_link_analytics_link_id ON mv_link_analytics(link_id);
CREATE INDEX idx_mv_link_analytics_workspace ON mv_link_analytics(workspace_id);

-- 2. UTM campaign rollups (last 90 days)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_utm_campaign_analytics AS
SELECT 
  l.workspace_id,
  COALESCE(l.utm_campaign, 'no_campaign') as utm_campaign,
  COALESCE(l.utm_source, 'no_source') as utm_source,
  COALESCE(l.utm_medium, 'no_medium') as utm_medium,
  COALESCE(l.utm_term, 'no_term') as utm_term,
  COALESCE(l.utm_content, 'no_content') as utm_content,
  COUNT(DISTINCT l.id) as total_links,
  COUNT(lc.id) as total_clicks,
  COUNT(DISTINCT CASE WHEN lc.is_unique THEN lc.ip_address END) as unique_clicks,
  MAX(lc.clicked_at) as last_clicked_at
FROM links l
LEFT JOIN link_clicks lc ON l.id = lc.link_id 
  AND lc.clicked_at >= NOW() - INTERVAL '90 days'
GROUP BY l.workspace_id, l.utm_campaign, l.utm_source, l.utm_medium, l.utm_term, l.utm_content;

CREATE INDEX idx_mv_utm_campaign_workspace ON mv_utm_campaign_analytics(workspace_id);
CREATE INDEX idx_mv_utm_campaign_campaign ON mv_utm_campaign_analytics(utm_campaign);

-- 3. Geolocation analytics (last 90 days)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_geolocation_analytics AS
SELECT 
  l.workspace_id,
  COALESCE(lc.country, 'Unknown') as country,
  COALESCE(lc.city, 'Unknown') as city,
  COUNT(lc.id) as click_count,
  COUNT(DISTINCT CASE WHEN lc.is_unique THEN lc.ip_address END) as unique_clicks
FROM links l
INNER JOIN link_clicks lc ON l.id = lc.link_id 
  AND lc.clicked_at >= NOW() - INTERVAL '90 days'
WHERE lc.country IS NOT NULL OR lc.city IS NOT NULL
GROUP BY l.workspace_id, lc.country, lc.city;

CREATE INDEX idx_mv_geolocation_workspace ON mv_geolocation_analytics(workspace_id);
CREATE INDEX idx_mv_geolocation_country ON mv_geolocation_analytics(country);

-- 4. Device analytics (last 90 days)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_device_analytics AS
SELECT 
  l.workspace_id,
  COALESCE(lc.device_type, 'Unknown') as device_type,
  COALESCE(lc.browser, 'Unknown') as browser,
  COALESCE(lc.os, 'Unknown') as os,
  COUNT(lc.id) as click_count,
  COUNT(DISTINCT CASE WHEN lc.is_unique THEN lc.ip_address END) as unique_clicks
FROM links l
INNER JOIN link_clicks lc ON l.id = lc.link_id 
  AND lc.clicked_at >= NOW() - INTERVAL '90 days'
GROUP BY l.workspace_id, lc.device_type, lc.browser, lc.os;

CREATE INDEX idx_mv_device_workspace ON mv_device_analytics(workspace_id);
CREATE INDEX idx_mv_device_type ON mv_device_analytics(device_type);

-- 5. Click time series by day (last 90 days)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_click_time_series AS
SELECT 
  l.workspace_id,
  l.id as link_id,
  DATE(lc.clicked_at) as click_date,
  COUNT(lc.id) as total_clicks,
  COUNT(DISTINCT CASE WHEN lc.is_unique THEN lc.ip_address END) as unique_clicks
FROM links l
INNER JOIN link_clicks lc ON l.id = lc.link_id 
  AND lc.clicked_at >= NOW() - INTERVAL '90 days'
GROUP BY l.workspace_id, l.id, DATE(lc.clicked_at);

CREATE INDEX idx_mv_click_time_series_workspace ON mv_click_time_series(workspace_id);
CREATE INDEX idx_mv_click_time_series_link ON mv_click_time_series(link_id);
CREATE INDEX idx_mv_click_time_series_date ON mv_click_time_series(click_date);

-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_link_analytics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_utm_campaign_analytics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_geolocation_analytics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_device_analytics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_click_time_series;
  REFRESH MATERIALIZED VIEW CONCURRENTLY waitlist_analytics;
END;
$$;

-- Grant access to authenticated users
GRANT SELECT ON mv_link_analytics TO authenticated;
GRANT SELECT ON mv_utm_campaign_analytics TO authenticated;
GRANT SELECT ON mv_geolocation_analytics TO authenticated;
GRANT SELECT ON mv_device_analytics TO authenticated;
GRANT SELECT ON mv_click_time_series TO authenticated;

-- RLS policies for materialized views
ALTER MATERIALIZED VIEW mv_link_analytics OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_utm_campaign_analytics OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_geolocation_analytics OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_device_analytics OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_click_time_series OWNER TO postgres;