-- Drop vulnerable RLS policies that expose workspace invitations
DROP POLICY IF EXISTS "Public can view pending invitations by token" ON workspace_invitations;
DROP POLICY IF EXISTS "Users can view invitation with exact token match" ON workspace_invitations;

-- Keep only the secure admin policy for workspace management
-- "Workspace admins can view invitations" policy remains unchanged