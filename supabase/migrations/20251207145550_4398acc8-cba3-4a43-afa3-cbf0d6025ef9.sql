-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view conversions in their workspaces" ON conversion_events;

-- Create updated policy with workspace_id fallback for pixel events
CREATE POLICY "Users can view conversions in their workspaces" ON conversion_events
FOR SELECT USING (
  -- Link-based access (for link click conversions)
  (link_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM links 
    WHERE links.id = conversion_events.link_id 
    AND has_workspace_access(auth.uid(), links.workspace_id)
  ))
  OR
  -- Direct workspace access (for pixel events without link_id)
  (workspace_id IS NOT NULL AND has_workspace_access(auth.uid(), conversion_events.workspace_id))
);