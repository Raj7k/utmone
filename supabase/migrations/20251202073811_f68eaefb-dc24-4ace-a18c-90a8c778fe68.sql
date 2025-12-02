-- Fix Security Definer Views by explicitly dropping and recreating with SECURITY INVOKER
-- Must explicitly set SECURITY INVOKER to override any existing SECURITY DEFINER

-- Drop both views completely
DROP VIEW IF EXISTS hot_links_view CASCADE;
DROP VIEW IF EXISTS audit_statistics CASCADE;

-- Recreate hot_links_view with explicit SECURITY INVOKER
CREATE VIEW hot_links_view 
WITH (security_invoker = true)
AS
SELECT l.*
FROM links l
WHERE l.status = 'active'
  AND l.deleted_at IS NULL;

-- Recreate audit_statistics with explicit SECURITY INVOKER
CREATE VIEW audit_statistics
WITH (security_invoker = true)
AS
SELECT 
  workspace_id,
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT actor_id) as unique_actors,
  MAX(created_at) as last_event_at
FROM audit_events
GROUP BY workspace_id, event_type;

-- Document that access control is via SECURITY DEFINER functions
COMMENT ON VIEW hot_links_view IS 'Active links view with SECURITY INVOKER - access control via SECURITY DEFINER functions';
COMMENT ON VIEW audit_statistics IS 'Audit statistics with SECURITY INVOKER - access control via SECURITY DEFINER functions';