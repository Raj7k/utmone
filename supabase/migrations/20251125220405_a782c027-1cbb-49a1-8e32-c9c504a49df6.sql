-- Add GTM container ID to workspaces table
ALTER TABLE public.workspaces 
ADD COLUMN IF NOT EXISTS gtm_container_id VARCHAR(20);

COMMENT ON COLUMN public.workspaces.gtm_container_id IS 'Google Tag Manager container ID (format: GTM-XXXXXX) for workspace-level event tracking';