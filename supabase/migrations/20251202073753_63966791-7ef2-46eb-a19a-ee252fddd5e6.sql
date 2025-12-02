-- Ensure views are created without SECURITY DEFINER
-- Only recreate the views that exist

-- Recreate hot_links_view without SECURITY DEFINER
CREATE OR REPLACE VIEW hot_links_view AS
SELECT l.*
FROM links l
WHERE l.status = 'active'
  AND l.deleted_at IS NULL;

-- Recreate audit_statistics without SECURITY DEFINER  
CREATE OR REPLACE VIEW audit_statistics AS
SELECT 
  workspace_id,
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT actor_id) as unique_actors,
  MAX(created_at) as last_event_at
FROM audit_events
GROUP BY workspace_id, event_type;

-- Add comments to document access control pattern
COMMENT ON VIEW hot_links_view IS 'Active links - RLS bypassed via SECURITY DEFINER functions with has_workspace_access checks';
COMMENT ON VIEW audit_statistics IS 'Audit stats - RLS bypassed via SECURITY DEFINER functions with owner/admin checks';