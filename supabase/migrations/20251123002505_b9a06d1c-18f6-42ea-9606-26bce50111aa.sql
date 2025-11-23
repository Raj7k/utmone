-- Phase 5.2: Analytics Anomalies
CREATE TABLE analytics_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  anomaly_type TEXT NOT NULL CHECK (anomaly_type IN ('traffic_spike', 'new_country', 'ctr_drop', 'new_referrer')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  baseline_value NUMERIC,
  current_value NUMERIC,
  change_percent NUMERIC,
  metadata JSONB DEFAULT '{}',
  is_dismissed BOOLEAN DEFAULT false,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_anomalies_workspace ON analytics_anomalies(workspace_id, detected_at DESC);
CREATE INDEX idx_anomalies_severity ON analytics_anomalies(severity, is_dismissed);

-- RLS Policies for analytics_anomalies
ALTER TABLE analytics_anomalies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view anomalies for their workspaces"
  ON analytics_anomalies FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can dismiss anomalies for their workspaces"
  ON analytics_anomalies FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert anomalies"
  ON analytics_anomalies FOR INSERT
  WITH CHECK (true);

-- Phase 5.3: Scheduled Reports
CREATE TYPE report_template AS ENUM ('weekly_summary', 'monthly_overview', 'campaign_performance');
CREATE TYPE report_frequency AS ENUM ('daily', 'weekly', 'monthly', 'custom');

CREATE TABLE scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  template_name report_template NOT NULL,
  frequency report_frequency NOT NULL,
  recipients TEXT[] NOT NULL,
  last_sent_at TIMESTAMPTZ,
  next_send_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  custom_cron TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scheduled_reports_next_send ON scheduled_reports(next_send_at, is_active);

-- RLS Policies for scheduled_reports
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage reports for their workspaces"
  ON scheduled_reports FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Service role can read reports for sending"
  ON scheduled_reports FOR SELECT
  USING (true);

-- Phase 1.3: Privacy & Data Export
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS tracking_consent BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 90;

CREATE TABLE data_export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  export_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_data_export_requests_user ON data_export_requests(user_id, created_at DESC);

-- RLS Policies for data_export_requests
ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own export requests"
  ON data_export_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage export requests"
  ON data_export_requests FOR ALL
  USING (true);