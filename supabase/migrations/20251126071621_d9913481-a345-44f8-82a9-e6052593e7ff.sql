-- Add drip campaign fields to early_access_requests
ALTER TABLE early_access_requests 
  ADD COLUMN IF NOT EXISTS use_case_tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS badge text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS last_activity_timestamp timestamptz,
  ADD COLUMN IF NOT EXISTS approval_timestamp timestamptz,
  ADD COLUMN IF NOT EXISTS drip_emails_sent jsonb DEFAULT '{}';

-- Add indexes for activity tracking
CREATE INDEX IF NOT EXISTS idx_early_access_last_activity ON early_access_requests(last_activity_timestamp);
CREATE INDEX IF NOT EXISTS idx_early_access_approval ON early_access_requests(approval_timestamp);

-- Add new trigger type fields to drip_campaign_schedules
ALTER TABLE drip_campaign_schedules 
  ADD COLUMN IF NOT EXISTS trigger_hours integer,
  ADD COLUMN IF NOT EXISTS trigger_condition text,
  ADD COLUMN IF NOT EXISTS condition_hours integer;

-- Add unique constraint on template_name for upserts
ALTER TABLE email_campaigns ADD CONSTRAINT email_campaigns_template_name_key UNIQUE (template_name);