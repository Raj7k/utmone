-- Create metrics_snapshots table for historical performance tracking
CREATE TABLE IF NOT EXISTS public.metrics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  flag_key TEXT NOT NULL,
  flag_enabled BOOLEAN NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  
  -- Performance metrics before change
  latency_p95_before INTEGER,
  error_rate_before NUMERIC(5,2),
  cache_hit_rate_before NUMERIC(5,2),
  
  -- Performance metrics after change (populated async)
  latency_p95_after INTEGER,
  error_rate_after NUMERIC(5,2),
  cache_hit_rate_after NUMERIC(5,2),
  
  -- Calculated impact
  latency_impact INTEGER,
  error_rate_impact NUMERIC(5,2),
  cache_hit_rate_impact NUMERIC(5,2),
  
  -- Additional context
  system_load TEXT, -- 'low', 'medium', 'high'
  traffic_pattern TEXT, -- 'normal', 'burst', 'sustained'
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX idx_metrics_snapshots_flag_key ON public.metrics_snapshots(flag_key);
CREATE INDEX idx_metrics_snapshots_timestamp ON public.metrics_snapshots(timestamp DESC);
CREATE INDEX idx_metrics_snapshots_flag_enabled ON public.metrics_snapshots(flag_key, flag_enabled);

-- Enable RLS
ALTER TABLE public.metrics_snapshots ENABLE ROW LEVEL SECURITY;

-- Admins can view all snapshots
CREATE POLICY "Admins can view metrics snapshots"
ON public.metrics_snapshots
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Service role can insert snapshots
CREATE POLICY "Service role can insert metrics snapshots"
ON public.metrics_snapshots
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create alert_configurations table
CREATE TABLE IF NOT EXISTS public.alert_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_name TEXT NOT NULL,
  metric_type TEXT NOT NULL, -- 'latency_p95', 'error_rate', 'cache_hit_rate'
  threshold_value NUMERIC NOT NULL,
  comparison_operator TEXT NOT NULL, -- '>', '<', '>=', '<='
  
  -- Alert channels
  email_enabled BOOLEAN DEFAULT false,
  email_recipients TEXT[],
  slack_enabled BOOLEAN DEFAULT false,
  slack_webhook_url TEXT,
  webhook_enabled BOOLEAN DEFAULT false,
  webhook_url TEXT,
  
  is_enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS for alerts
ALTER TABLE public.alert_configurations ENABLE ROW LEVEL SECURITY;

-- Admins can manage alerts
CREATE POLICY "Admins can manage alerts"
ON public.alert_configurations
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create flag_recommendations table
CREATE TABLE IF NOT EXISTS public.flag_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_type TEXT NOT NULL, -- 'enable', 'disable'
  flag_key TEXT NOT NULL,
  confidence_score NUMERIC(3,2) NOT NULL, -- 0.00 to 1.00
  
  -- Reasoning
  reason TEXT NOT NULL,
  expected_impact JSONB, -- { latency_change: -50, error_rate_change: 0.1 }
  
  -- Context
  current_system_load TEXT,
  current_traffic_pattern TEXT,
  historical_data_points INTEGER,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'auto_applied'
  applied_at TIMESTAMP WITH TIME ZONE,
  applied_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Enable RLS for recommendations
ALTER TABLE public.flag_recommendations ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage recommendations
CREATE POLICY "Admins can view recommendations"
ON public.flag_recommendations
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update recommendations"
ON public.flag_recommendations
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Service role can insert recommendations
CREATE POLICY "Service role can insert recommendations"
ON public.flag_recommendations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_flag_recommendations_status ON public.flag_recommendations(status);
CREATE INDEX idx_flag_recommendations_expires ON public.flag_recommendations(expires_at);
CREATE INDEX idx_flag_recommendations_flag_key ON public.flag_recommendations(flag_key);

COMMENT ON TABLE public.metrics_snapshots IS 'Stores historical system metrics before and after flag changes for impact analysis';
COMMENT ON TABLE public.alert_configurations IS 'Defines alert rules for monitoring system metrics and flag impacts';
COMMENT ON TABLE public.flag_recommendations IS 'AI-generated recommendations for optimal flag configurations based on system state';