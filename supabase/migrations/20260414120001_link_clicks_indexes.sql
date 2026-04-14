-- Migration: Add critical indexes to link_clicks
-- Context: live DB inspection confirmed link_clicks has ONLY the primary key
-- index. At scale this turns every analytics query (clicks per link,
-- clicks per workspace, clicks in a time window) into a full table scan.
-- These four indexes cover the dominant query shapes.
--
-- All four use CREATE INDEX IF NOT EXISTS so this migration is safe to rerun
-- and safe on DBs where some of these indexes already exist.
--
-- CONCURRENTLY is not used because Supabase migrations run in a transaction;
-- if the table is very large and builds lock rows too long, Lovable should
-- apply these manually in pgAdmin with CONCURRENTLY. For small/medium tables
-- this is fine.

-- 1. Most important: fast "clicks for link" lookups for link detail pages
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id
  ON public.link_clicks (link_id);

-- 2. Workspace-scoped analytics (dashboard summaries, campaign reports)
CREATE INDEX IF NOT EXISTS idx_link_clicks_workspace_id
  ON public.link_clicks (workspace_id);

-- 3. Time-range queries — always used with ORDER BY clicked_at DESC
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at
  ON public.link_clicks (clicked_at DESC);

-- 4. Uniqueness check used by the redirect function's isUniqueClick():
--    SELECT 1 FROM link_clicks
--    WHERE link_id = $1 AND ip_address = $2 AND user_agent = $3
--      AND clicked_at > now() - interval '24 hours';
-- The column order matches the filter so Postgres can do a direct index lookup.
CREATE INDEX IF NOT EXISTS idx_link_clicks_uniqueness
  ON public.link_clicks (link_id, ip_address, user_agent, clicked_at DESC);

-- 5. Commonly filtered together: workspace + time for dashboard trend charts
CREATE INDEX IF NOT EXISTS idx_link_clicks_workspace_time
  ON public.link_clicks (workspace_id, clicked_at DESC);

-- NOTE: if your DB has millions of rows already, applying index #4 will
-- take non-trivial time. Consider running that one manually with
-- CREATE INDEX CONCURRENTLY during a low-traffic window.
