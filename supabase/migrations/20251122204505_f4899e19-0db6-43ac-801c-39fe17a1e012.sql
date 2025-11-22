-- Week 2: Admin Audit Logs Table
-- Tracks all admin actions for security compliance and accountability

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL, -- 'create', 'update', 'delete', 'approve', 'reject', 'pause', 'archive'
  resource_type text NOT NULL, -- 'link', 'announcement', 'waitlist_user', 'domain', 'og_variant', 'qr_code'
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes for efficient audit log queries
CREATE INDEX idx_audit_logs_admin ON public.admin_audit_logs(admin_user_id, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON public.admin_audit_logs(resource_type, resource_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.admin_audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_logs_created ON public.admin_audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view audit logs
CREATE POLICY "Admins can view all audit logs"
ON public.admin_audit_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- RLS Policy: System can insert audit logs (via service role)
CREATE POLICY "Service role can insert audit logs"
ON public.admin_audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_admin_user_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id uuid,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
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
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    p_admin_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

COMMENT ON TABLE public.admin_audit_logs IS 'Audit log of all admin actions for security compliance';
COMMENT ON FUNCTION public.log_admin_action IS 'Helper function to log admin actions with proper metadata';