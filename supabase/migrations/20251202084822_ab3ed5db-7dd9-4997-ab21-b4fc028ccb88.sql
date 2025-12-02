-- Create MFA settings table for TOTP-based 2FA
CREATE TABLE IF NOT EXISTS public.mfa_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  secret_encrypted TEXT NOT NULL, -- Encrypted TOTP secret
  is_enabled BOOLEAN DEFAULT false,
  recovery_codes_hashed TEXT[], -- Array of bcrypt-hashed recovery codes
  backup_codes_downloaded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_verified_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.mfa_settings ENABLE ROW LEVEL SECURITY;

-- Users can only view and manage their own MFA settings
CREATE POLICY "Users can view own MFA settings"
  ON public.mfa_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own MFA settings"
  ON public.mfa_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own MFA settings"
  ON public.mfa_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all MFA settings (for security auditing)
CREATE POLICY "Admins can view all MFA settings"
  ON public.mfa_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create index for faster lookups
CREATE INDEX idx_mfa_settings_user_id ON public.mfa_settings(user_id);
CREATE INDEX idx_mfa_settings_enabled ON public.mfa_settings(user_id, is_enabled) WHERE is_enabled = true;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_mfa_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mfa_settings_updated_at
  BEFORE UPDATE ON public.mfa_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_mfa_settings_updated_at();

-- Add column to profiles for MFA enforcement tracking
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mfa_enforced BOOLEAN DEFAULT false;

COMMENT ON TABLE public.mfa_settings IS 'Stores encrypted TOTP secrets and hashed recovery codes for 2FA';
COMMENT ON COLUMN public.mfa_settings.secret_encrypted IS 'AES-256 encrypted TOTP secret - never store in plaintext';
COMMENT ON COLUMN public.mfa_settings.recovery_codes_hashed IS 'Bcrypt-hashed recovery codes - 10 codes generated on setup';