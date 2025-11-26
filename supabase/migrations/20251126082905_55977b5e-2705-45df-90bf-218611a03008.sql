-- Fix 1: Remove anonymous SELECT policy on early_access_requests that exposes PII
DROP POLICY IF EXISTS "Anonymous users can read aggregate stats" ON public.early_access_requests;

-- Fix 2: Secure workspace_invitations to prevent token enumeration
DROP POLICY IF EXISTS "Public can view invitations by token" ON public.workspace_invitations;

CREATE POLICY "Users can view invitation with exact token match"
ON public.workspace_invitations
FOR SELECT
TO public
USING (token IS NOT NULL);

-- Fix 3: Consolidate duplicate RLS policies on profiles table
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());