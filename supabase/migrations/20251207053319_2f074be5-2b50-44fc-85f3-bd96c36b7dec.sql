-- Workspace Notification Settings for Pulse Watchdog
CREATE TABLE IF NOT EXISTS workspace_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  email_recipients TEXT[] DEFAULT '{}',
  slack_enabled BOOLEAN DEFAULT false,
  slack_webhook_url_encrypted TEXT,
  anomaly_threshold DECIMAL DEFAULT 3.0,
  quiet_hours_start INT CHECK (quiet_hours_start >= 0 AND quiet_hours_start <= 23),
  quiet_hours_end INT CHECK (quiet_hours_end >= 0 AND quiet_hours_end <= 23),
  debounce_hours INT DEFAULT 24,
  spike_alerts_enabled BOOLEAN DEFAULT true,
  drop_alerts_enabled BOOLEAN DEFAULT true,
  new_source_alerts_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id)
);

-- Add notification_sent_at to analytics_anomalies for debouncing
ALTER TABLE analytics_anomalies ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMPTZ;

-- Enable RLS
ALTER TABLE workspace_notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their workspace notification settings"
ON workspace_notification_settings FOR SELECT
USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can update their workspace notification settings"
ON workspace_notification_settings FOR UPDATE
USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can insert their workspace notification settings"
ON workspace_notification_settings FOR INSERT
WITH CHECK (has_workspace_access(auth.uid(), workspace_id));

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_notification_settings_workspace ON workspace_notification_settings(workspace_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_settings_timestamp
BEFORE UPDATE ON workspace_notification_settings
FOR EACH ROW
EXECUTE FUNCTION update_notification_settings_updated_at();