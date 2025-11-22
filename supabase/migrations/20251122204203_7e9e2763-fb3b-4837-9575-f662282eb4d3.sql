-- Week 1: Critical Performance Indexes
-- These indexes optimize the hottest paths in the redirect function and analytics queries

-- 1. Redirect function hot path: domain + path + slug lookup with status filter
-- This is THE most critical index - every redirect hits this query
CREATE INDEX IF NOT EXISTS idx_links_redirect_lookup 
ON public.links(domain, path, slug, status) 
WHERE status = 'active';

-- 2. Unique click detection: link_id + ip + user_agent + recent timestamp
-- Prevents full table scan when checking if click is unique in last 24h
CREATE INDEX IF NOT EXISTS idx_link_clicks_unique_check 
ON public.link_clicks(link_id, ip_address, user_agent, clicked_at DESC);

-- 3. Click analytics time-series queries (most common admin dashboard query)
-- Includes commonly selected columns to enable index-only scans
CREATE INDEX IF NOT EXISTS idx_link_clicks_analytics 
ON public.link_clicks(link_id, clicked_at DESC) 
INCLUDE (device_type, country, is_unique);

-- 4. Admin dashboard: workspace-scoped link lists with date sorting
-- Filters out archived links since they're rarely queried
CREATE INDEX IF NOT EXISTS idx_links_workspace_created 
ON public.links(workspace_id, created_at DESC) 
WHERE status != 'archived';

-- 5. Background geolocation processing: find unprocessed clicks
-- Composite index for efficient filtering of clicks needing geolocation enrichment
CREATE INDEX IF NOT EXISTS idx_link_clicks_geolocation_pending
ON public.link_clicks(clicked_at DESC)
WHERE country IS NULL AND ip_address IS NOT NULL;

-- 6. Workspace analytics aggregations (used in admin dashboard)
CREATE INDEX IF NOT EXISTS idx_links_status_updated
ON public.links(status, updated_at DESC);

-- 7. OG variant performance tracking
CREATE INDEX IF NOT EXISTS idx_link_clicks_variant
ON public.link_clicks(og_variant_id, clicked_at DESC)
WHERE og_variant_id IS NOT NULL;

-- Performance verification query (run after index creation):
-- EXPLAIN ANALYZE SELECT * FROM links WHERE domain = 'utm.one' AND path = 'go' AND slug = 'test' AND status = 'active';
-- Should show "Index Scan using idx_links_redirect_lookup"