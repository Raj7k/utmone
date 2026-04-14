-- Migration: Add missing columns to links and workspaces
-- Purpose: Code references these columns; adding as nullable (no defaults) for safety
-- All additions are non-breaking: existing rows get NULL

-- =====================================================
-- 1. LINKS TABLE - add missing columns
-- =====================================================
ALTER TABLE public.links
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS path TEXT,
  ADD COLUMN IF NOT EXISTS final_url TEXT,
  ADD COLUMN IF NOT EXISTS og_title TEXT,
  ADD COLUMN IF NOT EXISTS og_description TEXT,
  ADD COLUMN IF NOT EXISTS og_image TEXT,
  ADD COLUMN IF NOT EXISTS redirect_type TEXT,
  ADD COLUMN IF NOT EXISTS max_clicks INTEGER,
  ADD COLUMN IF NOT EXISTS custom_expiry_message TEXT,
  ADD COLUMN IF NOT EXISTS fallback_url TEXT,
  ADD COLUMN IF NOT EXISTS unique_clicks INTEGER,
  ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_links_folder_id ON public.links(folder_id);

-- =====================================================
-- 2. WORKSPACES TABLE - add missing columns
-- =====================================================
ALTER TABLE public.workspaces
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS is_client_workspace BOOLEAN,
  ADD COLUMN IF NOT EXISTS parent_workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN;

CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON public.workspaces(slug);
CREATE INDEX IF NOT EXISTS idx_workspaces_parent ON public.workspaces(parent_workspace_id);
