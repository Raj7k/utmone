-- Sprint 7A: Add domain health tracking columns
ALTER TABLE domains ADD COLUMN IF NOT EXISTS ssl_expires_at TIMESTAMPTZ;
ALTER TABLE domains ADD COLUMN IF NOT EXISTS last_health_check TIMESTAMPTZ;
ALTER TABLE domains ADD COLUMN IF NOT EXISTS health_status TEXT DEFAULT 'unknown';
ALTER TABLE domains ADD COLUMN IF NOT EXISTS domain_settings JSONB DEFAULT '{}'::jsonb;

-- Add index for health check queries
CREATE INDEX IF NOT EXISTS idx_domains_health_check ON domains(last_health_check) WHERE is_verified = true;

-- Sprint 7B: Create onboarding analytics table
CREATE TABLE IF NOT EXISTS onboarding_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  skipped BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on onboarding_analytics
ALTER TABLE onboarding_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for onboarding_analytics
CREATE POLICY "Users can view their own onboarding analytics"
  ON onboarding_analytics FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own onboarding analytics"
  ON onboarding_analytics FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_onboarding_analytics_user ON onboarding_analytics(user_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_analytics_step ON onboarding_analytics(step_name, completed_at);