-- Migration: Fix broken RLS policies from 20260414000002/000003
-- Previous migrations used workspaces.user_id which does NOT exist.
-- The correct column is workspaces.owner_id (per the original 20251118195200 schema).
-- This migration drops the broken policies and re-adds them using owner_id.

-- =====================================================
-- workspace_members: drop broken policies
-- =====================================================
DROP POLICY IF EXISTS "workspace_members_select_own" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert_owner" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_update_owner" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_delete_owner" ON public.workspace_members;

-- Re-create with owner_id
CREATE POLICY "workspace_members_select_own"
  ON public.workspace_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_insert_owner"
  ON public.workspace_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "workspace_members_update_owner"
  ON public.workspace_members
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_delete_owner"
  ON public.workspace_members
  FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

-- Backfill owners as members (the previous backfill failed because of user_id typo)
INSERT INTO public.workspace_members (workspace_id, user_id, role)
SELECT id, owner_id, 'owner'
FROM public.workspaces
WHERE owner_id IS NOT NULL
ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- =====================================================
-- folders: drop broken policies
-- =====================================================
DROP POLICY IF EXISTS "folders_select_workspace_member" ON public.folders;
DROP POLICY IF EXISTS "folders_insert_workspace_member" ON public.folders;
DROP POLICY IF EXISTS "folders_update_workspace_member" ON public.folders;
DROP POLICY IF EXISTS "folders_delete_workspace_member" ON public.folders;

CREATE POLICY "folders_select_workspace_member"
  ON public.folders
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "folders_insert_workspace_member"
  ON public.folders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "folders_update_workspace_member"
  ON public.folders
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "folders_delete_workspace_member"
  ON public.folders
  FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- link_tags: drop broken policies (keep original policies from 20251118195200 untouched)
-- =====================================================
DROP POLICY IF EXISTS "link_tags_select_workspace_member" ON public.link_tags;
DROP POLICY IF EXISTS "link_tags_insert_workspace_member" ON public.link_tags;
DROP POLICY IF EXISTS "link_tags_delete_workspace_member" ON public.link_tags;

CREATE POLICY "link_tags_select_workspace_member"
  ON public.link_tags
  FOR SELECT
  TO authenticated
  USING (
    link_id IN (
      SELECT l.id FROM public.links l
      WHERE l.workspace_id IN (
        SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "link_tags_insert_workspace_member"
  ON public.link_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    link_id IN (
      SELECT l.id FROM public.links l
      WHERE l.workspace_id IN (
        SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "link_tags_delete_workspace_member"
  ON public.link_tags
  FOR DELETE
  TO authenticated
  USING (
    link_id IN (
      SELECT l.id FROM public.links l
      WHERE l.workspace_id IN (
        SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
      )
    )
  );
