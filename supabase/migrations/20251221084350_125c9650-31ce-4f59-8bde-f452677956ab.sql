-- Create demo_requests table for Book Demo form
CREATE TABLE public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  team_size TEXT,
  country_code TEXT,
  phone TEXT,
  challenge TEXT,
  interests TEXT[],
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create early_access_requests table for waitlist
CREATE TABLE public.early_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  team_size TEXT NOT NULL,
  reason_for_joining TEXT,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.early_access_requests(id),
  referral_count INTEGER DEFAULT 0,
  position INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create easter_egg_discoveries table for surprise page tracking
CREATE TABLE public.easter_egg_discoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT,
  device_type TEXT,
  country TEXT,
  user_agent TEXT,
  discovered_at TIMESTAMPTZ DEFAULT now()
);

-- Create support_tickets table for Support page
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create roadmap_items table for public roadmap suggestions
CREATE TABLE public.roadmap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'proposed',
  votes INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.early_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.easter_egg_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow anonymous inserts for public forms
CREATE POLICY "Allow anonymous demo request submissions"
ON public.demo_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anonymous early access submissions"
ON public.early_access_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anonymous easter egg discoveries"
ON public.easter_egg_discoveries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anonymous support ticket submissions"
ON public.support_tickets FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anonymous roadmap suggestions"
ON public.roadmap_items FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public read access to roadmap items only
CREATE POLICY "Allow public read access to roadmap"
ON public.roadmap_items FOR SELECT
TO anon, authenticated
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_demo_requests_updated_at
  BEFORE UPDATE ON public.demo_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_early_access_updated_at
  BEFORE UPDATE ON public.early_access_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate queue position
CREATE OR REPLACE FUNCTION public.calculate_queue_position()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COALESCE(MAX(position), 0) + 1 FROM public.early_access_requests);
END;
$$ LANGUAGE plpgsql;