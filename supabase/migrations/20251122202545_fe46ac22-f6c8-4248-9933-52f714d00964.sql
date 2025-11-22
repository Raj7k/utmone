-- Create announcement_configs table to store announcement configurations in database
CREATE TABLE public.announcement_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id text UNIQUE NOT NULL,
  message text NOT NULL,
  cta_text text,
  cta_link text,
  
  -- Scheduling
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  days_of_week integer[],
  time_range_start text, -- HH:MM format
  time_range_end text,   -- HH:MM format
  
  -- Targeting
  user_segment text DEFAULT 'all',
  priority integer NOT NULL DEFAULT 10,
  
  -- Rotation
  rotation_group text,
  rotation_interval_minutes integer,
  
  -- Status
  is_active boolean DEFAULT true,
  
  -- Metadata
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create announcement_impressions table
CREATE TABLE public.announcement_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id text NOT NULL,
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  
  -- Context
  user_segment text,
  referrer text,
  user_agent text,
  
  created_at timestamp with time zone DEFAULT now()
);

-- Create announcement_clicks table
CREATE TABLE public.announcement_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id text NOT NULL,
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  
  -- Context
  cta_link text,
  referrer text,
  user_agent text,
  
  created_at timestamp with time zone DEFAULT now()
);

-- Create announcement_dismissals table
CREATE TABLE public.announcement_dismissals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id text NOT NULL,
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcement_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_dismissals ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Admins can manage everything
CREATE POLICY "Admins can manage announcement configs"
  ON public.announcement_configs
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view impressions"
  ON public.announcement_impressions
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view clicks"
  ON public.announcement_clicks
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view dismissals"
  ON public.announcement_dismissals
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_announcement_impressions_announcement_id ON public.announcement_impressions(announcement_id);
CREATE INDEX idx_announcement_impressions_created_at ON public.announcement_impressions(created_at);
CREATE INDEX idx_announcement_clicks_announcement_id ON public.announcement_clicks(announcement_id);
CREATE INDEX idx_announcement_clicks_created_at ON public.announcement_clicks(created_at);
CREATE INDEX idx_announcement_dismissals_announcement_id ON public.announcement_dismissals(announcement_id);

-- Create updated_at trigger
CREATE TRIGGER update_announcement_configs_updated_at
  BEFORE UPDATE ON public.announcement_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();