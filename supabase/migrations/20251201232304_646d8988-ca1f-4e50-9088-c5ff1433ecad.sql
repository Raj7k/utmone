-- Add pipeline tracking columns to journey_events
ALTER TABLE public.journey_events
ADD COLUMN IF NOT EXISTS deal_value DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS crm_deal_id TEXT;

-- Add index for pipeline queries
CREATE INDEX IF NOT EXISTS idx_journey_events_deal_value ON public.journey_events(deal_value) WHERE deal_value IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_journey_events_crm_deal_id ON public.journey_events(crm_deal_id) WHERE crm_deal_id IS NOT NULL;

-- Create pipeline funnel aggregation function
CREATE OR REPLACE FUNCTION public.get_pipeline_funnel(
  p_workspace_id UUID,
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT now() - interval '30 days',
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS TABLE(
  stage TEXT,
  count BIGINT,
  conversion_rate NUMERIC,
  total_value NUMERIC,
  avg_value NUMERIC
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  WITH stage_counts AS (
    SELECT
      CASE 
        WHEN je.event_type = 'click' THEN 1
        WHEN je.event_type IN ('identify', 'lead') THEN 2
        WHEN je.event_type = 'sal' THEN 3
        WHEN je.event_type = 'sql' THEN 4
        WHEN je.event_type = 'opportunity' THEN 5
        WHEN je.event_type = 'closed_won' THEN 6
        ELSE 0
      END as stage_order,
      CASE 
        WHEN je.event_type = 'click' THEN 'Clicks'
        WHEN je.event_type IN ('identify', 'lead') THEN 'Leads'
        WHEN je.event_type = 'sal' THEN 'SAL'
        WHEN je.event_type = 'sql' THEN 'SQL'
        WHEN je.event_type = 'opportunity' THEN 'Opportunity'
        WHEN je.event_type = 'closed_won' THEN 'Closed Won'
        ELSE 'Other'
      END as stage_name,
      COUNT(DISTINCT je.visitor_id) as visitor_count,
      SUM(je.deal_value) as total_deal_value
    FROM journey_events je
    WHERE je.workspace_id = p_workspace_id
      AND je.created_at BETWEEN p_start_date AND p_end_date
      AND je.event_type IN ('click', 'identify', 'lead', 'sal', 'sql', 'opportunity', 'closed_won')
    GROUP BY stage_order, stage_name
  ),
  total_clicks AS (
    SELECT visitor_count FROM stage_counts WHERE stage_name = 'Clicks'
  )
  SELECT 
    sc.stage_name::TEXT,
    sc.visitor_count::BIGINT,
    ROUND(
      (sc.visitor_count::NUMERIC / NULLIF(tc.visitor_count, 0)) * 100,
      2
    )::NUMERIC as conversion_rate,
    COALESCE(sc.total_deal_value, 0)::NUMERIC as total_value,
    ROUND(
      COALESCE(sc.total_deal_value, 0) / NULLIF(sc.visitor_count, 0),
      2
    )::NUMERIC as avg_value
  FROM stage_counts sc
  CROSS JOIN total_clicks tc
  WHERE sc.stage_order > 0
  ORDER BY sc.stage_order;
END;
$function$;