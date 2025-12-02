-- Fix Security Definer Views
-- Views should not use SECURITY DEFINER - access control is handled by functions
-- Drop and recreate views without SECURITY DEFINER to fix security vulnerability

-- Drop existing views if they have SECURITY DEFINER
DROP VIEW IF EXISTS hot_links_view CASCADE;
DROP VIEW IF EXISTS audit_statistics CASCADE;

-- Recreate hot_links_view as a regular view (no SECURITY DEFINER)
-- Simply select from links where status is active - columns already exist
CREATE VIEW hot_links_view AS
SELECT l.*
FROM links l
WHERE l.status = 'active'
  AND l.deleted_at IS NULL;

-- Recreate audit_statistics as a regular view (no SECURITY DEFINER)
CREATE VIEW audit_statistics AS
SELECT 
  workspace_id,
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT actor_id) as unique_actors,
  MAX(created_at) as last_event_at
FROM audit_events
GROUP BY workspace_id, event_type;

-- Add comment explaining access control is via functions
COMMENT ON VIEW hot_links_view IS 'Active links view - access controlled via RLS and SECURITY DEFINER functions';
COMMENT ON VIEW audit_statistics IS 'Audit event statistics - access controlled via RLS and SECURITY DEFINER functions';