-- Drop problematic RLS policies causing infinite recursion

-- Drop the policy on workspaces that queries workspace_invitations
DROP POLICY IF EXISTS "Pending invitees can view workspace name" ON public.workspaces;

-- Drop the policy on profiles that queries workspace_invitations
DROP POLICY IF EXISTS "Invited users can view their own profile" ON public.profiles;