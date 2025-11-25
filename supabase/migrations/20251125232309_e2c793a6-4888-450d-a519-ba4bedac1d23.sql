-- Allow users to insert themselves as workspace members when they have a valid invitation
CREATE POLICY "Users can join workspace via valid invitation" 
ON public.workspace_members
FOR INSERT
WITH CHECK (
  user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM workspace_invitations wi
    WHERE wi.workspace_id = workspace_members.workspace_id
    AND wi.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND wi.accepted_at IS NULL
    AND wi.expires_at > now()
  )
);