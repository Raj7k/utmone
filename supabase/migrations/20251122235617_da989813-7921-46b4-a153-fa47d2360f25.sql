-- Create plan tier enum
CREATE TYPE plan_tier AS ENUM ('free', 'pro', 'business', 'enterprise', 'lifetime');

-- Add plan columns to workspaces table
ALTER TABLE workspaces 
ADD COLUMN IF NOT EXISTS plan_tier plan_tier DEFAULT 'free',
ADD COLUMN IF NOT EXISTS plan_started_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS monthly_link_limit INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS monthly_link_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_clicks_limit INTEGER DEFAULT 10000,
ADD COLUMN IF NOT EXISTS custom_domain_limit INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS analytics_retention_days INTEGER DEFAULT 90;

-- Create workspace usage tracking table
CREATE TABLE IF NOT EXISTS workspace_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  links_created INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  api_requests INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, period_start)
);

CREATE INDEX IF NOT EXISTS idx_workspace_usage_workspace ON workspace_usage(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_usage_period ON workspace_usage(period_start, period_end);

-- Enable RLS
ALTER TABLE workspace_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for workspace_usage
CREATE POLICY "Users can view their workspace usage"
  ON workspace_usage FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert usage"
  ON workspace_usage FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update usage"
  ON workspace_usage FOR UPDATE
  USING (true);