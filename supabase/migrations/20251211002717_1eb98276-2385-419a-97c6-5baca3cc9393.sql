-- Create easter egg discoveries table to track who found the surprise
CREATE TABLE public.easter_egg_discoveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discovered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT, -- 'homepage', 'feature_page', 'direct_qr_scan'
  device_type TEXT, -- 'mobile', 'desktop'
  country TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.easter_egg_discoveries ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can discover)
CREATE POLICY "Anyone can insert discoveries"
ON public.easter_egg_discoveries
FOR INSERT
WITH CHECK (true);

-- Allow public to count discoveries (for showing explorer number)
CREATE POLICY "Anyone can count discoveries"
ON public.easter_egg_discoveries
FOR SELECT
USING (true);