-- Final fix: Ensure profiles table is fully secured with RLS enabled and no public access
-- This addresses: profiles_table_public_exposure

-- Ensure RLS is enabled on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL policies (including any we might have missed)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON profiles';
    END LOOP;
END $$;

-- Create strict self-only access policies
-- Users can ONLY view their own profile
CREATE POLICY "authenticated_users_own_profile_select"
ON profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can ONLY update their own profile
CREATE POLICY "authenticated_users_own_profile_update"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Users can ONLY insert their own profile
CREATE POLICY "authenticated_users_own_profile_insert"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Admins can view all profiles (for user management)
CREATE POLICY "admin_users_all_profiles_select"
ON profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Service role can manage all profiles (for auth triggers)
CREATE POLICY "service_role_full_access"
ON profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add performance index
CREATE INDEX IF NOT EXISTS idx_profiles_auth_uid ON profiles(id);

-- Document security model
COMMENT ON TABLE profiles IS 'Profiles table with strict RLS. Users: own profile only. Admins: all profiles via has_role(). No public/anon access allowed.';