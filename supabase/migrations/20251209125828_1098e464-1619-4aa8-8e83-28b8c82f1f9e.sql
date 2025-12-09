-- Add subscription management columns to workspaces table
ALTER TABLE public.workspaces 
ADD COLUMN IF NOT EXISTS previous_plan_tier text,
ADD COLUMN IF NOT EXISTS downgraded_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS data_deletion_scheduled_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active';

-- Add comment for documentation
COMMENT ON COLUMN public.workspaces.previous_plan_tier IS 'Stores the plan tier before downgrade for win-back campaigns';
COMMENT ON COLUMN public.workspaces.downgraded_at IS 'Timestamp when subscription was downgraded to free';
COMMENT ON COLUMN public.workspaces.data_deletion_scheduled_at IS 'Timestamp when data will be deleted (60 days after downgrade)';
COMMENT ON COLUMN public.workspaces.subscription_status IS 'Status: active, expired, grace_period, scheduled_deletion';

-- Add plan_tier column to early_access_invites for new invite system
ALTER TABLE public.early_access_invites
ADD COLUMN IF NOT EXISTS plan_tier text DEFAULT 'starter',
ADD COLUMN IF NOT EXISTS plan_duration_days integer DEFAULT 30;

-- Create index for subscription expiry queries
CREATE INDEX IF NOT EXISTS idx_workspaces_subscription_status ON public.workspaces(subscription_status);
CREATE INDEX IF NOT EXISTS idx_workspaces_plan_expires_at ON public.workspaces(plan_expires_at) WHERE plan_expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_workspaces_data_deletion ON public.workspaces(data_deletion_scheduled_at) WHERE data_deletion_scheduled_at IS NOT NULL;