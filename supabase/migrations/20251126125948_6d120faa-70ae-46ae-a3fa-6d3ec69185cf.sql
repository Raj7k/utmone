-- Allow authenticated users to view their own early_access_request record
CREATE POLICY "Users can view their own early_access_request"
ON public.early_access_requests
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));