-- Add activation metrics to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS first_link_created_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS first_qr_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS first_analytics_viewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS team_members_invited_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS activation_score INTEGER DEFAULT 0;

-- Create email_campaigns table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_type TEXT NOT NULL,
  template_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  send_delay_days INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_queue table
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.early_access_requests(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_notifications table
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create fraud_detection_logs table
CREATE TABLE IF NOT EXISTS public.fraud_detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.early_access_requests(id) ON DELETE CASCADE,
  detection_type TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  details JSONB,
  flagged_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add fraud flags to early_access_requests
ALTER TABLE public.early_access_requests
ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fraud_risk_score INTEGER DEFAULT 0;

-- Enable RLS on new tables
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_detection_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_campaigns
CREATE POLICY "Admins can manage email campaigns"
  ON public.email_campaigns
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS policies for email_queue
CREATE POLICY "Admins can view email queue"
  ON public.email_queue
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS policies for user_notifications
CREATE POLICY "Users can view their own notifications"
  ON public.user_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.user_notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for fraud_detection_logs
CREATE POLICY "Admins can view fraud logs"
  ON public.fraud_detection_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON public.email_queue(scheduled_at, status);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user ON public.user_notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_user ON public.fraud_detection_logs(user_id, flagged_at DESC);
CREATE INDEX IF NOT EXISTS idx_early_access_fraud ON public.early_access_requests(is_flagged, fraud_risk_score DESC);

-- Create materialized view for analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS public.waitlist_analytics AS
SELECT
  COUNT(*) FILTER (WHERE status = 'pending') as total_waitlist,
  COUNT(*) FILTER (WHERE status = 'approved') as total_approved,
  COUNT(*) FILTER (WHERE referred_by IS NOT NULL) as referral_based_signups,
  AVG(engagement_score) as avg_engagement_score,
  AVG(fit_score) as avg_fit_score,
  AVG(total_access_score) as avg_total_score,
  COUNT(DISTINCT company_domain) as unique_companies,
  COUNT(*) FILTER (WHERE is_flagged = true) as flagged_users,
  COUNT(*) FILTER (WHERE created_at > now() - interval '7 days') as signups_last_7_days,
  COUNT(*) FILTER (WHERE created_at > now() - interval '30 days') as signups_last_30_days
FROM public.early_access_requests;

-- Create function to refresh analytics
CREATE OR REPLACE FUNCTION public.refresh_waitlist_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.waitlist_analytics;
END;
$$;

-- Create trigger to update activation score
CREATE OR REPLACE FUNCTION public.calculate_activation_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Each milestone is worth 20 points (5 milestones = 100%)
  IF NEW.first_link_created_at IS NOT NULL THEN
    score := score + 20;
  END IF;
  
  IF NEW.first_qr_generated_at IS NOT NULL THEN
    score := score + 20;
  END IF;
  
  IF NEW.first_analytics_viewed_at IS NOT NULL THEN
    score := score + 20;
  END IF;
  
  IF NEW.team_members_invited_count > 0 THEN
    score := score + 20;
  END IF;
  
  IF NEW.onboarding_completed = true THEN
    score := score + 20;
  END IF;
  
  NEW.activation_score := score;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_activation_score
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_activation_score();