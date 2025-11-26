-- Drop the broken policy that queries auth.users
DROP POLICY IF EXISTS "Users can join workspace via valid invitation" ON workspace_members;

-- Create fixed policy using auth.email() function
CREATE POLICY "Users can join workspace via valid invitation"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid()) 
    AND (EXISTS (
      SELECT 1 FROM workspace_invitations wi
      WHERE wi.workspace_id = workspace_members.workspace_id
        AND wi.email = auth.email()
        AND wi.accepted_at IS NULL
        AND wi.expires_at > now()
    ))
  );