-- Fix admin_audit_logs foreign key constraint - make admin_user_id nullable
-- This prevents errors when the referenced user doesn't exist
ALTER TABLE public.admin_audit_logs 
ALTER COLUMN admin_user_id DROP NOT NULL;

-- Drop the problematic foreign key constraint
ALTER TABLE public.admin_audit_logs
DROP CONSTRAINT IF EXISTS admin_audit_logs_admin_user_id_fkey;