-- Register utm.click as a system default domain
-- Note: Requires manual DNS setup in Cloudflare and Worker Route configuration

-- First, get the system workspace (assuming first workspace or we'll use a placeholder)
-- In production, this should be linked to an actual system/admin workspace

INSERT INTO public.domains (
  domain,
  workspace_id,
  created_by,
  is_verified,
  is_primary,
  dns_verified_at,
  verification_code
)
SELECT
  'utm.click',
  (SELECT id FROM public.workspaces LIMIT 1), -- Link to first workspace as system domain
  (SELECT owner_id FROM public.workspaces LIMIT 1),
  true, -- Pre-verified since it's a system domain
  false, -- Not primary, go.utm.one remains primary
  NOW(),
  'utm-click-system-domain'
WHERE NOT EXISTS (
  SELECT 1 FROM public.domains WHERE domain = 'utm.click'
);

-- Add comment explaining this is a system domain
COMMENT ON COLUMN public.domains.domain IS 'Domain name. System domains: go.utm.one, utm.click';