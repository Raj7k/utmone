-- Create table for analytics refresh status tracking
CREATE TABLE IF NOT EXISTS public.analytics_refresh_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_ms INTEGER,
  status TEXT NOT NULL,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_analytics_refresh_status_created_at 
ON public.analytics_refresh_status(created_at DESC);

-- Create table for feature flags cache
CREATE TABLE IF NOT EXISTS public.feature_flags_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,
  cache_data JSONB,
  invalidated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS policies (admin only)
ALTER TABLE public.analytics_refresh_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read analytics refresh status"
  ON public.analytics_refresh_status FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can insert analytics refresh status"
  ON public.analytics_refresh_status FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only admins can read feature flags cache"
  ON public.feature_flags_cache FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage feature flags cache"
  ON public.feature_flags_cache FOR ALL
  TO service_role
  USING (true);