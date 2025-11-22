-- Fix RLS security issues for newly added tables

-- Enable RLS on fraud_scores (currently missing)
ALTER TABLE fraud_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all fraud scores"
  ON fraud_scores FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view fraud scores for their links"
  ON fraud_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM links
      WHERE links.id = fraud_scores.link_id
      AND has_workspace_access(auth.uid(), links.workspace_id)
    )
  );

-- Enable RLS on api_usage (currently missing)
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their API usage"
  ON api_usage FOR SELECT
  USING (
    api_key_id IN (
      SELECT id FROM api_keys WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        UNION
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all API usage"
  ON api_usage FOR SELECT
  USING (has_role(auth.uid(), 'admin'));