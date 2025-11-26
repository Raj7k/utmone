-- Fix function search_path warnings

-- Update audit_api_key_access function to set search_path
CREATE OR REPLACE FUNCTION audit_api_key_access()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Update check_key_rotation function to set search_path
CREATE OR REPLACE FUNCTION check_key_rotation()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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