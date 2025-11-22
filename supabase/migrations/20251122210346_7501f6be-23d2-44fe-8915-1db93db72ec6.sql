-- Create feature_flags table for runtime configuration control
-- Allows toggling expensive features without redeployment

CREATE TABLE IF NOT EXISTS public.feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key text UNIQUE NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'performance', -- performance, maintenance, experimental
  last_modified_by uuid REFERENCES auth.users(id),
  last_modified_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create index for fast flag lookups
CREATE INDEX idx_feature_flags_key ON public.feature_flags(flag_key);
CREATE INDEX idx_feature_flags_enabled ON public.feature_flags(is_enabled);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Admins can view all feature flags
CREATE POLICY "Admins can view feature flags"
  ON public.feature_flags
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update feature flags
CREATE POLICY "Admins can update feature flags"
  ON public.feature_flags
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can read flags (for edge functions)
CREATE POLICY "Service role can read flags"
  ON public.feature_flags
  FOR SELECT
  USING (true);

-- Insert default feature flags
INSERT INTO public.feature_flags (flag_key, is_enabled, description, category, metadata) VALUES
  ('enable_geolocation', true, 'Process IP geolocation for click analytics', 'performance', '{"impact": "high", "latency_cost_ms": 200}'::jsonb),
  ('enable_ab_testing', true, 'Randomly assign OG variants for A/B testing', 'performance', '{"impact": "low", "latency_cost_ms": 5}'::jsonb),
  ('enable_click_tracking', true, 'Track and log all link clicks', 'performance', '{"impact": "critical", "latency_cost_ms": 10}'::jsonb),
  ('enable_batch_processing', true, 'Batch click inserts every 10 seconds', 'performance', '{"impact": "high", "write_reduction": "100x"}'::jsonb),
  ('enable_cache', true, 'Cache link lookups in Deno KV', 'performance', '{"impact": "critical", "latency_reduction_ms": 250}'::jsonb),
  ('maintenance_mode', false, 'Serve maintenance page instead of redirects', 'maintenance', '{"message": "utm.one is currently undergoing scheduled maintenance. We will be back shortly."}'::jsonb),
  ('enable_og_preview', true, 'Serve Open Graph meta tags for social crawlers', 'performance', '{"impact": "medium", "latency_cost_ms": 50}'::jsonb),
  ('enable_rate_limiting', true, 'Enforce per-IP rate limits on redirects', 'security', '{"limit": 100, "window_minutes": 1}'::jsonb)
ON CONFLICT (flag_key) DO NOTHING;

-- Function to get a feature flag value (cached in edge function)
CREATE OR REPLACE FUNCTION get_feature_flag(flag_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_enabled FROM public.feature_flags WHERE flag_key = flag_name LIMIT 1),
    true -- Default to enabled if flag doesn't exist
  );
$$;

-- Trigger to update last_modified_at on flag changes
CREATE OR REPLACE FUNCTION update_feature_flag_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.last_modified_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_feature_flag_timestamp
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_flag_timestamp();