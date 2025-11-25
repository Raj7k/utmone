-- Phase 3: Security Hardening - RLS Policy Tightening and Rate Limiting (Fixed)

-- ============================================
-- 1. Profiles Table - Prevent Email Enumeration
-- ============================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Add strict policy: users can only view their own profile
CREATE POLICY "Users can view only their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Update policy should also be restricted to own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update only their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- ============================================
-- 2. Early Access Requests - Rate Limiting
-- ============================================

-- Create rate limiting table for tracking submissions by IP
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  endpoint text NOT NULL,
  attempt_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate_limit_log
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Service role can manage rate limits
CREATE POLICY "Service role can manage rate limits" 
ON public.rate_limit_log 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_endpoint ON public.rate_limit_log(ip_address, endpoint, window_start);

-- Create rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip_address text,
  p_endpoint text,
  p_max_requests integer DEFAULT 5,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start timestamp with time zone;
  v_attempt_count integer;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up old entries
  DELETE FROM public.rate_limit_log 
  WHERE window_start < v_window_start;
  
  -- Check current attempts
  SELECT COALESCE(SUM(attempt_count), 0) INTO v_attempt_count
  FROM public.rate_limit_log
  WHERE ip_address = p_ip_address
    AND endpoint = p_endpoint
    AND window_start >= v_window_start;
  
  -- If under limit, log attempt and allow
  IF v_attempt_count < p_max_requests THEN
    INSERT INTO public.rate_limit_log (ip_address, endpoint, attempt_count, window_start)
    VALUES (p_ip_address, p_endpoint, 1, now())
    ON CONFLICT (id) DO NOTHING;
    
    RETURN true;
  END IF;
  
  -- Over limit, deny
  RETURN false;
END;
$$;

-- ============================================
-- 3. Link Clicks - Verify Workspace Membership
-- ============================================

-- Update existing link_clicks policy to be more explicit about workspace access
DROP POLICY IF EXISTS "Users can view clicks for links in their workspaces" ON public.link_clicks;

CREATE POLICY "Users can view clicks only for their workspace links" 
ON public.link_clicks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM public.links l
    WHERE l.id = link_clicks.link_id
      AND has_workspace_access(auth.uid(), l.workspace_id)
  )
);

-- ============================================
-- 4. Audit Logging for Security Events
-- ============================================

-- Add function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_user_id uuid DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.admin_audit_logs (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    COALESCE(p_user_id, '00000000-0000-0000-0000-000000000000'::uuid),
    p_event_type,
    'security_event',
    NULL,
    p_metadata,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- ============================================
-- 5. Add Indexes for Performance
-- ============================================

-- Index on profiles for faster lookup
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Index on admin_audit_logs for security event queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.admin_audit_logs(resource_type, created_at DESC);

-- ============================================
-- Comments for Documentation
-- ============================================

COMMENT ON FUNCTION public.check_rate_limit IS 'Rate limiting function to prevent abuse. Returns true if request is allowed, false if rate limit exceeded.';
COMMENT ON FUNCTION public.log_security_event IS 'Logs security-related events (failed logins, rate limit violations, suspicious activity) to audit log.';
COMMENT ON TABLE public.rate_limit_log IS 'Tracks rate limiting attempts by IP address and endpoint to prevent abuse.';