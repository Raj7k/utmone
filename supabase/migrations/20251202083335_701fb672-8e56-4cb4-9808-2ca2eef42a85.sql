-- Create user_authenticators table for WebAuthn credentials
CREATE TABLE IF NOT EXISTS public.user_authenticators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,
  device_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Add index for faster lookups
CREATE INDEX idx_user_authenticators_user_id ON public.user_authenticators(user_id);
CREATE INDEX idx_user_authenticators_credential_id ON public.user_authenticators(credential_id);

-- Enable RLS
ALTER TABLE public.user_authenticators ENABLE ROW LEVEL SECURITY;

-- Users can view their own authenticators
CREATE POLICY "Users can view own authenticators"
  ON public.user_authenticators
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own authenticators
CREATE POLICY "Users can delete own authenticators"
  ON public.user_authenticators
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can insert authenticators (via edge function)
CREATE POLICY "Service role can insert authenticators"
  ON public.user_authenticators
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role can update authenticators (via edge function)
CREATE POLICY "Service role can update authenticators"
  ON public.user_authenticators
  FOR UPDATE
  TO service_role
  USING (true);

-- Add mfa_verified_at to profiles table to track MFA session
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mfa_verified_at TIMESTAMP WITH TIME ZONE;

-- Create function to check if MFA is required
CREATE OR REPLACE FUNCTION public.requires_mfa_verification(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_has_authenticators BOOLEAN;
  v_mfa_valid BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = p_user_id AND role = 'admin'
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN false;
  END IF;
  
  -- Check if user has registered authenticators
  SELECT EXISTS (
    SELECT 1 FROM user_authenticators
    WHERE user_id = p_user_id
  ) INTO v_has_authenticators;
  
  IF NOT v_has_authenticators THEN
    RETURN false; -- No MFA required if not set up yet
  END IF;
  
  -- Check if MFA verification is still valid (12 hours)
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_user_id
    AND mfa_verified_at > now() - interval '12 hours'
  ) INTO v_mfa_valid;
  
  RETURN NOT v_mfa_valid;
END;
$$;