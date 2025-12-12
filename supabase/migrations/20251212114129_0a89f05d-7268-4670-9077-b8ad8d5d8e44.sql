-- Fix visitor_id type mismatch: UUID → TEXT
-- The identity-matching edge function generates TEXT visitor IDs like 'v_abc123...'
-- but these columns were UUID type, causing "invalid input syntax for type uuid" errors

-- Step 1: Fix link_clicks.visitor_id column
ALTER TABLE public.link_clicks 
ALTER COLUMN visitor_id TYPE TEXT USING visitor_id::TEXT;

-- Step 2: Fix attribution_journeys.visitor_id column  
ALTER TABLE public.attribution_journeys 
ALTER COLUMN visitor_id TYPE TEXT USING visitor_id::TEXT;

-- Step 3: Fix identity_edges source and target visitor IDs
ALTER TABLE public.identity_edges
ALTER COLUMN source_visitor_id TYPE TEXT USING source_visitor_id::TEXT;

ALTER TABLE public.identity_edges
ALTER COLUMN target_visitor_id TYPE TEXT USING target_visitor_id::TEXT;

-- Step 4: Fix visitor_identities.visitor_id column
ALTER TABLE public.visitor_identities
ALTER COLUMN visitor_id TYPE TEXT USING visitor_id::TEXT;

-- Step 5: Fix journey_events.visitor_id column
ALTER TABLE public.journey_events
ALTER COLUMN visitor_id TYPE TEXT USING visitor_id::TEXT;

-- Step 6: Fix conversion_events.visitor_id column
ALTER TABLE public.conversion_events
ALTER COLUMN visitor_id TYPE TEXT USING visitor_id::TEXT;