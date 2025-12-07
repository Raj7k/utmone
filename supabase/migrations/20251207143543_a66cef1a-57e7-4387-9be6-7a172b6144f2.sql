-- Enable REPLICA IDENTITY FULL for real-time subscriptions with filters
-- This ensures ALL columns (including workspace_id) are broadcast in realtime payloads

ALTER TABLE conversion_events REPLICA IDENTITY FULL;
ALTER TABLE journey_events REPLICA IDENTITY FULL;