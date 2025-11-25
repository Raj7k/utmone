-- Create a SECURITY DEFINER function that bypasses RLS to check workspace ownership
CREATE OR REPLACE FUNCTION public.is_workspace_owner_direct(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- This function bypasses RLS by using SECURITY DEFINER
  -- It directly checks the workspaces table without triggering policies
  SELECT EXISTS (
    SELECT 1
    FROM public.workspaces
    WHERE id = _workspace_id
      AND owner_id = _user_id
  )
$$;

-- Drop and recreate the workspace_members RLS policy to avoid circular dependency
DROP POLICY IF EXISTS "Users can view workspace memberships" ON public.workspace_members;

CREATE POLICY "Users can view workspace memberships" 
ON public.workspace_members
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR is_workspace_owner_direct(auth.uid(), workspace_id)
);