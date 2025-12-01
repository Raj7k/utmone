-- Enable RLS on link_bandits table
ALTER TABLE link_bandits ENABLE ROW LEVEL SECURITY;

-- Service role can manage all bandit data (for edge functions)
CREATE POLICY "Service role can manage link_bandits"
ON link_bandits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Users can view bandit data for links in their workspace
CREATE POLICY "Users can view link_bandits for their links"
ON link_bandits
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM links
    WHERE links.id = link_bandits.link_id
    AND has_workspace_access(auth.uid(), links.workspace_id)
  )
);