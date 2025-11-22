-- Add new fields to early_access_requests table
ALTER TABLE public.early_access_requests 
  ADD COLUMN role text,
  ADD COLUMN reason_for_joining text,
  ADD COLUMN reason_details text,
  ADD COLUMN how_heard text,
  ADD COLUMN desired_domain text,
  ADD COLUMN engagement_score integer DEFAULT 0,
  ADD COLUMN referral_score integer DEFAULT 0,
  ADD COLUMN fit_score integer DEFAULT 0,
  ADD COLUMN total_access_score integer DEFAULT 0,
  ADD COLUMN access_level integer DEFAULT 0,
  ADD COLUMN referral_code text UNIQUE,
  ADD COLUMN referred_by uuid REFERENCES public.early_access_requests(id);

-- Create index on referral_code for fast lookups
CREATE INDEX idx_early_access_referral_code ON public.early_access_requests(referral_code);

-- Create index on access_level for filtering
CREATE INDEX idx_early_access_access_level ON public.early_access_requests(access_level);

-- Create waitlist_engagement_events table for tracking user interactions
CREATE TABLE public.waitlist_engagement_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_user_id uuid REFERENCES public.early_access_requests(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb,
  page_path text,
  referrer text,
  user_agent text,
  ip_address text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on waitlist_engagement_events
ALTER TABLE public.waitlist_engagement_events ENABLE ROW LEVEL SECURITY;

-- Admins can view all engagement events
CREATE POLICY "Admins can view all engagement events"
  ON public.waitlist_engagement_events
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow public inserts for tracking (edge function will use service role)
-- No public policy needed - edge function uses service role

-- Create index on waitlist_user_id for aggregations
CREATE INDEX idx_waitlist_engagement_user ON public.waitlist_engagement_events(waitlist_user_id);

-- Create index on event_type for filtering
CREATE INDEX idx_waitlist_engagement_type ON public.waitlist_engagement_events(event_type);

-- Create index on created_at for time-based queries
CREATE INDEX idx_waitlist_engagement_created ON public.waitlist_engagement_events(created_at DESC);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    new_code := substring(md5(random()::text || clock_timestamp()::text) from 1 for 8);
    
    -- Check if code already exists
    SELECT EXISTS(
      SELECT 1 FROM public.early_access_requests WHERE referral_code = new_code
    ) INTO code_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- Trigger to auto-generate referral code on insert
CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_referral_code_trigger
  BEFORE INSERT ON public.early_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_referral_code();