-- Create the "City Signal" baseline aggregator function
-- This calculates the average daily visitors from a specific city before an event
CREATE OR REPLACE FUNCTION public.calculate_city_baseline(
  p_workspace_id UUID,
  p_target_city TEXT,
  p_event_start TIMESTAMP WITH TIME ZONE,
  p_event_end TIMESTAMP WITH TIME ZONE,
  p_baseline_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  baseline_daily_average NUMERIC,
  baseline_total_visitors BIGINT,
  event_visitors BIGINT,
  halo_visitors BIGINT,
  lift_percentage NUMERIC,
  event_duration_days INTEGER,
  has_sufficient_data BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_baseline_start TIMESTAMP WITH TIME ZONE;
  v_baseline_end TIMESTAMP WITH TIME ZONE;
  v_baseline_count BIGINT;
  v_event_count BIGINT;
  v_event_days INTEGER;
  v_daily_avg NUMERIC;
  v_expected_visitors NUMERIC;
  v_halo BIGINT;
  v_lift NUMERIC;
  v_sufficient BOOLEAN;
BEGIN
  -- Calculate baseline window (30 days before event start)
  v_baseline_start := p_event_start - (p_baseline_days || ' days')::INTERVAL;
  v_baseline_end := p_event_start - INTERVAL '1 day';
  
  -- Calculate event duration in days
  v_event_days := GREATEST(1, CEIL(EXTRACT(EPOCH FROM (p_event_end - p_event_start)) / 86400)::INTEGER);
  
  -- Count unique visitors from target city during BASELINE period
  -- Using journey_events (pixel data) for zero-dependency analysis
  SELECT COUNT(DISTINCT visitor_id) INTO v_baseline_count
  FROM journey_events
  WHERE workspace_id = p_workspace_id
    AND LOWER(city) = LOWER(p_target_city)
    AND created_at >= v_baseline_start
    AND created_at < p_event_start;
  
  -- Count unique visitors from target city during EVENT period
  SELECT COUNT(DISTINCT visitor_id) INTO v_event_count
  FROM journey_events
  WHERE workspace_id = p_workspace_id
    AND LOWER(city) = LOWER(p_target_city)
    AND created_at >= p_event_start
    AND created_at <= p_event_end;
  
  -- Calculate daily average during baseline
  v_daily_avg := COALESCE(v_baseline_count::NUMERIC / p_baseline_days, 0);
  
  -- Expected visitors = daily_avg * event_duration
  v_expected_visitors := v_daily_avg * v_event_days;
  
  -- Halo visitors = actual - expected (never negative)
  v_halo := GREATEST(0, v_event_count - v_expected_visitors::BIGINT);
  
  -- Lift percentage
  IF v_expected_visitors > 0 THEN
    v_lift := ROUND(((v_event_count - v_expected_visitors) / v_expected_visitors) * 100, 1);
  ELSIF v_event_count > 0 THEN
    v_lift := 100;
  ELSE
    v_lift := 0;
  END IF;
  
  -- Privacy: require minimum 10 halo visitors to prevent individual identification
  v_sufficient := v_halo >= 10 OR (v_baseline_count >= 5 AND v_event_count >= 5);
  
  RETURN QUERY SELECT 
    v_daily_avg,
    COALESCE(v_baseline_count, 0),
    COALESCE(v_event_count, 0),
    v_halo,
    v_lift,
    v_event_days,
    v_sufficient;
END;
$$;

-- Create function to get daily visitor time series for a city (for the spike chart)
CREATE OR REPLACE FUNCTION public.get_city_visitor_timeseries(
  p_workspace_id UUID,
  p_target_city TEXT,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  visit_date DATE,
  unique_visitors BIGINT
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as visit_date,
    COUNT(DISTINCT visitor_id) as unique_visitors
  FROM journey_events
  WHERE workspace_id = p_workspace_id
    AND LOWER(city) = LOWER(p_target_city)
    AND created_at >= p_start_date
    AND created_at <= p_end_date
  GROUP BY DATE(created_at)
  ORDER BY visit_date;
END;
$$;

-- Add index for efficient city-based queries on journey_events
CREATE INDEX IF NOT EXISTS idx_journey_events_city_workspace 
  ON journey_events(workspace_id, LOWER(city), created_at);

COMMENT ON FUNCTION calculate_city_baseline IS 'Zero-dependency Event Halo calculator using internal pixel data only. Compares baseline visitor traffic from a city to event period traffic to detect the "booth walk-by" effect.';