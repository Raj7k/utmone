-- Fix short_url generation to handle path slashes correctly
-- This fixes the triple slash issue (https://utm.one///slug)

ALTER TABLE public.links 
DROP COLUMN IF EXISTS short_url CASCADE;

ALTER TABLE public.links
ADD COLUMN short_url TEXT GENERATED ALWAYS AS (
  'https://' || domain || '/' || 
  CASE 
    WHEN path = '/' OR path = '' THEN ''
    WHEN path LIKE '/%' THEN SUBSTRING(path FROM 2)
    ELSE path
  END || '/' || slug
) STORED;

-- Update existing utm.one links to have correct path
UPDATE public.links
SET path = 'go'
WHERE domain = 'utm.one' AND (path = '/' OR path = '');

-- Add index on domain, path, slug for fast redirect lookups
CREATE INDEX IF NOT EXISTS idx_links_redirect_lookup 
ON public.links(domain, path, slug) 
WHERE status = 'active';