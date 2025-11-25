-- Add ICP (Ideal Customer Profile) fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type TEXT; -- 'individual' or 'organization'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS icp_role TEXT; -- 'marketer', 'developer', 'creator', 'sales', 'events', 'hr', 'other'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_size TEXT; -- '1', '2-10', '11-50', '50+'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS primary_use_case TEXT; -- 'marketing', 'sales', 'events', 'hr', 'development', 'other'

-- Add comment for documentation
COMMENT ON COLUMN profiles.user_type IS 'User type: individual or organization';
COMMENT ON COLUMN profiles.icp_role IS 'User role for ICP segmentation';
COMMENT ON COLUMN profiles.team_size IS 'Team size for organization users';
COMMENT ON COLUMN profiles.primary_use_case IS 'Primary use case for personalization';