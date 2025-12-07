-- Fix conversion_events schema for pixel tracking
-- 1. Make link_id nullable (allow events without link attribution)
ALTER TABLE conversion_events 
  ALTER COLUMN link_id DROP NOT NULL;

-- 2. Change visitor_id from UUID to TEXT to match pixel SDK format (v_xxx)
ALTER TABLE conversion_events 
  ALTER COLUMN visitor_id TYPE text USING visitor_id::text;

-- 3. Also fix journey_events.visitor_id if it has same issue
ALTER TABLE journey_events 
  ALTER COLUMN visitor_id TYPE text USING visitor_id::text;