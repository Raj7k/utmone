-- Recreate hot_links_view without security definer (which causes linter warning)
-- Standard views inherit the querying user's permissions, which is what we want
DROP VIEW IF EXISTS hot_links_view;

CREATE VIEW hot_links_view 
WITH (security_invoker=true)
AS
SELECT 
  l.id,
  l.workspace_id,
  l.slug,
  l.destination_url,
  l.cache_score,
  l.clicks_last_hour,
  l.total_clicks,
  l.last_clicked_at,
  l.cache_priority,
  -- Estimate memory size (rough calculation: URL + slug + metadata overhead)
  (length(l.destination_url) + length(COALESCE(l.slug, '')) + 500) as estimated_size_bytes
FROM links l
WHERE l.status = 'active'
ORDER BY l.cache_score DESC;

COMMENT ON VIEW hot_links_view IS 'Top-scored links for cache optimization using Knapsack algorithm';