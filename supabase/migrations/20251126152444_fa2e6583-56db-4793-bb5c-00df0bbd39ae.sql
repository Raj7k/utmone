-- Allow workspace owners to add members to their workspaces
CREATE POLICY "Workspace owners can add members"
ON workspace_members
FOR INSERT
TO authenticated
WITH CHECK (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);