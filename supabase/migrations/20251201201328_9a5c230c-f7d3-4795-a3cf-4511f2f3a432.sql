-- Add MDP calculation columns to journey_nodes
ALTER TABLE journey_nodes 
  ADD COLUMN IF NOT EXISTS conversion_probability NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS expected_revenue NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS exit_probability NUMERIC DEFAULT 0;

-- Create MDP Value Iteration function
CREATE OR REPLACE FUNCTION calculate_state_values(
  p_workspace_id UUID,
  p_conversion_reward DECIMAL DEFAULT 100.0,
  p_discount_factor DECIMAL DEFAULT 0.95,
  p_max_iterations INTEGER DEFAULT 100,
  p_convergence_threshold DECIMAL DEFAULT 0.001
)
RETURNS TABLE (
  node_id UUID,
  node_name TEXT,
  node_type TEXT,
  state_value DECIMAL,
  conversion_probability DECIMAL,
  next_best_action TEXT
) AS $$
DECLARE
  v_iteration INTEGER := 0;
  v_max_delta DECIMAL := 999999;
  v_values JSONB := '{}';
  v_new_values JSONB;
  v_node RECORD;
  v_edge RECORD;
  v_node_value DECIMAL;
  v_next_value DECIMAL;
  v_best_action TEXT;
  v_best_value DECIMAL;
BEGIN
  -- Initialize values: conversion=reward, exit=0, others=0
  FOR v_node IN 
    SELECT id, node_name, node_type 
    FROM journey_nodes 
    WHERE workspace_id = p_workspace_id
  LOOP
    IF v_node.node_type = 'conversion' THEN
      v_values := jsonb_set(v_values, ARRAY[v_node.id::TEXT], to_jsonb(p_conversion_reward));
    ELSE
      v_values := jsonb_set(v_values, ARRAY[v_node.id::TEXT], to_jsonb(0::DECIMAL));
    END IF;
  END LOOP;

  -- Value Iteration Loop
  WHILE v_iteration < p_max_iterations AND v_max_delta > p_convergence_threshold LOOP
    v_new_values := v_values;
    v_max_delta := 0;

    FOR v_node IN 
      SELECT id, node_name, node_type 
      FROM journey_nodes 
      WHERE workspace_id = p_workspace_id 
        AND node_type NOT IN ('conversion', 'exit')
    LOOP
      v_node_value := 0;
      
      -- Calculate expected value from outgoing edges
      FOR v_edge IN
        SELECT target_node_id, transition_probability
        FROM journey_edges
        WHERE source_node_id = v_node.id
      LOOP
        v_next_value := COALESCE((v_values->>v_edge.target_node_id::TEXT)::DECIMAL, 0);
        v_node_value := v_node_value + (v_edge.transition_probability * p_discount_factor * v_next_value);
      END LOOP;

      -- Update value
      v_new_values := jsonb_set(v_new_values, ARRAY[v_node.id::TEXT], to_jsonb(v_node_value));
      
      -- Track convergence
      v_max_delta := GREATEST(v_max_delta, ABS(v_node_value - COALESCE((v_values->>v_node.id::TEXT)::DECIMAL, 0)));
    END LOOP;

    v_values := v_new_values;
    v_iteration := v_iteration + 1;
  END LOOP;

  -- Return results with next best action
  RETURN QUERY
  SELECT 
    n.id,
    n.node_name,
    n.node_type,
    ROUND(COALESCE((v_values->>n.id::TEXT)::DECIMAL, 0), 2) as state_value,
    ROUND(n.conversion_probability, 4) as conversion_probability,
    (
      SELECT e2.target_node_id::TEXT || ': ' || n2.node_name
      FROM journey_edges e2
      JOIN journey_nodes n2 ON n2.id = e2.target_node_id
      WHERE e2.source_node_id = n.id
      ORDER BY (COALESCE((v_values->>e2.target_node_id::TEXT)::DECIMAL, 0) * e2.transition_probability) DESC
      LIMIT 1
    ) as next_best_action
  FROM journey_nodes n
  WHERE n.workspace_id = p_workspace_id
  ORDER BY COALESCE((v_values->>n.id::TEXT)::DECIMAL, 0) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create Pareto Golden Path Optimizer function
CREATE OR REPLACE FUNCTION find_pareto_optimal_paths(
  p_workspace_id UUID,
  p_start_node_type TEXT DEFAULT 'source',
  p_end_node_type TEXT DEFAULT 'conversion',
  p_max_path_length INTEGER DEFAULT 10
)
RETURNS TABLE (
  path_id INTEGER,
  path_nodes TEXT[],
  path_node_ids UUID[],
  total_steps INTEGER,
  total_value DECIMAL,
  avg_probability DECIMAL,
  is_pareto_optimal BOOLEAN,
  efficiency_score DECIMAL
) AS $$
WITH RECURSIVE paths AS (
  -- Start from source nodes
  SELECT 
    n.id as current_node,
    ARRAY[n.node_name] as path_nodes,
    ARRAY[n.id] as path_node_ids,
    1 as steps,
    0::DECIMAL as total_value,
    1::DECIMAL as cumulative_prob
  FROM journey_nodes n
  WHERE n.workspace_id = p_workspace_id 
    AND n.node_type = p_start_node_type

  UNION ALL

  -- Extend paths via edges
  SELECT 
    e.target_node_id,
    p.path_nodes || n.node_name,
    p.path_node_ids || e.target_node_id,
    p.steps + 1,
    p.total_value + COALESCE(n.expected_revenue, 0),
    p.cumulative_prob * e.transition_probability
  FROM paths p
  JOIN journey_edges e ON e.source_node_id = p.current_node
  JOIN journey_nodes n ON n.id = e.target_node_id
  WHERE NOT (e.target_node_id = ANY(p.path_node_ids))  -- No cycles
    AND p.steps < p_max_path_length
    AND n.workspace_id = p_workspace_id
),
complete_paths AS (
  SELECT 
    ROW_NUMBER() OVER (ORDER BY steps ASC, total_value DESC) as path_id,
    path_nodes,
    path_node_ids,
    steps as total_steps,
    total_value,
    cumulative_prob as avg_probability
  FROM paths p
  JOIN journey_nodes n ON n.id = p.current_node
  WHERE n.node_type = p_end_node_type
    AND steps >= 2
),
pareto_check AS (
  SELECT 
    p1.*,
    NOT EXISTS (
      SELECT 1 FROM complete_paths p2
      WHERE p2.path_id != p1.path_id
        AND p2.total_steps <= p1.total_steps
        AND p2.total_value >= p1.total_value
        AND (p2.total_steps < p1.total_steps OR p2.total_value > p1.total_value)
    ) as is_pareto_optimal
  FROM complete_paths p1
)
SELECT 
  path_id::INTEGER,
  path_nodes,
  path_node_ids,
  total_steps::INTEGER,
  ROUND(total_value, 2) as total_value,
  ROUND(avg_probability, 4) as avg_probability,
  is_pareto_optimal,
  ROUND((total_value / NULLIF(total_steps, 0))::DECIMAL, 2) as efficiency_score
FROM pareto_check
ORDER BY is_pareto_optimal DESC, efficiency_score DESC;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;