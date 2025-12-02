-- Secure link_cache_metadata table from public access
-- Enable RLS to prevent competitors from stealing performance data
ALTER TABLE link_cache_metadata ENABLE ROW LEVEL SECURITY;

-- Drop any existing permissive policies
DROP POLICY IF EXISTS "Public can view cache metadata" ON link_cache_metadata;
DROP POLICY IF EXISTS "Anyone can read cache metadata" ON link_cache_metadata;
DROP POLICY IF EXISTS "Service role can manage cache metadata" ON link_cache_metadata;

-- Allow workspace members to view cache metadata for their links
CREATE POLICY "Workspace members can view cache metadata"
ON link_cache_metadata
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM links
    WHERE links.id = link_cache_metadata.link_id
    AND has_workspace_access(auth.uid(), links.workspace_id)
  )
);

-- Allow service role to manage cache metadata (for edge functions)
CREATE POLICY "Service role can manage cache metadata"
ON link_cache_metadata
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);