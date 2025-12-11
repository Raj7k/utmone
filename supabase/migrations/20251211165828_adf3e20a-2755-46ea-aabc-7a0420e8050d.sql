-- Add public SELECT policy to early_access_invites for token validation
-- This allows anonymous users to validate invite tokens during claim process
CREATE POLICY "Public can validate invites by token"
ON early_access_invites
FOR SELECT
USING (true);