-- Set mfa_enforced = true for all admin users
UPDATE profiles
SET mfa_enforced = true
WHERE id IN (
  SELECT user_id FROM user_roles WHERE role = 'admin'
);

-- Update registered_domain for existing authenticators that have NULL
UPDATE user_authenticators
SET registered_domain = 'utm.one'
WHERE registered_domain IS NULL;