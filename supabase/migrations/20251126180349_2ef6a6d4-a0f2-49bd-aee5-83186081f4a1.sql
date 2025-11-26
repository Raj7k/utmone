-- Add activation_at column to links table
ALTER TABLE public.links 
ADD COLUMN IF NOT EXISTS activation_at TIMESTAMP WITH TIME ZONE;

-- Add 'scheduled' value to the link_status enum
ALTER TYPE link_status ADD VALUE IF NOT EXISTS 'scheduled';

-- Create index on activation_at for efficient querying of scheduled links
CREATE INDEX IF NOT EXISTS idx_links_activation_at 
ON public.links(activation_at);

-- Create index on status and activation_at for the cron job
CREATE INDEX IF NOT EXISTS idx_links_status_activation 
ON public.links(status, activation_at);