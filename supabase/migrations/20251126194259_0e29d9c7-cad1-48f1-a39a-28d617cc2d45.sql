-- Fix: Set search_path for get_next_url_version function to address security warning
-- This prevents SQL injection attacks via search_path manipulation

-- Drop and recreate function with search_path set
DROP FUNCTION IF EXISTS get_next_url_version(UUID, TEXT);

CREATE OR REPLACE FUNCTION get_next_url_version(
  p_workspace_id UUID,
  p_destination_url TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_max_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version), 0) INTO v_max_version
  FROM links
  WHERE workspace_id = p_workspace_id 
    AND destination_url = p_destination_url;
  
  RETURN v_max_version + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
