-- Enable RLS on link_health_logs table
ALTER TABLE link_health_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for link_health_logs
CREATE POLICY "Users can view health logs for their workspace links"
ON link_health_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM links
    WHERE links.id = link_health_logs.link_id
    AND has_workspace_access(auth.uid(), links.workspace_id)
  )
);

CREATE POLICY "Service role can insert health logs"
ON link_health_logs FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Admins can view all health logs"
ON link_health_logs FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));