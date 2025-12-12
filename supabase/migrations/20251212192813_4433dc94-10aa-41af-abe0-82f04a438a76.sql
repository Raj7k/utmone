-- Create helper functions to avoid JOINs in RLS policies

-- Function to check if user has access to a link
CREATE OR REPLACE FUNCTION public.has_link_access(_user_id uuid, _link_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM links l
    WHERE l.id = _link_id
    AND has_workspace_access(_user_id, l.workspace_id)
  )
$$;

-- Function to check if user can edit a link (owner or editor role)
CREATE OR REPLACE FUNCTION public.can_edit_link(_user_id uuid, _link_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM links l
    WHERE l.id = _link_id
    AND (
      is_workspace_owner(_user_id, l.workspace_id)
      OR EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = l.workspace_id
        AND wm.user_id = _user_id
        AND wm.role IN ('workspace_admin', 'editor')
      )
    )
  )
$$;

-- Function to check if user owns a partner record
CREATE OR REPLACE FUNCTION public.is_partner_owner(_user_id uuid, _partner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM partners p
    WHERE p.id = _partner_id
    AND p.user_id = _user_id
  )
$$;

-- Function to check API key workspace access
CREATE OR REPLACE FUNCTION public.has_api_key_access(_user_id uuid, _api_key_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM api_keys ak
    WHERE ak.id = _api_key_id
    AND has_workspace_access(_user_id, ak.workspace_id)
  )
$$;

-- ============================================
-- 1. FIX link_health_checks RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view health checks for links in their workspace" ON public.link_health_checks;

CREATE POLICY "Users can view health checks for links in their workspace"
ON public.link_health_checks
FOR SELECT
USING (has_link_access(auth.uid(), link_id));

-- ============================================
-- 2. FIX link_tags RLS (4 policies)
-- ============================================
DROP POLICY IF EXISTS "Users can view tags for links in their workspaces" ON public.link_tags;
DROP POLICY IF EXISTS "Users can view tags in their workspace" ON public.link_tags;
DROP POLICY IF EXISTS "Users can create tags in their workspace" ON public.link_tags;
DROP POLICY IF EXISTS "Users can delete tags in their workspace" ON public.link_tags;

CREATE POLICY "Users can view tags in their workspace"
ON public.link_tags
FOR SELECT
USING (has_link_access(auth.uid(), link_id));

CREATE POLICY "Users can create tags in their workspace"
ON public.link_tags
FOR INSERT
WITH CHECK (has_link_access(auth.uid(), link_id));

CREATE POLICY "Users can delete tags in their workspace"
ON public.link_tags
FOR DELETE
USING (has_link_access(auth.uid(), link_id));

-- ============================================
-- 3. FIX og_image_variants RLS (4 policies)
-- ============================================
DROP POLICY IF EXISTS "Users can view variants for links in their workspaces" ON public.og_image_variants;
DROP POLICY IF EXISTS "Editors can create variants" ON public.og_image_variants;
DROP POLICY IF EXISTS "Editors can update variants" ON public.og_image_variants;
DROP POLICY IF EXISTS "Editors can delete variants" ON public.og_image_variants;

CREATE POLICY "Users can view variants for links in their workspaces"
ON public.og_image_variants
FOR SELECT
USING (has_link_access(auth.uid(), link_id));

CREATE POLICY "Editors can create variants"
ON public.og_image_variants
FOR INSERT
WITH CHECK (can_edit_link(auth.uid(), link_id));

CREATE POLICY "Editors can update variants"
ON public.og_image_variants
FOR UPDATE
USING (can_edit_link(auth.uid(), link_id));

CREATE POLICY "Editors can delete variants"
ON public.og_image_variants
FOR DELETE
USING (can_edit_link(auth.uid(), link_id));

-- ============================================
-- 4. FIX api_usage RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view their API usage" ON public.api_usage;

CREATE POLICY "Users can view their API usage"
ON public.api_usage
FOR SELECT
USING (has_api_key_access(auth.uid(), api_key_id));

-- ============================================
-- 5. FIX ai_insights RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view AI insights for their workspaces" ON public.ai_insights;

CREATE POLICY "Users can view AI insights for their workspaces"
ON public.ai_insights
FOR SELECT
USING (has_workspace_access(auth.uid(), workspace_id));

-- ============================================
-- 6. FIX workspace_usage RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view their workspace usage" ON public.workspace_usage;

CREATE POLICY "Users can view their workspace usage"
ON public.workspace_usage
FOR SELECT
USING (has_workspace_access(auth.uid(), workspace_id));

-- ============================================
-- 7. FIX partner_referrals RLS
-- ============================================
DROP POLICY IF EXISTS "Partners can view their own referrals" ON public.partner_referrals;

CREATE POLICY "Partners can view their own referrals"
ON public.partner_referrals
FOR SELECT
USING (is_partner_owner(auth.uid(), partner_id));