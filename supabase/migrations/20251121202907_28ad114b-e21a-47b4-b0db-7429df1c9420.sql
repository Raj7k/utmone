-- Create landing page sessions table to track visitors and their assigned variants
CREATE TABLE IF NOT EXISTS public.landing_page_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  hero_variant INTEGER NOT NULL CHECK (hero_variant >= 0 AND hero_variant <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT
);

-- Create landing page events table to track user interactions
CREATE TABLE IF NOT EXISTS public.landing_page_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  hero_variant INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES public.landing_page_sessions(session_id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_landing_events_session ON public.landing_page_events(session_id);
CREATE INDEX IF NOT EXISTS idx_landing_events_variant ON public.landing_page_events(hero_variant);
CREATE INDEX IF NOT EXISTS idx_landing_events_type ON public.landing_page_events(event_type);
CREATE INDEX IF NOT EXISTS idx_landing_sessions_variant ON public.landing_page_sessions(hero_variant);
CREATE INDEX IF NOT EXISTS idx_landing_events_created_at ON public.landing_page_events(created_at);

-- Enable RLS on both tables (public access for analytics)
ALTER TABLE public.landing_page_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access for analytics (no auth required for landing page tracking)
CREATE POLICY "Allow public insert on sessions" ON public.landing_page_sessions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public insert on events" ON public.landing_page_events
  FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users to read analytics data
CREATE POLICY "Allow authenticated read on sessions" ON public.landing_page_sessions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on events" ON public.landing_page_events
  FOR SELECT TO authenticated USING (true);