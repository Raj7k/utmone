-- Add redirect type and custom expiry message to links table
ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS redirect_type text DEFAULT '302' CHECK (redirect_type IN ('301', '302'));

ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS custom_expiry_message text;

-- Add index on domain, path, and slug for fast lookups in redirect engine
CREATE INDEX IF NOT EXISTS idx_links_domain_path_slug ON public.links(domain, path, slug);

-- Add index on link_id for link_clicks for faster analytics queries
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON public.link_clicks(link_id);

-- Add index on clicked_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON public.link_clicks(clicked_at DESC);