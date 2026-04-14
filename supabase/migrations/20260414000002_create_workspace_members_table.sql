-- Migration: Create workspace_members table
-- Purpose: Fix AppSessionContext workspace fetch errors on every login
-- Referenced in: AppSessionContext.tsx

-- 1. Create workspace_members table
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);

-- 2. Enable RLS
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- 3. RLS: users can see their own memberships
DROP POLICY IF EXISTS "workspace_members_select_own" ON public.workspace_members;
CREATE POLICY "workspace_members_select_own"
  ON public.workspace_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    )
  );

-- 4. RLS: workspace owners can insert members
DROP POLICY IF EXISTS "workspace_members_insert_owner" ON public.workspace_members;
CREATE POLICY "workspace_members_insert_owner"
  ON public.workspace_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- 5. RLS: workspace owners can update members
DROP POLICY IF EXISTS "workspace_members_update_owner" ON public.workspace_members;
CREATE POLICY "workspace_members_update_owner"
  ON public.workspace_members
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    )
  );

-- 6. RLS: workspace owners can delete members
DROP POLICY IF EXISTS "workspace_members_delete_owner" ON public.workspace_members;
CREATE POLICY "workspace_members_delete_owner"
  ON public.workspace_members
  FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    )
  );

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON public.workspace_members(workspace_id);

-- 8. Backfill: add workspace owners as members with 'owner' role
INSERT INTO public.workspace_members (workspace_id, user_id, role)
SELECT id, user_id, 'owner'
FROM public.workspaces
WHERE user_id IS NOT NULL
ON CONFLICT (workspace_id, user_id) DO NOTHING;
