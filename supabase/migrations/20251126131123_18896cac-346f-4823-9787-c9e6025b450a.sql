-- Approve super admin early access request
UPDATE public.early_access_requests
SET status = 'approved', approval_timestamp = now()
WHERE email = 'myselfrajnishkumar@gmail.com'
AND status = 'pending';