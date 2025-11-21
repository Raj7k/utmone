-- Re-enable RLS on landing page analytics tables
ALTER TABLE public.landing_page_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_events ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on these tables
DROP POLICY IF EXISTS "Allow public inserts to landing_page_sessions" ON public.landing_page_sessions;
DROP POLICY IF EXISTS "Allow public inserts to landing_page_events" ON public.landing_page_events;

-- Create policies that allow anonymous visitors to insert analytics data
CREATE POLICY "Allow public inserts to landing_page_sessions"
  ON public.landing_page_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public inserts to landing_page_events"
  ON public.landing_page_events
  FOR INSERT
  TO anon
  WITH CHECK (true);