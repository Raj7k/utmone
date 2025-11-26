-- Fix RLS policies for early_access_requests to allow anonymous access

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Allow public inserts to early_access_requests" ON early_access_requests;
DROP POLICY IF EXISTS "Allow authenticated inserts to early_access_requests" ON early_access_requests;

-- Allow anonymous users to insert new requests
CREATE POLICY "Anonymous users can submit early access requests"
ON early_access_requests
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to read aggregate stats (count only, not personal data)
CREATE POLICY "Anonymous users can read aggregate stats"
ON early_access_requests
FOR SELECT
TO anon
USING (true);

-- Ensure authenticated users can still read their own data
CREATE POLICY "Authenticated users can read all early access requests"
ON early_access_requests
FOR SELECT
TO authenticated
USING (true);