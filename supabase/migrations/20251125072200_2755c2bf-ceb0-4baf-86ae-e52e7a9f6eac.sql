-- User Dashboard Preferences Table
CREATE TABLE user_dashboard_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_order JSONB DEFAULT '["stats", "quick_actions", "ai_insights", "recent_links", "security_overview", "transparency"]'::jsonb,
  hidden_widgets JSONB DEFAULT '[]'::jsonb,
  layout_preset TEXT DEFAULT 'default', -- 'default', 'marketer', 'analyst', 'manager'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_dashboard_preferences_user ON user_dashboard_preferences(user_id);

-- Enable RLS
ALTER TABLE user_dashboard_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own dashboard preferences"
  ON user_dashboard_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dashboard preferences"
  ON user_dashboard_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard preferences"
  ON user_dashboard_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- AI Recommendations Table
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- 'opportunity', 'warning', 'suggestion', 'pattern'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_url TEXT,
  action_label TEXT,
  dismissed BOOLEAN DEFAULT false,
  dismissed_at TIMESTAMPTZ,
  dismissed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_recommendations_workspace ON ai_recommendations(workspace_id, created_at DESC);
CREATE INDEX idx_ai_recommendations_dismissed ON ai_recommendations(workspace_id, dismissed);

-- Enable RLS
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view recommendations for their workspaces"
  ON ai_recommendations FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update recommendations for their workspaces"
  ON ai_recommendations FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert recommendations"
  ON ai_recommendations FOR INSERT
  WITH CHECK (true);