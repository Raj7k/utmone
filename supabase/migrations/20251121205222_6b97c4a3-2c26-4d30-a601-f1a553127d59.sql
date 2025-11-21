-- Enable RLS policies for public landing page analytics tracking
-- These tables track anonymous visitor behavior on the public landing page

-- Policy for landing_page_sessions: Allow public inserts for session tracking
CREATE POLICY "Allow public insert for landing page sessions"
ON public.landing_page_sessions
FOR INSERT
TO public
WITH CHECK (true);

-- Policy for landing_page_events: Allow public inserts for event tracking
CREATE POLICY "Allow public insert for landing page events"
ON public.landing_page_events
FOR INSERT
TO public
WITH CHECK (true);

-- Policy for landing_page_sessions: Allow authenticated users to read all sessions (for admin dashboard)
CREATE POLICY "Allow authenticated users to read landing page sessions"
ON public.landing_page_sessions
FOR SELECT
TO authenticated
USING (true);

-- Policy for landing_page_events: Allow authenticated users to read all events (for admin dashboard)
CREATE POLICY "Allow authenticated users to read landing page events"
ON public.landing_page_events
FOR SELECT
TO authenticated
USING (true);