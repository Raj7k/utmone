-- Enable realtime on conversion_events table for pixel debugger
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversion_events;