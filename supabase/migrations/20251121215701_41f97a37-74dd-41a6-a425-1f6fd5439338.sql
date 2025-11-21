-- Remove the trigger and function that failed in previous migration
DROP TRIGGER IF EXISTS on_early_access_request_created ON public.early_access_requests;
DROP FUNCTION IF EXISTS notify_admin_on_new_request();