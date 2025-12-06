-- Velocity Analytics: Calculate time-to-convert by channel
CREATE OR REPLACE FUNCTION public.get_conversion_velocity(p_workspace_id uuid, p_start_date timestamp with time zone DEFAULT (now() - '90 days'::interval), p_end_date timestamp with time zone DEFAULT now())
RETURNS TABLE(
  channel text,
  avg_days_to_convert numeric,
  median_days_to_convert numeric,
  bucket_1_7_days bigint,
  bucket_8_30_days bigint,
  bucket_31_90_days bigint,
  bucket_90_plus_days bigint,
  total_conversions bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH user_journeys AS (
    SELECT 
      je.user_id,
      COALESCE(je.source, 'Direct') as channel,
      MIN(je.created_at) as first_touch,
      MAX(CASE WHEN je.event_type = 'conversion' THEN je.created_at END) as conversion_date
    FROM journey_events je
    WHERE je.workspace_id = p_workspace_id
      AND je.created_at BETWEEN p_start_date AND p_end_date
      AND je.user_id IS NOT NULL
    GROUP BY je.user_id, COALESCE(je.source, 'Direct')
    HAVING MAX(CASE WHEN je.event_type = 'conversion' THEN 1 ELSE 0 END) = 1
  ),
  velocity_data AS (
    SELECT 
      uj.channel,
      EXTRACT(EPOCH FROM (uj.conversion_date - uj.first_touch)) / 86400.0 as days_to_convert
    FROM user_journeys uj
    WHERE uj.conversion_date IS NOT NULL
  )
  SELECT 
    vd.channel,
    ROUND(AVG(vd.days_to_convert)::numeric, 1) as avg_days_to_convert,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY vd.days_to_convert)::numeric, 1) as median_days_to_convert,
    COUNT(*) FILTER (WHERE vd.days_to_convert <= 7)::BIGINT as bucket_1_7_days,
    COUNT(*) FILTER (WHERE vd.days_to_convert > 7 AND vd.days_to_convert <= 30)::BIGINT as bucket_8_30_days,
    COUNT(*) FILTER (WHERE vd.days_to_convert > 30 AND vd.days_to_convert <= 90)::BIGINT as bucket_31_90_days,
    COUNT(*) FILTER (WHERE vd.days_to_convert > 90)::BIGINT as bucket_90_plus_days,
    COUNT(*)::BIGINT as total_conversions
  FROM velocity_data vd
  GROUP BY vd.channel
  ORDER BY total_conversions DESC;
END;
$$;

-- Lift Analysis: Calculate incremental lift by channel (causal inference)
CREATE OR REPLACE FUNCTION public.get_channel_lift(p_workspace_id uuid, p_start_date timestamp with time zone DEFAULT (now() - '90 days'::interval), p_end_date timestamp with time zone DEFAULT now())
RETURNS TABLE(
  channel text,
  treatment_conversions bigint,
  treatment_total bigint,
  treatment_rate numeric,
  baseline_conversions bigint,
  baseline_total bigint,
  baseline_rate numeric,
  lift_percent numeric,
  lift_category text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH all_channels AS (
    SELECT DISTINCT COALESCE(source, 'Direct') as channel
    FROM journey_events
    WHERE workspace_id = p_workspace_id
      AND created_at BETWEEN p_start_date AND p_end_date
      AND source IS NOT NULL
  ),
  user_channel_presence AS (
    SELECT 
      je.user_id,
      COALESCE(je.source, 'Direct') as channel,
      MAX(CASE WHEN je.event_type = 'conversion' THEN 1 ELSE 0 END) as converted
    FROM journey_events je
    WHERE je.workspace_id = p_workspace_id
      AND je.created_at BETWEEN p_start_date AND p_end_date
      AND je.user_id IS NOT NULL
    GROUP BY je.user_id, COALESCE(je.source, 'Direct')
  ),
  user_conversions AS (
    SELECT 
      je.user_id,
      MAX(CASE WHEN je.event_type = 'conversion' THEN 1 ELSE 0 END) as converted
    FROM journey_events je
    WHERE je.workspace_id = p_workspace_id
      AND je.created_at BETWEEN p_start_date AND p_end_date
      AND je.user_id IS NOT NULL
    GROUP BY je.user_id
  ),
  lift_calc AS (
    SELECT 
      ac.channel,
      -- Treatment group: users who had this channel in their journey
      COUNT(DISTINCT CASE WHEN ucp.user_id IS NOT NULL THEN ucp.user_id END) as treatment_total,
      COUNT(DISTINCT CASE WHEN ucp.user_id IS NOT NULL AND uc.converted = 1 THEN ucp.user_id END) as treatment_conversions,
      -- Baseline group: users who did NOT have this channel
      COUNT(DISTINCT CASE WHEN ucp.user_id IS NULL THEN uc.user_id END) as baseline_total,
      COUNT(DISTINCT CASE WHEN ucp.user_id IS NULL AND uc.converted = 1 THEN uc.user_id END) as baseline_conversions
    FROM all_channels ac
    CROSS JOIN user_conversions uc
    LEFT JOIN user_channel_presence ucp ON ucp.user_id = uc.user_id AND ucp.channel = ac.channel
    GROUP BY ac.channel
  )
  SELECT 
    lc.channel,
    lc.treatment_conversions,
    lc.treatment_total,
    CASE WHEN lc.treatment_total > 0 
      THEN ROUND((lc.treatment_conversions::numeric / lc.treatment_total) * 100, 2)
      ELSE 0 
    END as treatment_rate,
    lc.baseline_conversions,
    lc.baseline_total,
    CASE WHEN lc.baseline_total > 0 
      THEN ROUND((lc.baseline_conversions::numeric / lc.baseline_total) * 100, 2)
      ELSE 0 
    END as baseline_rate,
    CASE WHEN lc.baseline_total > 0 AND lc.baseline_conversions > 0
      THEN ROUND(
        ((lc.treatment_conversions::numeric / NULLIF(lc.treatment_total, 0)) - 
         (lc.baseline_conversions::numeric / lc.baseline_total)) / 
        (lc.baseline_conversions::numeric / lc.baseline_total) * 100, 1
      )
      ELSE 0
    END as lift_percent,
    CASE 
      WHEN lc.baseline_total = 0 OR lc.baseline_conversions = 0 THEN 'neutral'
      WHEN ((lc.treatment_conversions::numeric / NULLIF(lc.treatment_total, 0)) - 
            (lc.baseline_conversions::numeric / lc.baseline_total)) / 
           (lc.baseline_conversions::numeric / lc.baseline_total) * 100 > 10 THEN 'positive'
      WHEN ((lc.treatment_conversions::numeric / NULLIF(lc.treatment_total, 0)) - 
            (lc.baseline_conversions::numeric / lc.baseline_total)) / 
           (lc.baseline_conversions::numeric / lc.baseline_total) * 100 < -10 THEN 'negative'
      ELSE 'neutral'
    END as lift_category
  FROM lift_calc lc
  WHERE lc.treatment_total > 0
  ORDER BY lift_percent DESC NULLS LAST;
END;
$$;