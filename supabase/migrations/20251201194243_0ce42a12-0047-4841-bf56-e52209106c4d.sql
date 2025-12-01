-- =====================================================
-- ADAPTIVE GOVERNANCE SHIELD: Enterprise Security
-- =====================================================

-- 1. CAPABILITY-BASED RBAC SYSTEM
-- =====================================================

-- Create capabilities enum
CREATE TYPE public.workspace_capability AS ENUM (
  'can_view_billing',
  'can_manage_billing',
  'can_create_links',
  'can_update_links',
  'can_delete_links',
  'can_view_analytics',
  'can_export_analytics',
  'can_invite_members',
  'can_remove_members',
  'can_manage_roles',
  'can_manage_domains',
  'can_manage_integrations',
  'can_manage_webhooks',
  'can_create_qr',
  'can_manage_campaigns',
  'can_view_audit_logs',
  'can_manage_workspace_settings'
);

-- Role capabilities matrix
CREATE TABLE public.role_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  capability workspace_capability NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, capability)
);

-- Populate capability matrix (Least Privilege Principle)
-- Note: Workspace owner_id gets ALL capabilities by default in capability check function
INSERT INTO public.role_capabilities (role, capability) VALUES
  -- Viewer: Read-only access
  ('viewer', 'can_view_analytics'),
  
  -- Contributor: Can create but needs approval
  ('contributor', 'can_view_analytics'),
  ('contributor', 'can_create_links'),
  ('contributor', 'can_create_qr'),
  
  -- Editor: Full content management
  ('editor', 'can_view_analytics'),
  ('editor', 'can_export_analytics'),
  ('editor', 'can_create_links'),
  ('editor', 'can_update_links'),
  ('editor', 'can_delete_links'),
  ('editor', 'can_create_qr'),
  ('editor', 'can_manage_campaigns'),
  
  -- Workspace Admin: Everything except billing
  ('workspace_admin', 'can_view_analytics'),
  ('workspace_admin', 'can_export_analytics'),
  ('workspace_admin', 'can_create_links'),
  ('workspace_admin', 'can_update_links'),
  ('workspace_admin', 'can_delete_links'),
  ('workspace_admin', 'can_create_qr'),
  ('workspace_admin', 'can_manage_campaigns'),
  ('workspace_admin', 'can_invite_members'),
  ('workspace_admin', 'can_remove_members'),
  ('workspace_admin', 'can_manage_roles'),
  ('workspace_admin', 'can_manage_domains'),
  ('workspace_admin', 'can_manage_integrations'),
  ('workspace_admin', 'can_manage_webhooks'),
  ('workspace_admin', 'can_view_audit_logs'),
  ('workspace_admin', 'can_manage_workspace_settings');

-- Enable RLS
ALTER TABLE public.role_capabilities ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view role capabilities (for UI purposes)
CREATE POLICY "Anyone can view role capabilities"
  ON public.role_capabilities
  FOR SELECT
  USING (true);

-- 2. COMPREHENSIVE AUDIT LOG SYSTEM
-- =====================================================

-- Extend admin_audit_logs with workspace context
ALTER TABLE public.admin_audit_logs
  ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS session_id TEXT,
  ADD COLUMN IF NOT EXISTS changed_by_role TEXT;

-- Create index for performance (partitioned by month in production)
CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace_time 
  ON public.admin_audit_logs(workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_time 
  ON public.admin_audit_logs(admin_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_resource 
  ON public.admin_audit_logs(resource_type, resource_id);

-- Enhanced audit log function with workspace context
CREATE OR REPLACE FUNCTION public.log_workspace_action(
  p_workspace_id UUID,
  p_admin_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
  v_user_role TEXT;
BEGIN
  -- Get user's role in workspace
  SELECT 
    CASE 
      WHEN w.owner_id = p_admin_user_id THEN 'owner'
      ELSE wm.role::TEXT
    END INTO v_user_role
  FROM workspaces w
  LEFT JOIN workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = p_admin_user_id
  WHERE w.id = p_workspace_id;

  -- Insert audit log
  INSERT INTO public.admin_audit_logs (
    workspace_id,
    admin_user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    changed_by_role
  ) VALUES (
    p_workspace_id,
    p_admin_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values,
    p_ip_address,
    p_user_agent,
    v_user_role
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- 3. SAFETY GUARDRAILS
-- =====================================================

-- Prevent last owner removal (Suicide Prevention)
CREATE OR REPLACE FUNCTION public.prevent_last_owner_removal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_workspace_id UUID;
  v_is_removing_owner BOOLEAN := false;
BEGIN
  -- Determine workspace_id based on operation
  v_workspace_id := COALESCE(NEW.workspace_id, OLD.workspace_id);
  
  -- Check if we're trying to remove/change workspace admin
  IF TG_OP = 'DELETE' AND OLD.role = 'workspace_admin' THEN
    v_is_removing_owner := true;
  ELSIF TG_OP = 'UPDATE' AND OLD.role = 'workspace_admin' AND NEW.role != 'workspace_admin' THEN
    v_is_removing_owner := true;
  END IF;
  
  -- If removing an admin, verify at least one other admin exists
  IF v_is_removing_owner THEN
    IF NOT EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = v_workspace_id
      AND role = 'workspace_admin'
      AND id != OLD.id
    ) THEN
      -- Check if workspace owner exists as fallback
      IF NOT EXISTS (
        SELECT 1 FROM workspaces
        WHERE id = v_workspace_id
        AND owner_id != OLD.user_id
      ) THEN
        RAISE EXCEPTION 'Cannot remove last admin. Workspace must have at least one admin or owner.';
      END IF;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply trigger to workspace_members
DROP TRIGGER IF EXISTS prevent_last_owner_removal_trigger ON public.workspace_members;
CREATE TRIGGER prevent_last_owner_removal_trigger
  BEFORE DELETE OR UPDATE ON public.workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_last_owner_removal();

-- 4. CAPABILITY CHECK FUNCTION
-- =====================================================

-- Check if user has a specific capability in workspace
CREATE OR REPLACE FUNCTION public.has_capability(
  _user_id UUID,
  _workspace_id UUID,
  _capability workspace_capability
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_owner BOOLEAN;
  v_user_role user_role;
BEGIN
  -- Check if user is workspace owner (owners have ALL capabilities)
  SELECT owner_id = _user_id INTO v_is_owner
  FROM workspaces
  WHERE id = _workspace_id;
  
  IF v_is_owner THEN
    RETURN true;
  END IF;
  
  -- Get user's role in workspace
  SELECT role INTO v_user_role
  FROM workspace_members
  WHERE workspace_id = _workspace_id
  AND user_id = _user_id;
  
  IF v_user_role IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if role has capability
  RETURN EXISTS (
    SELECT 1
    FROM role_capabilities
    WHERE role = v_user_role
    AND capability = _capability
  );
END;
$$;

-- 5. ROLE RECOMMENDATION FUNCTION (Discrete Optimization)
-- =====================================================

-- Find minimal role that satisfies required capabilities (Chapter 22: Discrete Optimization)
CREATE OR REPLACE FUNCTION public.recommend_role(
  _required_capabilities workspace_capability[]
)
RETURNS TABLE(
  recommended_role user_role,
  matched_capabilities INTEGER,
  excess_capabilities INTEGER,
  missing_capabilities INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH role_analysis AS (
    SELECT 
      rc.role,
      COUNT(*) FILTER (WHERE rc.capability = ANY(_required_capabilities)) AS matched,
      COUNT(*) FILTER (WHERE rc.capability != ALL(_required_capabilities)) AS excess,
      (
        SELECT COUNT(*)
        FROM unnest(_required_capabilities) AS req(cap)
        WHERE req.cap NOT IN (
          SELECT capability FROM role_capabilities WHERE role = rc.role
        )
      ) AS missing
    FROM role_capabilities rc
    GROUP BY rc.role
  )
  SELECT 
    role,
    matched::INTEGER,
    excess::INTEGER,
    missing::INTEGER
  FROM role_analysis
  WHERE missing = 0  -- Must satisfy all required capabilities
  ORDER BY 
    excess ASC,       -- Minimize excess permissions (Least Privilege Principle)
    matched DESC      -- Maximize matched capabilities
  LIMIT 1;
END;
$$;