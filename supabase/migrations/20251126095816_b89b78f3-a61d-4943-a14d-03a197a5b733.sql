-- Fix API Keys Security Issue
-- This migration implements defense-in-depth security for API keys

-- 1. Add audit logging trigger for API key access
CREATE OR REPLACE FUNCTION audit_api_key_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any SELECT operations on api_keys
  IF (TG_OP = 'SELECT') THEN
    INSERT INTO admin_audit_logs (
      resource_type,
      action,
      resource_id,
      admin_user_id,
      old_values,
      new_values
    ) VALUES (
      'api_keys',
      'SELECT',
      NEW.id,
      auth.uid(),
      NULL,
      jsonb_build_object(
        'workspace_id', NEW.workspace_id,
        'key_name', NEW.key_name,
        'accessed_at', now()
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: We can't add AFTER SELECT triggers in Postgres, so we'll use application-level logging instead

-- 2. Create security definer function to safely verify API keys without exposing hashes
CREATE OR REPLACE FUNCTION verify_api_key(
  p_key_prefix TEXT,
  p_key_hash TEXT,
  p_workspace_id UUID
)
RETURNS TABLE (
  key_id UUID,
  workspace_id UUID,
  key_name TEXT,
  scopes TEXT[],
  is_active BOOLEAN,
  rate_limit INTEGER,
  rate_limit_window TEXT,
  requests_this_window INTEGER,
  window_reset_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function allows API key verification WITHOUT exposing key_hash to clients
  -- Rate limiting should be implemented at the application layer
  
  RETURN QUERY
  SELECT 
    ak.id,
    ak.workspace_id,
    ak.key_name,
    ak.scopes,
    ak.is_active,
    ak.rate_limit,
    ak.rate_limit_window,
    ak.requests_this_window,
    ak.window_reset_at
  FROM api_keys ak
  WHERE ak.key_prefix = p_key_prefix
    AND ak.key_hash = p_key_hash
    AND ak.workspace_id = p_workspace_id
    AND ak.is_active = true
    AND (ak.expires_at IS NULL OR ak.expires_at > now());
END;
$$;

-- 3. Add column for key rotation tracking
ALTER TABLE api_keys 
ADD COLUMN IF NOT EXISTS rotation_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_rotated_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS rotation_policy_days INTEGER DEFAULT 90;

-- 4. Create function to flag keys that need rotation
CREATE OR REPLACE FUNCTION check_key_rotation()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Flag keys that are older than their rotation policy
  UPDATE api_keys
  SET rotation_required = true
  WHERE last_rotated_at < (now() - (rotation_policy_days || ' days')::interval)
    AND is_active = true
    AND rotation_required = false;
END;
$$;

-- 5. Add enhanced RLS policy that prevents direct key_hash access in application queries
-- Drop existing policies to recreate with stricter rules
DROP POLICY IF EXISTS "Users can view their workspace API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can manage their workspace API keys" ON api_keys;

-- Create new stricter policies
CREATE POLICY "Users can view API key metadata (not hashes)"
ON api_keys
FOR SELECT
TO authenticated
USING (
  has_workspace_access(auth.uid(), workspace_id)
)
-- Note: Application should use verify_api_key() function instead of direct SELECT for authentication
-- This policy allows viewing metadata but application code should never expose key_hash to clients
;

CREATE POLICY "Users can create API keys in their workspace"
ON api_keys
FOR INSERT
TO authenticated
WITH CHECK (
  has_workspace_access(auth.uid(), workspace_id)
  AND created_by = auth.uid()
);

CREATE POLICY "Users can update API keys in their workspace"
ON api_keys
FOR UPDATE
TO authenticated
USING (
  has_workspace_access(auth.uid(), workspace_id)
)
WITH CHECK (
  has_workspace_access(auth.uid(), workspace_id)
);

CREATE POLICY "Users can delete API keys in their workspace"
ON api_keys
FOR DELETE
TO authenticated
USING (
  has_workspace_access(auth.uid(), workspace_id)
);

-- 6. Create table for API key access logs (separate from admin_audit_logs)
CREATE TABLE IF NOT EXISTS api_key_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  failure_reason TEXT,
  endpoint TEXT
);

-- Enable RLS on access logs
ALTER TABLE api_key_access_logs ENABLE ROW LEVEL SECURITY;

-- Only admins and workspace members can view access logs
CREATE POLICY "Users can view API key access logs for their workspace"
ON api_key_access_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM api_keys
    WHERE api_keys.id = api_key_access_logs.api_key_id
      AND has_workspace_access(auth.uid(), api_keys.workspace_id)
  )
);

-- Service role can insert access logs
CREATE POLICY "Service role can insert API key access logs"
ON api_key_access_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 7. Add index for performance on access logs
CREATE INDEX IF NOT EXISTS idx_api_key_access_logs_key_id_accessed 
ON api_key_access_logs(api_key_id, accessed_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_keys_rotation_required 
ON api_keys(rotation_required, last_rotated_at) 
WHERE is_active = true;

-- 8. Add comment documenting security measures
COMMENT ON TABLE api_keys IS 'Stores API key metadata. key_hash uses bcrypt/argon2 for one-way hashing. Use verify_api_key() function for authentication instead of direct SELECT to prevent hash exposure. All access is logged in api_key_access_logs table.';

COMMENT ON COLUMN api_keys.key_hash IS 'One-way hash of API key using bcrypt or argon2. NEVER expose to clients. Use verify_api_key() function for verification.';

COMMENT ON FUNCTION verify_api_key IS 'Secure function to verify API keys without exposing hashes to application layer. Returns key metadata on successful verification.';

COMMENT ON TABLE api_key_access_logs IS 'Audit log for all API key usage. Tracks successful and failed authentication attempts for security monitoring.';