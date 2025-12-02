-- Secure profiles table from user enumeration and PII exposure
-- Drop ALL existing policies first, then create strict self-only access

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view only their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update only their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert only their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles via function" ON profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;

-- Create strict self-only access policies
-- Users can ONLY view their own profile (no one else's)
CREATE POLICY "Users can view only their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can ONLY update their own profile
CREATE POLICY "Users can update only their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Users can ONLY insert their own profile (id must match auth.uid())
CREATE POLICY "Users can insert only their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Admin-only access for user management (via security definer function)
CREATE POLICY "Admins can view all profiles via function"
ON profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Ensure service role can manage profiles for auth triggers
CREATE POLICY "Service role can manage profiles"
ON profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add index for performance on self-lookups
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- Document the security model
COMMENT ON TABLE profiles IS 'User profiles with strict RLS - users can only access their own profile. Admin access via has_role() security definer function.';