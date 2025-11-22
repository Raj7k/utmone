-- Drop all existing duplicate policies on landing_page_sessions
DROP POLICY IF EXISTS "Allow authenticated users to read landing page sessions" ON public.landing_page_sessions;
DROP POLICY IF EXISTS "Allow public inserts to landing_page_sessions" ON public.landing_page_sessions;
DROP POLICY IF EXISTS "Allow public insert on sessions" ON public.landing_page_sessions;
DROP POLICY IF EXISTS "Allow authenticated read on sessions" ON public.landing_page_sessions;
DROP POLICY IF EXISTS "Allow public insert for landing page sessions" ON public.landing_page_sessions;

-- Drop all existing duplicate policies on landing_page_events
DROP POLICY IF EXISTS "Allow authenticated users to read landing page events" ON public.landing_page_events;
DROP POLICY IF EXISTS "Allow public inserts to landing_page_events" ON public.landing_page_events;
DROP POLICY IF EXISTS "Allow public insert on events" ON public.landing_page_events;
DROP POLICY IF EXISTS "Allow authenticated read on events" ON public.landing_page_events;
DROP POLICY IF EXISTS "Allow public insert for landing page events" ON public.landing_page_events;

-- Create clean policies for landing_page_sessions
-- Authenticated users can read for analytics dashboard
CREATE POLICY "Authenticated users can read sessions"
  ON public.landing_page_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- No INSERT policy needed - edge function uses service role which bypasses RLS

-- Create clean policies for landing_page_events
-- Authenticated users can read for analytics dashboard
CREATE POLICY "Authenticated users can read events"
  ON public.landing_page_events
  FOR SELECT
  TO authenticated
  USING (true);

-- No INSERT policy needed - edge function uses service role which bypasses RLS