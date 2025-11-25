-- Create domain health logs table for tracking health check history
CREATE TABLE domain_health_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid REFERENCES domains(id) ON DELETE CASCADE,
  check_type text NOT NULL,
  status text NOT NULL,
  response_time_ms integer,
  details jsonb DEFAULT '{}'::jsonb,
  checked_at timestamptz DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_domain_health_logs_domain_id ON domain_health_logs(domain_id);
CREATE INDEX idx_domain_health_logs_checked_at ON domain_health_logs(checked_at DESC);
CREATE INDEX idx_domain_health_logs_status ON domain_health_logs(status);

-- RLS policies for domain health logs
ALTER TABLE domain_health_logs ENABLE ROW LEVEL SECURITY;

-- Users can view health logs for domains in their workspace
CREATE POLICY "Users can view health logs for workspace domains"
  ON domain_health_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM domains
      WHERE domains.id = domain_health_logs.domain_id
      AND has_workspace_access(auth.uid(), domains.workspace_id)
    )
  );

-- Service role can insert health logs
CREATE POLICY "Service role can insert health logs"
  ON domain_health_logs FOR INSERT
  WITH CHECK (true);

-- Add comment for clarity
COMMENT ON TABLE domain_health_logs IS 'Historical health check results for domain monitoring';