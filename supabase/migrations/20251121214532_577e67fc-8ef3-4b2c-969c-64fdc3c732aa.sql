-- Disable RLS on landing page analytics tables
-- These tables track anonymous public visitors and should allow public inserts

ALTER TABLE public.landing_page_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_events DISABLE ROW LEVEL SECURITY;