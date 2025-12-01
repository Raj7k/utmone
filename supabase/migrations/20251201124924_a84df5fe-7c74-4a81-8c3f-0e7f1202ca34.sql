-- Create experiments table for Bayesian A/B testing
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  experiment_name TEXT NOT NULL,
  variant_a_label TEXT NOT NULL DEFAULT 'Control',
  variant_b_label TEXT NOT NULL DEFAULT 'Variant',
  variant_a_clicks INTEGER NOT NULL DEFAULT 0,
  variant_b_clicks INTEGER NOT NULL DEFAULT 0,
  variant_a_conversions INTEGER NOT NULL DEFAULT 0,
  variant_b_conversions INTEGER NOT NULL DEFAULT 0,
  probability_b_wins NUMERIC,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
  winner_variant TEXT CHECK (winner_variant IN ('A', 'B', 'inconclusive')),
  declared_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create system_load_metrics table for adaptive throttling
CREATE TABLE IF NOT EXISTS public.system_load_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpu_load_percent NUMERIC NOT NULL,
  memory_usage_percent NUMERIC NOT NULL,
  active_connections INTEGER NOT NULL,
  requests_per_second INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rate_limit_tiers table for dynamic limits
CREATE TABLE IF NOT EXISTS public.rate_limit_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_threshold_low INTEGER NOT NULL DEFAULT 50,
  load_threshold_high INTEGER NOT NULL DEFAULT 80,
  free_tier_limit INTEGER NOT NULL DEFAULT 100,
  pro_tier_limit INTEGER NOT NULL DEFAULT 500,
  business_tier_limit INTEGER NOT NULL DEFAULT 1000,
  enterprise_tier_limit INTEGER NOT NULL DEFAULT 2000,
  burst_multiplier NUMERIC NOT NULL DEFAULT 10.0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default rate limit configuration
INSERT INTO public.rate_limit_tiers (
  load_threshold_low,
  load_threshold_high,
  free_tier_limit,
  pro_tier_limit,
  business_tier_limit,
  enterprise_tier_limit,
  burst_multiplier
) VALUES (50, 80, 100, 500, 1000, 2000, 10.0)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_experiments_link_id ON public.experiments(link_id);
CREATE INDEX IF NOT EXISTS idx_experiments_workspace_id ON public.experiments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON public.experiments(status);
CREATE INDEX IF NOT EXISTS idx_system_load_recorded_at ON public.system_load_metrics(recorded_at DESC);

-- Enable RLS
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_load_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_tiers ENABLE ROW LEVEL SECURITY;

-- RLS policies for experiments
CREATE POLICY "Users can view experiments in their workspace"
ON public.experiments
FOR SELECT
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
    UNION
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create experiments in their workspace"
ON public.experiments
FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
    UNION
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Users can update experiments in their workspace"
ON public.experiments
FOR UPDATE
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
    UNION
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  )
);

-- RLS policies for system_load_metrics
CREATE POLICY "Service role can insert system load metrics"
ON public.system_load_metrics
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view system load metrics"
ON public.system_load_metrics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for rate_limit_tiers
CREATE POLICY "Everyone can view rate limit tiers"
ON public.rate_limit_tiers
FOR SELECT
USING (true);

CREATE POLICY "Admins can update rate limit tiers"
ON public.rate_limit_tiers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to update experiment probability
CREATE OR REPLACE FUNCTION public.update_experiment_probability()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Probability calculation will be done in application layer using Monte Carlo
  -- This trigger just ensures updated_at is refreshed
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_experiment_probability
BEFORE UPDATE ON experiments
FOR EACH ROW
EXECUTE FUNCTION update_experiment_probability();