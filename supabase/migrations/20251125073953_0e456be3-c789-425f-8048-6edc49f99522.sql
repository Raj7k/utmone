-- Add rate limiting tracking columns to api_keys (if not exists)
ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS requests_this_window INTEGER DEFAULT 0;
ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS window_reset_at TIMESTAMPTZ DEFAULT now();

-- Create function to reset rate limit window
CREATE OR REPLACE FUNCTION public.reset_rate_limit_if_needed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.window_reset_at < now() THEN
    NEW.requests_this_window := 0;
    NEW.window_reset_at := now() + (NEW.rate_limit_window)::interval;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS check_rate_limit_window ON public.api_keys;
CREATE TRIGGER check_rate_limit_window
BEFORE UPDATE ON public.api_keys
FOR EACH ROW EXECUTE FUNCTION public.reset_rate_limit_if_needed();