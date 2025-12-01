-- Add cache optimization columns to links table
ALTER TABLE links
ADD COLUMN IF NOT EXISTS cache_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS cache_priority text DEFAULT 'cold',
ADD COLUMN IF NOT EXISTS last_cached_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS clicks_last_hour integer DEFAULT 0;

-- Create index for cache optimization queries
CREATE INDEX IF NOT EXISTS idx_links_cache_score ON links(cache_score DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_links_cache_priority ON links(cache_priority) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_links_clicks_last_hour ON links(clicks_last_hour DESC) WHERE status = 'active';

-- Create cache metadata tracking table
CREATE TABLE IF NOT EXISTS link_cache_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid REFERENCES links(id) ON DELETE CASCADE,
  cache_tier text NOT NULL DEFAULT 'cold', -- 'hot', 'warm', 'cold'
  last_accessed_at timestamp with time zone DEFAULT now(),
  access_count integer DEFAULT 0,
  cache_size_bytes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(link_id)
);

-- Enable RLS on cache metadata
ALTER TABLE link_cache_metadata ENABLE ROW LEVEL SECURITY;

-- RLS policies for cache metadata
CREATE POLICY "Users can view cache metadata for workspace links"
  ON link_cache_metadata FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM links
      WHERE links.id = link_cache_metadata.link_id
      AND has_workspace_access(auth.uid(), links.workspace_id)
    )
  );

CREATE POLICY "Service role can manage cache metadata"
  ON link_cache_metadata FOR ALL
  USING (true);

-- Create function to calculate link cache score
CREATE OR REPLACE FUNCTION calculate_link_cache_score(p_link_id uuid)
RETURNS numeric AS $$
DECLARE
  v_clicks_last_hour integer;
  v_total_clicks integer;
  v_score numeric;
BEGIN
  -- Get clicks in last hour
  SELECT COUNT(*) INTO v_clicks_last_hour
  FROM link_clicks
  WHERE link_id = p_link_id
  AND clicked_at > now() - interval '1 hour';
  
  -- Get total clicks
  SELECT total_clicks INTO v_total_clicks
  FROM links
  WHERE id = p_link_id;
  
  -- Calculate score: (Clicks_Last_Hour * 10) + (Total_Clicks * 1)
  v_score := (COALESCE(v_clicks_last_hour, 0) * 10) + (COALESCE(v_total_clicks, 0) * 1);
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to update link cache scores for all active links
CREATE OR REPLACE FUNCTION update_link_cache_scores()
RETURNS void AS $$
BEGIN
  UPDATE links
  SET 
    clicks_last_hour = (
      SELECT COUNT(*)
      FROM link_clicks
      WHERE link_clicks.link_id = links.id
      AND clicked_at > now() - interval '1 hour'
    ),
    cache_score = calculate_link_cache_score(links.id)
  WHERE status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create view for hot links (top candidates for caching)
CREATE OR REPLACE VIEW hot_links_view AS
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

COMMENT ON TABLE link_cache_metadata IS 'Tracks which links are cached in hot/warm/cold tiers for Knapsack optimization';
COMMENT ON COLUMN links.cache_score IS 'Calculated score for cache priority: (clicks_last_hour * 10) + (total_clicks * 1)';
COMMENT ON COLUMN links.cache_priority IS 'Cache tier: hot (edge KV), warm (CDN), cold (database only)';
COMMENT ON COLUMN links.clicks_last_hour IS 'Number of clicks in the last hour, used for cache scoring';
