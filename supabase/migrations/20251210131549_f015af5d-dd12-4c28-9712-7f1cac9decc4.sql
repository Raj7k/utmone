-- =====================================================
-- SECURITY HARDENING MIGRATION (Fixed)
-- Fixes critical RLS policy gaps and adds missing schema
-- =====================================================

-- 1. Add registered_domain column to user_authenticators for WebAuthn domain binding
ALTER TABLE public.user_authenticators 
ADD COLUMN IF NOT EXISTS registered_domain TEXT;

-- 2. Add created_at and metadata to link_clicks if missing
ALTER TABLE public.link_clicks 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 3. CRITICAL: Drop overly permissive RLS policies on sensitive tables

-- Profiles table - restrict to self-only access
DROP POLICY IF EXISTS "public_read" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

-- Create strict self-only policy for profiles
CREATE POLICY "users_own_profile_only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Ensure update policy is also self-only
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "users_update_own_profile_only"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Partners table - restrict to self or admin only
DROP POLICY IF EXISTS "public_read" ON public.partners;
DROP POLICY IF EXISTS "Partners can view their own data" ON public.partners;

CREATE POLICY "partners_self_or_admin_only"
ON public.partners
FOR SELECT
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin')
);

-- 5. Workspaces table - restrict to owner/member only
DROP POLICY IF EXISTS "public_read" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view workspaces they own or are members of" ON public.workspaces;

CREATE POLICY "workspaces_owner_or_member_only"
ON public.workspaces
FOR SELECT
USING (
  owner_id = auth.uid() OR 
  public.is_workspace_member(auth.uid(), id)
);

-- 6. Link clicks table - restrict to workspace access only  
DROP POLICY IF EXISTS "public_read" ON public.link_clicks;
DROP POLICY IF EXISTS "Users can view clicks for links in their workspace" ON public.link_clicks;

CREATE POLICY "link_clicks_workspace_access_only"
ON public.link_clicks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.links l 
    WHERE l.id = link_id 
    AND public.has_workspace_access(auth.uid(), l.workspace_id)
  )
);

-- 7. Ensure MFA settings table has proper constraints - make secret_encrypted nullable first
ALTER TABLE public.mfa_settings
ALTER COLUMN secret_encrypted DROP NOT NULL;

-- Now add the mfa_enforced column
ALTER TABLE public.mfa_settings
ADD COLUMN IF NOT EXISTS mfa_enforced BOOLEAN DEFAULT false;

-- 8. Create admin MFA enforcement trigger
CREATE OR REPLACE FUNCTION public.enforce_admin_mfa()
RETURNS TRIGGER AS $$
BEGIN
  -- When user becomes admin, enforce MFA
  IF NEW.role = 'admin' THEN
    INSERT INTO public.mfa_settings (user_id, mfa_enforced, is_enabled)
    VALUES (NEW.user_id, true, false)
    ON CONFLICT (user_id) 
    DO UPDATE SET mfa_enforced = true, updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS enforce_admin_mfa_trigger ON public.user_roles;

-- Create trigger
CREATE TRIGGER enforce_admin_mfa_trigger
AFTER INSERT OR UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_admin_mfa();

-- 9. Ensure all existing admin users have MFA enforced
INSERT INTO public.mfa_settings (user_id, mfa_enforced, is_enabled)
SELECT ur.user_id, true, false
FROM public.user_roles ur
WHERE ur.role = 'admin'
ON CONFLICT (user_id) 
DO UPDATE SET mfa_enforced = true, updated_at = now();

-- 10. Add index for faster WebAuthn domain lookups
CREATE INDEX IF NOT EXISTS idx_user_authenticators_domain 
ON public.user_authenticators(user_id, registered_domain);

-- 11. Add audit log for MFA verification attempts
CREATE TABLE IF NOT EXISTS public.mfa_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  domain TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on MFA audit log
ALTER TABLE public.mfa_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view MFA audit logs
DROP POLICY IF EXISTS "admins_view_mfa_audit" ON public.mfa_audit_log;
CREATE POLICY "admins_view_mfa_audit"
ON public.mfa_audit_log
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Service role can insert audit logs
DROP POLICY IF EXISTS "service_insert_mfa_audit" ON public.mfa_audit_log;
CREATE POLICY "service_insert_mfa_audit"
ON public.mfa_audit_log
FOR INSERT
WITH CHECK (true);

-- 12. Create function to log MFA events
CREATE OR REPLACE FUNCTION public.log_mfa_event(
  p_user_id UUID,
  p_action TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_domain TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.mfa_audit_log (
    user_id, action, ip_address, user_agent, domain, metadata
  ) VALUES (
    p_user_id, p_action, p_ip_address, p_user_agent, p_domain, p_metadata
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;