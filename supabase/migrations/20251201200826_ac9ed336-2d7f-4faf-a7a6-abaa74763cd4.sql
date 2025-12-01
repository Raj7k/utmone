-- Create journey_nodes table for discovered user journey states
CREATE TABLE IF NOT EXISTS public.journey_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  node_name TEXT NOT NULL,
  node_type TEXT NOT NULL CHECK (node_type IN ('source', 'page', 'action', 'conversion', 'exit')),
  state_value NUMERIC DEFAULT 0,
  traffic_volume INTEGER DEFAULT 0,
  avg_time_to_conversion_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, node_name, node_type)
);

-- Create journey_edges table for discovered transitions
CREATE TABLE IF NOT EXISTS public.journey_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  source_node_id UUID NOT NULL REFERENCES public.journey_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES public.journey_nodes(id) ON DELETE CASCADE,
  transition_probability NUMERIC NOT NULL DEFAULT 0 CHECK (transition_probability >= 0 AND transition_probability <= 1),
  transition_count INTEGER NOT NULL DEFAULT 0,
  edge_confidence NUMERIC NOT NULL DEFAULT 0 CHECK (edge_confidence >= 0 AND edge_confidence <= 1),
  is_discovered BOOLEAN NOT NULL DEFAULT true,
  avg_transition_time_seconds INTEGER,
  conversion_impact_score NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_node_id, target_node_id)
);

-- Enable RLS
ALTER TABLE public.journey_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_edges ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_journey_nodes_workspace ON public.journey_nodes(workspace_id);
CREATE INDEX idx_journey_nodes_type_traffic ON public.journey_nodes(node_type, traffic_volume DESC);
CREATE INDEX idx_journey_edges_workspace ON public.journey_edges(workspace_id);
CREATE INDEX idx_journey_edges_source ON public.journey_edges(source_node_id);
CREATE INDEX idx_journey_edges_target ON public.journey_edges(target_node_id);
CREATE INDEX idx_journey_edges_probability ON public.journey_edges(transition_probability DESC);

-- RLS Policies for journey_nodes
CREATE POLICY "Users can view nodes in their workspace"
  ON public.journey_nodes
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage nodes"
  ON public.journey_nodes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for journey_edges
CREATE POLICY "Users can view edges in their workspace"
  ON public.journey_edges
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage edges"
  ON public.journey_edges
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function: Automatic Structure Learning (Bayesian Network Discovery)
CREATE OR REPLACE FUNCTION public.discover_journey_structure(
  p_workspace_id UUID,
  p_lookback_days INTEGER DEFAULT 30,
  p_min_transition_count INTEGER DEFAULT 10
)
RETURNS TABLE(
  nodes_created INTEGER,
  edges_created INTEGER,
  nodes_updated INTEGER,
  edges_updated INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_nodes_created INTEGER := 0;
  v_edges_created INTEGER := 0;
  v_nodes_updated INTEGER := 0;
  v_edges_updated INTEGER := 0;
  v_node_id UUID;
  v_source_node_id UUID;
  v_target_node_id UUID;
BEGIN
  -- Step 1: Discover and upsert unique nodes from journey events
  -- Sources
  WITH source_nodes AS (
    SELECT 
      COALESCE(source, 'Direct') as node_name,
      'source' as node_type,
      COUNT(*) as traffic_volume
    FROM journey_events
    WHERE workspace_id = p_workspace_id
      AND created_at > now() - (p_lookback_days || ' days')::interval
      AND event_type = 'click'
    GROUP BY COALESCE(source, 'Direct')
  )
  INSERT INTO journey_nodes (workspace_id, node_name, node_type, traffic_volume)
  SELECT p_workspace_id, node_name, node_type, traffic_volume
  FROM source_nodes
  ON CONFLICT (workspace_id, node_name, node_type) 
  DO UPDATE SET 
    traffic_volume = EXCLUDED.traffic_volume,
    last_updated_at = now();
  
  GET DIAGNOSTICS v_nodes_created = ROW_COUNT;
  
  -- Pages (landing pages)
  WITH page_nodes AS (
    SELECT 
      COALESCE(landing_page, 'Unknown') as node_name,
      'page' as node_type,
      COUNT(*) as traffic_volume
    FROM journey_events
    WHERE workspace_id = p_workspace_id
      AND created_at > now() - (p_lookback_days || ' days')::interval
      AND landing_page IS NOT NULL
    GROUP BY COALESCE(landing_page, 'Unknown')
  )
  INSERT INTO journey_nodes (workspace_id, node_name, node_type, traffic_volume)
  SELECT p_workspace_id, node_name, node_type, traffic_volume
  FROM page_nodes
  ON CONFLICT (workspace_id, node_name, node_type) 
  DO UPDATE SET 
    traffic_volume = EXCLUDED.traffic_volume,
    last_updated_at = now();
  
  GET DIAGNOSTICS v_nodes_updated = ROW_COUNT;
  v_nodes_created := v_nodes_created + v_nodes_updated;
  
  -- Conversions
  INSERT INTO journey_nodes (workspace_id, node_name, node_type, traffic_volume)
  SELECT 
    p_workspace_id,
    'Conversion' as node_name,
    'conversion' as node_type,
    COUNT(*) as traffic_volume
  FROM journey_events
  WHERE workspace_id = p_workspace_id
    AND created_at > now() - (p_lookback_days || ' days')::interval
    AND event_type = 'conversion'
  GROUP BY workspace_id
  ON CONFLICT (workspace_id, node_name, node_type) 
  DO UPDATE SET 
    traffic_volume = EXCLUDED.traffic_volume,
    last_updated_at = now();
  
  -- Exits (users who don't convert)
  INSERT INTO journey_nodes (workspace_id, node_name, node_type, traffic_volume)
  SELECT 
    p_workspace_id,
    'Exit' as node_name,
    'exit' as node_type,
    COUNT(DISTINCT visitor_id) as traffic_volume
  FROM journey_events je
  WHERE workspace_id = p_workspace_id
    AND created_at > now() - (p_lookback_days || ' days')::interval
    AND NOT EXISTS (
      SELECT 1 FROM journey_events conv
      WHERE conv.visitor_id = je.visitor_id
        AND conv.workspace_id = je.workspace_id
        AND conv.event_type = 'conversion'
        AND conv.created_at > je.created_at
    )
  ON CONFLICT (workspace_id, node_name, node_type) 
  DO UPDATE SET 
    traffic_volume = EXCLUDED.traffic_volume,
    last_updated_at = now();
  
  -- Step 2: Discover edges (transitions) using sequential event analysis
  -- Source -> Landing Page edges
  WITH source_to_page_transitions AS (
    SELECT 
      src_node.id as source_node_id,
      page_node.id as target_node_id,
      COUNT(*) as transition_count,
      COUNT(*) * 1.0 / NULLIF(src_node.traffic_volume, 0) as transition_probability,
      CASE 
        WHEN COUNT(*) >= p_min_transition_count THEN 0.95
        ELSE COUNT(*) * 1.0 / p_min_transition_count
      END as edge_confidence,
      AVG(EXTRACT(EPOCH FROM (je2.created_at - je1.created_at))) as avg_time
    FROM journey_events je1
    INNER JOIN journey_events je2 
      ON je1.visitor_id = je2.visitor_id 
      AND je1.workspace_id = je2.workspace_id
      AND je2.created_at > je1.created_at
      AND je2.created_at <= je1.created_at + interval '1 hour'
    INNER JOIN journey_nodes src_node 
      ON src_node.workspace_id = p_workspace_id
      AND src_node.node_name = COALESCE(je1.source, 'Direct')
      AND src_node.node_type = 'source'
    INNER JOIN journey_nodes page_node 
      ON page_node.workspace_id = p_workspace_id
      AND page_node.node_name = COALESCE(je2.landing_page, 'Unknown')
      AND page_node.node_type = 'page'
    WHERE je1.workspace_id = p_workspace_id
      AND je1.created_at > now() - (p_lookback_days || ' days')::interval
      AND je1.event_type = 'click'
    GROUP BY src_node.id, page_node.id, src_node.traffic_volume
    HAVING COUNT(*) >= (p_min_transition_count / 2)
  )
  INSERT INTO journey_edges (
    workspace_id, 
    source_node_id, 
    target_node_id, 
    transition_count,
    transition_probability,
    edge_confidence,
    avg_transition_time_seconds
  )
  SELECT 
    p_workspace_id,
    source_node_id,
    target_node_id,
    transition_count,
    transition_probability,
    edge_confidence,
    avg_time::INTEGER
  FROM source_to_page_transitions
  ON CONFLICT (source_node_id, target_node_id)
  DO UPDATE SET
    transition_count = EXCLUDED.transition_count,
    transition_probability = EXCLUDED.transition_probability,
    edge_confidence = EXCLUDED.edge_confidence,
    avg_transition_time_seconds = EXCLUDED.avg_transition_time_seconds,
    last_updated_at = now();
  
  GET DIAGNOSTICS v_edges_created = ROW_COUNT;
  
  -- Page -> Conversion edges
  WITH page_to_conversion_transitions AS (
    SELECT 
      page_node.id as source_node_id,
      conv_node.id as target_node_id,
      COUNT(DISTINCT je.user_id) as transition_count,
      COUNT(DISTINCT je.user_id) * 1.0 / NULLIF(page_node.traffic_volume, 0) as transition_probability,
      CASE 
        WHEN COUNT(DISTINCT je.user_id) >= p_min_transition_count THEN 0.95
        ELSE COUNT(DISTINCT je.user_id) * 1.0 / p_min_transition_count
      END as edge_confidence
    FROM journey_events je
    INNER JOIN journey_nodes page_node 
      ON page_node.workspace_id = p_workspace_id
      AND page_node.node_name = COALESCE(je.landing_page, 'Unknown')
      AND page_node.node_type = 'page'
    CROSS JOIN journey_nodes conv_node
    WHERE je.workspace_id = p_workspace_id
      AND je.created_at > now() - (p_lookback_days || ' days')::interval
      AND conv_node.workspace_id = p_workspace_id
      AND conv_node.node_type = 'conversion'
      AND EXISTS (
        SELECT 1 FROM journey_events conv
        WHERE conv.visitor_id = je.visitor_id
          AND conv.workspace_id = je.workspace_id
          AND conv.event_type = 'conversion'
          AND conv.created_at > je.created_at
          AND conv.created_at <= je.created_at + interval '24 hours'
      )
    GROUP BY page_node.id, conv_node.id, page_node.traffic_volume
  )
  INSERT INTO journey_edges (
    workspace_id, 
    source_node_id, 
    target_node_id, 
    transition_count,
    transition_probability,
    edge_confidence
  )
  SELECT 
    p_workspace_id,
    source_node_id,
    target_node_id,
    transition_count,
    transition_probability,
    edge_confidence
  FROM page_to_conversion_transitions
  WHERE transition_count >= (p_min_transition_count / 2)
  ON CONFLICT (source_node_id, target_node_id)
  DO UPDATE SET
    transition_count = EXCLUDED.transition_count,
    transition_probability = EXCLUDED.transition_probability,
    edge_confidence = EXCLUDED.edge_confidence,
    last_updated_at = now();
  
  GET DIAGNOSTICS v_edges_updated = ROW_COUNT;
  v_edges_created := v_edges_created + v_edges_updated;
  
  -- Page -> Exit edges (users who don't convert)
  WITH page_to_exit_transitions AS (
    SELECT 
      page_node.id as source_node_id,
      exit_node.id as target_node_id,
      COUNT(DISTINCT je.visitor_id) as transition_count,
      COUNT(DISTINCT je.visitor_id) * 1.0 / NULLIF(page_node.traffic_volume, 0) as transition_probability,
      0.90 as edge_confidence
    FROM journey_events je
    INNER JOIN journey_nodes page_node 
      ON page_node.workspace_id = p_workspace_id
      AND page_node.node_name = COALESCE(je.landing_page, 'Unknown')
      AND page_node.node_type = 'page'
    CROSS JOIN journey_nodes exit_node
    WHERE je.workspace_id = p_workspace_id
      AND je.created_at > now() - (p_lookback_days || ' days')::interval
      AND exit_node.workspace_id = p_workspace_id
      AND exit_node.node_type = 'exit'
      AND NOT EXISTS (
        SELECT 1 FROM journey_events conv
        WHERE conv.visitor_id = je.visitor_id
          AND conv.workspace_id = je.workspace_id
          AND conv.event_type = 'conversion'
          AND conv.created_at > je.created_at
      )
    GROUP BY page_node.id, exit_node.id, page_node.traffic_volume
  )
  INSERT INTO journey_edges (
    workspace_id, 
    source_node_id, 
    target_node_id, 
    transition_count,
    transition_probability,
    edge_confidence
  )
  SELECT 
    p_workspace_id,
    source_node_id,
    target_node_id,
    transition_count,
    transition_probability,
    edge_confidence
  FROM page_to_exit_transitions
  ON CONFLICT (source_node_id, target_node_id)
  DO UPDATE SET
    transition_count = EXCLUDED.transition_count,
    transition_probability = EXCLUDED.transition_probability,
    edge_confidence = EXCLUDED.edge_confidence,
    last_updated_at = now();
  
  RETURN QUERY SELECT v_nodes_created, v_edges_created, v_nodes_updated, v_edges_updated;
END;
$$;

-- Function: Get journey graph data for visualization
CREATE OR REPLACE FUNCTION public.get_journey_graph(
  p_workspace_id UUID,
  p_min_confidence NUMERIC DEFAULT 0.5
)
RETURNS TABLE(
  nodes JSONB,
  edges JSONB
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', id::TEXT,
          'name', node_name,
          'type', node_type,
          'value', state_value,
          'traffic', traffic_volume,
          'avgTimeToConversion', avg_time_to_conversion_seconds
        )
      )
      FROM journey_nodes
      WHERE workspace_id = p_workspace_id
    ) as nodes,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', id::TEXT,
          'source', source_node_id::TEXT,
          'target', target_node_id::TEXT,
          'probability', transition_probability,
          'count', transition_count,
          'confidence', edge_confidence,
          'avgTime', avg_transition_time_seconds
        )
      )
      FROM journey_edges
      WHERE workspace_id = p_workspace_id
        AND edge_confidence >= p_min_confidence
    ) as edges;
END;
$$;