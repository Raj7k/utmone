-- Phase 11-14: All Phases Database Schema

-- Update existing link_tags table
ALTER TABLE public.link_tags 
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3b82f6',
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Rename tag to tag_name if needed
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'link_tags' AND column_name = 'tag') THEN
    ALTER TABLE public.link_tags RENAME COLUMN tag TO tag_name;
  END IF;
END $$;

-- Add unique constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'link_tags_link_id_tag_name_key'
  ) THEN
    ALTER TABLE public.link_tags ADD CONSTRAINT link_tags_link_id_tag_name_key UNIQUE(link_id, tag_name);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_link_tags_link_id ON public.link_tags(link_id);
CREATE INDEX IF NOT EXISTS idx_link_tags_tag_name ON public.link_tags(tag_name);

-- Phase 11: Bulk operations log
CREATE TABLE IF NOT EXISTS public.bulk_operations_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  operation_type TEXT NOT NULL,
  link_ids UUID[] NOT NULL,
  parameters JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  affected_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_bulk_operations_workspace ON public.bulk_operations_log(workspace_id);
CREATE INDEX IF NOT EXISTS idx_bulk_operations_status ON public.bulk_operations_log(status);

-- Phase 12: Custom reports
CREATE TABLE IF NOT EXISTS public.custom_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  report_config JSONB NOT NULL,
  is_scheduled BOOLEAN DEFAULT false,
  schedule_frequency TEXT,
  schedule_recipients TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_reports_workspace ON public.custom_reports(workspace_id);

CREATE TABLE IF NOT EXISTS public.report_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  report_id UUID REFERENCES public.custom_reports(id) ON DELETE SET NULL,
  export_format TEXT NOT NULL,
  file_path TEXT,
  download_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE INDEX IF NOT EXISTS idx_report_exports_workspace ON public.report_exports(workspace_id);
CREATE INDEX IF NOT EXISTS idx_report_exports_expires ON public.report_exports(expires_at);

-- Phase 13: External Integrations
CREATE TABLE IF NOT EXISTS public.zapier_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  webhook_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  target_url TEXT NOT NULL,
  secret_key TEXT,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  total_triggers INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zapier_webhooks_workspace ON public.zapier_webhooks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_zapier_webhooks_trigger ON public.zapier_webhooks(trigger_type);

CREATE TABLE IF NOT EXISTS public.slack_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  webhook_url_encrypted TEXT NOT NULL,
  notification_types TEXT[] DEFAULT ARRAY['link.created', 'high_traffic_alert'],
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_slack_channels_workspace ON public.slack_channels(workspace_id);

-- Phase 14: A/B Testing & Performance
CREATE TABLE IF NOT EXISTS public.ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  traffic_split JSONB DEFAULT '{"A": 50, "B": 50}',
  winner_variant_id UUID,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ab_tests_workspace ON public.ab_tests(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_link ON public.ab_tests(link_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON public.ab_tests(status);

CREATE TABLE IF NOT EXISTS public.ab_test_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES public.ab_tests(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  traffic_percentage INTEGER DEFAULT 50,
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  performance_score DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ab_variants_test ON public.ab_test_variants(test_id);

CREATE TABLE IF NOT EXISTS public.redirect_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  conditions JSONB NOT NULL,
  destination_url TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  match_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_redirect_rules_workspace ON public.redirect_rules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_redirect_rules_link ON public.redirect_rules(link_id);
CREATE INDEX IF NOT EXISTS idx_redirect_rules_priority ON public.redirect_rules(priority DESC);

CREATE TABLE IF NOT EXISTS public.link_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  check_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_code INTEGER,
  response_time_ms INTEGER,
  is_healthy BOOLEAN DEFAULT true,
  error_message TEXT,
  redirect_chain TEXT[],
  final_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_health_checks_link ON public.link_health_checks(link_id);
CREATE INDEX IF NOT EXISTS idx_health_checks_time ON public.link_health_checks(check_time DESC);
CREATE INDEX IF NOT EXISTS idx_health_checks_healthy ON public.link_health_checks(is_healthy);

-- Enable RLS on all new tables
ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_operations_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zapier_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slack_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirect_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_health_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (drop existing if any to avoid conflicts)
DROP POLICY IF EXISTS "Users can view tags in their workspace" ON public.link_tags;
DROP POLICY IF EXISTS "Users can create tags in their workspace" ON public.link_tags;
DROP POLICY IF EXISTS "Users can delete tags in their workspace" ON public.link_tags;

CREATE POLICY "Users can view tags in their workspace"
  ON public.link_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.links l
      WHERE l.id = link_tags.link_id
      AND has_workspace_access(auth.uid(), l.workspace_id)
    )
  );

CREATE POLICY "Users can create tags in their workspace"
  ON public.link_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.links l
      WHERE l.id = link_tags.link_id
      AND has_workspace_access(auth.uid(), l.workspace_id)
    )
  );

CREATE POLICY "Users can delete tags in their workspace"
  ON public.link_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.links l
      WHERE l.id = link_tags.link_id
      AND has_workspace_access(auth.uid(), l.workspace_id)
    )
  );

-- Bulk operations policies
CREATE POLICY "Users can view bulk operations in their workspace"
  ON public.bulk_operations_log FOR SELECT
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can create bulk operations in their workspace"
  ON public.bulk_operations_log FOR INSERT
  WITH CHECK (has_workspace_access(auth.uid(), workspace_id));

-- Custom reports policies
CREATE POLICY "Users can manage reports in their workspace"
  ON public.custom_reports FOR ALL
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can manage exports in their workspace"
  ON public.report_exports FOR ALL
  USING (has_workspace_access(auth.uid(), workspace_id));

-- Integration policies
CREATE POLICY "Users can manage Zapier webhooks in their workspace"
  ON public.zapier_webhooks FOR ALL
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can manage Slack channels in their workspace"
  ON public.slack_channels FOR ALL
  USING (has_workspace_access(auth.uid(), workspace_id));

-- A/B testing policies
CREATE POLICY "Users can manage A/B tests in their workspace"
  ON public.ab_tests FOR ALL
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can view variants for tests in their workspace"
  ON public.ab_test_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ab_tests t
      WHERE t.id = ab_test_variants.test_id
      AND has_workspace_access(auth.uid(), t.workspace_id)
    )
  );

CREATE POLICY "Users can manage variants for tests in their workspace"
  ON public.ab_test_variants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.ab_tests t
      WHERE t.id = ab_test_variants.test_id
      AND has_workspace_access(auth.uid(), t.workspace_id)
    )
  );

-- Redirect rules policies
CREATE POLICY "Users can manage redirect rules in their workspace"
  ON public.redirect_rules FOR ALL
  USING (has_workspace_access(auth.uid(), workspace_id));

-- Health check policies
CREATE POLICY "Users can view health checks for links in their workspace"
  ON public.link_health_checks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.links l
      WHERE l.id = link_health_checks.link_id
      AND has_workspace_access(auth.uid(), l.workspace_id)
    )
  );

CREATE POLICY "System can insert health checks"
  ON public.link_health_checks FOR INSERT
  WITH CHECK (true);