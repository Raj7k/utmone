-- Add rejection_reason column to links table
ALTER TABLE public.links 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_links_status_workspace 
ON public.links(status, workspace_id);

COMMENT ON COLUMN public.links.rejection_reason IS 'Reason provided by admin when rejecting a link approval request';