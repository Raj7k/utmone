-- Migration: Create folders and link_tags tables
-- Purpose: Fix bulk upload folder features and link detail tags
-- Referenced in: bulk upload flows, link detail page

-- =====================================================
-- 1. FOLDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "folders_select_workspace_member" ON public.folders;
CREATE POLICY "folders_select_workspace_member"
  ON public.folders
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "folders_insert_workspace_member" ON public.folders;
CREATE POLICY "folders_insert_workspace_member"
  ON public.folders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "folders_update_workspace_member" ON public.folders;
CREATE POLICY "folders_update_workspace_member"
  ON public.folders
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "folders_delete_workspace_member" ON public.folders;
CREATE POLICY "folders_delete_workspace_member"
  ON public.folders
  FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_folders_workspace_id ON public.folders(workspace_id);

-- =====================================================
-- 2. LINK_TAGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.link_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(link_id, tag_name)
);

ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "link_tags_select_workspace_member" ON public.link_tags;
CREATE POLICY "link_tags_select_workspace_member"
  ON public.link_tags
  FOR SELECT
  TO authenticated
  USING (
    link_id IN (
      SELECT l.id FROM public.links l
      WHERE l.workspace_id IN (
        SELECT id FROM public.workspaces WHERE user_id = auth.uid()
        UNION
        SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "link_tags_insert_workspace_member" ON public.link_tags;
CREATE POLICY "link_tags_insert_workspace_member"
  ON public.link_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    link_id IN (
      SELECT l.id FROM public.links l
      WHERE l.workspace_id IN (
        SELECT id FROM public.workspaces WHERE user_id = auth.uid()
        UNION
        SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "link_tags_delete_workspace_member" ON public.link_tags;
CREATE POLICY "link_tags_delete_workspace_member"
  ON public.link_tags
  FOR DELETE
  TO authenticated
  USING (
    link_id IN (
      SELECT l.id FROM public.links l
      WHERE l.workspace_id IN (
        SELECT id FROM public.workspaces WHERE user_id = auth.uid()
        UNION
        SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_link_tags_link_id ON public.link_tags(link_id);
CREATE INDEX IF NOT EXISTS idx_link_tags_tag_name ON public.link_tags(tag_name);
