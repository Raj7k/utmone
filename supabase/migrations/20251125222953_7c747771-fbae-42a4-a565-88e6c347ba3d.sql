-- Drop the problematic RLS policy that creates circular dependency
DROP POLICY IF EXISTS "Pending invitees can view inviter profile" ON public.profiles;

-- Add invited_by_name column to workspace_invitations for denormalization
ALTER TABLE public.workspace_invitations 
ADD COLUMN IF NOT EXISTS invited_by_name TEXT;