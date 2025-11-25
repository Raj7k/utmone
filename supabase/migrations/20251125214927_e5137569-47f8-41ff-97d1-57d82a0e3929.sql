-- Allow pending invitees to view workspace name
CREATE POLICY "Pending invitees can view workspace name"
ON public.workspaces
FOR SELECT
USING (
  id IN (
    SELECT workspace_id FROM public.workspace_invitations 
    WHERE accepted_at IS NULL 
    AND expires_at > now()
  )
);

-- Allow pending invitees to view inviter profile
CREATE POLICY "Pending invitees can view inviter profile"
ON public.profiles
FOR SELECT
USING (
  id IN (
    SELECT invited_by FROM public.workspace_invitations 
    WHERE accepted_at IS NULL 
    AND expires_at > now()
  )
);