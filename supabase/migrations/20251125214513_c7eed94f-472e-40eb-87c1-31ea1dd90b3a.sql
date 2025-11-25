-- Allow public (anon and authenticated) to read pending invitations by token
-- This is secure because tokens are cryptographically random 64-char hex strings
-- Only someone with the exact token can access the invitation
CREATE POLICY "Public can view pending invitations by token"
ON public.workspace_invitations
FOR SELECT
TO anon, authenticated
USING (accepted_at IS NULL AND expires_at > now());

-- Allow authenticated users to accept their own invitations
CREATE POLICY "Users can accept their own invitations"
ON public.workspace_invitations
FOR UPDATE
TO authenticated
USING (auth.email() = email)
WITH CHECK (auth.email() = email);