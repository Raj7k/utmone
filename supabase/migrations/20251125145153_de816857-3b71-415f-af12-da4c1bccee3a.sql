-- Security Hardening: RLS Policy Improvements
-- Addresses security audit findings

-- 1. Add secure profile lookup function
CREATE OR REPLACE FUNCTION public.get_profile_by_email_secure(p_email text)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Rate limit: only allow admins to lookup profiles
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized profile lookup';
  END IF;

  -- Log the lookup for audit trail
  PERFORM public.log_security_event(
    'profile_lookup',
    auth.uid(),
    NULL,
    NULL,
    jsonb_build_object('email', p_email)
  );

  RETURN QUERY
  SELECT p.id, p.email, p.full_name
  FROM public.profiles p
  WHERE p.email = p_email
  LIMIT 1;
END;
$$;

-- 2. Add RLS policy to prevent profile enumeration
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = id OR 
  public.has_role(auth.uid(), 'admin')
);

-- 3. Add rate limiting trigger for early access requests
CREATE OR REPLACE FUNCTION public.check_early_access_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count integer;
BEGIN
  -- Check how many requests from this email in last hour
  SELECT COUNT(*) INTO recent_count
  FROM public.early_access_requests
  WHERE email = NEW.email
    AND created_at > NOW() - INTERVAL '1 hour';

  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded for early access requests';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_early_access_rate_limit_trigger ON public.early_access_requests;
CREATE TRIGGER check_early_access_rate_limit_trigger
  BEFORE INSERT ON public.early_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.check_early_access_rate_limit();

-- 4. Add indexes for security queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_resource_type 
  ON public.admin_audit_logs(resource_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action 
  ON public.admin_audit_logs(action, created_at DESC);

-- 5. Comment on security functions
COMMENT ON FUNCTION public.get_profile_by_email_secure IS 
  'Secure profile lookup function with audit logging and admin-only access';

COMMENT ON FUNCTION public.check_early_access_rate_limit IS 
  'Prevents abuse of early access form by rate limiting submissions per email';