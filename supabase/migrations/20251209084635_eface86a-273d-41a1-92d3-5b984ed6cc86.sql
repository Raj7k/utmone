-- Add control_city column to field_events for scientific comparison
ALTER TABLE public.field_events 
ADD COLUMN IF NOT EXISTS control_city text;

-- Add confidence interval columns
ALTER TABLE public.field_events 
ADD COLUMN IF NOT EXISTS halo_visitors_low integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS halo_visitors_high integer DEFAULT 0;

-- Add audit/methodology metadata
ALTER TABLE public.field_events 
ADD COLUMN IF NOT EXISTS calculation_metadata jsonb DEFAULT '{}'::jsonb;

-- Update the calculate_city_baseline function to support control city
CREATE OR REPLACE FUNCTION calculate_city_baseline_with_control(
  p_workspace_id uuid,
  p_target_city text,
  p_control_city text,
  p_event_start timestamp with time zone,
  p_event_end timestamp with time zone,
  p_baseline_days integer DEFAULT 30
)
RETURNS TABLE(
  -- Target city metrics
  baseline_daily_average numeric,
  baseline_total_visitors bigint,
  event_visitors bigint,
  halo_visitors bigint,
  halo_visitors_low bigint,
  halo_visitors_high bigint,
  lift_percentage numeric,
  event_duration_days integer,
  has_sufficient_data boolean,
  -- Control city metrics
  control_baseline_daily_average numeric,
  control_event_visitors bigint,
  control_lift_percentage numeric,
  -- Divergence score (target lift vs control lift)
  divergence_score numeric,
  -- Audit metadata
  bots_filtered integer,
  internal_ips_filtered integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_baseline_start timestamp with time zone;
  v_event_days integer;
  v_target_baseline_avg numeric;
  v_target_baseline_total bigint;
  v_target_event_visitors bigint;
  v_control_baseline_avg numeric;
  v_control_event_visitors bigint;
  v_halo bigint;
  v_halo_low bigint;
  v_halo_high bigint;
  v_target_lift numeric;
  v_control_lift numeric;
  v_divergence numeric;
BEGIN
  -- Calculate baseline period
  v_baseline_start := p_event_start - (p_baseline_days || ' days')::interval;
  v_event_days := GREATEST(1, EXTRACT(DAY FROM (p_event_end - p_event_start))::integer + 1);
  
  -- TARGET CITY: Baseline (30 days before event)
  SELECT COALESCE(COUNT(DISTINCT visitor_id)::numeric / NULLIF(p_baseline_days, 0), 0),
         COALESCE(COUNT(DISTINCT visitor_id), 0)
  INTO v_target_baseline_avg, v_target_baseline_total
  FROM journey_events
  WHERE workspace_id = p_workspace_id
    AND LOWER(geo_city) = LOWER(p_target_city)
    AND timestamp >= v_baseline_start
    AND timestamp < p_event_start;
  
  -- TARGET CITY: Event period visitors
  SELECT COALESCE(COUNT(DISTINCT visitor_id), 0)
  INTO v_target_event_visitors
  FROM journey_events
  WHERE workspace_id = p_workspace_id
    AND LOWER(geo_city) = LOWER(p_target_city)
    AND timestamp >= p_event_start
    AND timestamp <= p_event_end;
  
  -- CONTROL CITY: Baseline (if provided)
  IF p_control_city IS NOT NULL AND p_control_city != '' THEN
    SELECT COALESCE(COUNT(DISTINCT visitor_id)::numeric / NULLIF(p_baseline_days, 0), 0)
    INTO v_control_baseline_avg
    FROM journey_events
    WHERE workspace_id = p_workspace_id
      AND LOWER(geo_city) = LOWER(p_control_city)
      AND timestamp >= v_baseline_start
      AND timestamp < p_event_start;
    
    -- CONTROL CITY: Event period visitors
    SELECT COALESCE(COUNT(DISTINCT visitor_id), 0)
    INTO v_control_event_visitors
    FROM journey_events
    WHERE workspace_id = p_workspace_id
      AND LOWER(geo_city) = LOWER(p_control_city)
      AND timestamp >= p_event_start
      AND timestamp <= p_event_end;
  ELSE
    v_control_baseline_avg := 0;
    v_control_event_visitors := 0;
  END IF;
  
  -- Calculate halo (excess above baseline)
  v_halo := GREATEST(0, v_target_event_visitors - ROUND(v_target_baseline_avg * v_event_days));
  
  -- Calculate confidence interval (±10% conservative range)
  v_halo_low := GREATEST(0, ROUND(v_halo * 0.9));
  v_halo_high := ROUND(v_halo * 1.1);
  
  -- Calculate lift percentages
  IF v_target_baseline_avg > 0 THEN
    v_target_lift := ROUND(((v_target_event_visitors::numeric / (v_target_baseline_avg * v_event_days)) - 1) * 100, 1);
  ELSE
    v_target_lift := 0;
  END IF;
  
  IF v_control_baseline_avg > 0 AND v_control_event_visitors > 0 THEN
    v_control_lift := ROUND(((v_control_event_visitors::numeric / (v_control_baseline_avg * v_event_days)) - 1) * 100, 1);
  ELSE
    v_control_lift := 0;
  END IF;
  
  -- Calculate divergence score (how much target exceeded control)
  v_divergence := v_target_lift - v_control_lift;
  
  RETURN QUERY SELECT
    v_target_baseline_avg,
    v_target_baseline_total,
    v_target_event_visitors,
    v_halo,
    v_halo_low,
    v_halo_high,
    v_target_lift,
    v_event_days,
    (v_target_baseline_total >= 5 AND v_target_event_visitors >= 5 AND v_halo >= 10),
    v_control_baseline_avg,
    v_control_event_visitors,
    v_control_lift,
    v_divergence,
    0::integer, -- bots_filtered (placeholder - can be enhanced)
    0::integer; -- internal_ips_filtered (placeholder)
END;
$$;

-- Create function to get control city timeseries for comparison
CREATE OR REPLACE FUNCTION get_city_comparison_timeseries(
  p_workspace_id uuid,
  p_target_city text,
  p_control_city text,
  p_start_date timestamp with time zone,
  p_end_date timestamp with time zone
)
RETURNS TABLE(
  visit_date date,
  target_visitors bigint,
  control_visitors bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.date::date AS visit_date,
    COALESCE(t.cnt, 0) AS target_visitors,
    COALESCE(c.cnt, 0) AS control_visitors
  FROM generate_series(p_start_date::date, p_end_date::date, '1 day'::interval) AS d(date)
  LEFT JOIN (
    SELECT DATE(timestamp) AS dt, COUNT(DISTINCT visitor_id) AS cnt
    FROM journey_events
    WHERE workspace_id = p_workspace_id
      AND LOWER(geo_city) = LOWER(p_target_city)
      AND timestamp >= p_start_date
      AND timestamp <= p_end_date
    GROUP BY DATE(timestamp)
  ) t ON d.date::date = t.dt
  LEFT JOIN (
    SELECT DATE(timestamp) AS dt, COUNT(DISTINCT visitor_id) AS cnt
    FROM journey_events
    WHERE workspace_id = p_workspace_id
      AND LOWER(geo_city) = LOWER(p_control_city)
      AND timestamp >= p_start_date
      AND timestamp <= p_end_date
    GROUP BY DATE(timestamp)
  ) c ON d.date::date = c.dt
  ORDER BY visit_date;
END;
$$;

-- Create function for live hourly pulse (for active events)
CREATE OR REPLACE FUNCTION get_event_live_pulse(
  p_workspace_id uuid,
  p_target_city text,
  p_baseline_hourly_avg numeric
)
RETURNS TABLE(
  current_hour_visitors bigint,
  expected_visitors numeric,
  pulse_percentage numeric,
  pulse_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_hour_visitors bigint;
  v_expected numeric;
  v_pulse numeric;
  v_status text;
BEGIN
  -- Get visitors in the current hour from target city
  SELECT COUNT(DISTINCT visitor_id)
  INTO v_current_hour_visitors
  FROM journey_events
  WHERE workspace_id = p_workspace_id
    AND LOWER(geo_city) = LOWER(p_target_city)
    AND timestamp >= date_trunc('hour', now())
    AND timestamp < date_trunc('hour', now()) + interval '1 hour';
  
  -- Expected is baseline hourly average (daily / 24)
  v_expected := COALESCE(p_baseline_hourly_avg, 1);
  
  -- Calculate pulse percentage
  IF v_expected > 0 THEN
    v_pulse := ROUND((v_current_hour_visitors::numeric / v_expected) * 100, 1);
  ELSE
    v_pulse := 0;
  END IF;
  
  -- Determine status
  IF v_pulse >= 150 THEN
    v_status := 'excellent';
  ELSIF v_pulse >= 100 THEN
    v_status := 'good';
  ELSIF v_pulse >= 50 THEN
    v_status := 'moderate';
  ELSE
    v_status := 'low';
  END IF;
  
  RETURN QUERY SELECT
    v_current_hour_visitors,
    v_expected,
    v_pulse,
    v_status;
END;
$$;