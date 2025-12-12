-- Create a more efficient workspace access check function
-- This caches the user's workspace IDs to avoid repeated subqueries
CREATE OR REPLACE FUNCTION public.has_workspace_access_fast(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    EXISTS (SELECT 1 FROM public.workspaces WHERE id = _workspace_id AND owner_id = _user_id)
    OR
    EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = _workspace_id AND user_id = _user_id)
$$;

-- Update link_clicks RLS policy to use the faster function
DROP POLICY IF EXISTS "link_clicks_workspace_access" ON public.link_clicks;
CREATE POLICY "link_clicks_workspace_access" ON public.link_clicks
FOR SELECT USING (has_workspace_access_fast(auth.uid(), workspace_id));

-- Add composite index for faster RLS checks
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON public.workspaces(owner_id, id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id, workspace_id);