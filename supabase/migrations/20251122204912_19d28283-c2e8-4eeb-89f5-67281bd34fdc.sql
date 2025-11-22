-- Create database function to increment link click counters efficiently
CREATE OR REPLACE FUNCTION public.increment_link_clicks(
  p_link_id uuid,
  p_total_increment integer,
  p_unique_increment integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.links
  SET 
    total_clicks = COALESCE(total_clicks, 0) + p_total_increment,
    unique_clicks = COALESCE(unique_clicks, 0) + p_unique_increment,
    last_clicked_at = NOW()
  WHERE id = p_link_id;
END;
$$;