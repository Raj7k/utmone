-- Fix early_access_requests RLS policy to use auth.email() directly
DROP POLICY IF EXISTS "Users can view their own early_access_request" ON early_access_requests;

CREATE POLICY "Users can view their own early_access_request"
ON early_access_requests
FOR SELECT
TO authenticated
USING (email = auth.email()::text);