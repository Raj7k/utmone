-- Enable Realtime for link_clicks table for live analytics updates
DO $$ 
BEGIN
  -- Try to add link_clicks to realtime publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.link_clicks;
EXCEPTION 
  WHEN duplicate_object THEN
    -- Table already in publication, ignore
    NULL;
END $$;