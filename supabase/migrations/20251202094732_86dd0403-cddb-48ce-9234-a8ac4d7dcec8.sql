-- Add admin recovery codes column to mfa_settings
ALTER TABLE mfa_settings 
ADD COLUMN IF NOT EXISTS admin_recovery_codes_hashed text[];

-- Add comment explaining purpose
COMMENT ON COLUMN mfa_settings.admin_recovery_codes_hashed IS 'Emergency recovery codes specifically for admin login recovery. Higher entropy than regular TOTP recovery codes. Single-use and hashed.';