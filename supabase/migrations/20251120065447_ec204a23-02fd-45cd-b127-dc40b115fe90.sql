-- Add Open Graph metadata fields to links table
ALTER TABLE public.links
ADD COLUMN og_title TEXT,
ADD COLUMN og_description TEXT,
ADD COLUMN og_image TEXT;

-- Add comment explaining these fields
COMMENT ON COLUMN public.links.og_title IS 'Custom Open Graph title for social media preview';
COMMENT ON COLUMN public.links.og_description IS 'Custom Open Graph description for social media preview';
COMMENT ON COLUMN public.links.og_image IS 'URL to custom Open Graph image for social media preview';