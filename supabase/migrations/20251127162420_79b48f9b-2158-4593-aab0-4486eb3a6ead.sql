-- A. Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  price_monthly INTEGER NOT NULL,
  max_links INTEGER,
  max_custom_domains INTEGER,
  max_clicks_per_month BIGINT,
  retention_days INTEGER,
  support_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. Create feature_gates table
CREATE TABLE IF NOT EXISTS feature_gates (
  feature_key TEXT PRIMARY KEY,
  min_plan_tier TEXT REFERENCES subscription_plans(id),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_gates ENABLE ROW LEVEL SECURITY;

-- D. Public read policies (pricing is public)
CREATE POLICY "Public can view subscription plans"
  ON subscription_plans FOR SELECT
  USING (true);

CREATE POLICY "Public can view feature gates"
  ON feature_gates FOR SELECT
  USING (true);

-- E. Seed subscription plans
INSERT INTO subscription_plans (id, price_monthly, max_links, max_custom_domains, max_clicks_per_month, retention_days, support_level) VALUES
('free', 0, 100, 0, 10000, 90, 'community'),
('pro', 20, 1000, 1, 100000, 365, 'priority'),
('business', 99, 10000, 5, -1, 1095, 'priority'),
('enterprise', 300, -1, -1, -1, -1, 'dedicated_sla')
ON CONFLICT (id) DO NOTHING;

-- F. Seed feature gates
INSERT INTO feature_gates (feature_key, min_plan_tier, description) VALUES
('api_access', 'free', 'Basic API access included in all plans'),
('team_members', 'free', 'Unlimited team members for everyone'),
('geo_analytics', 'pro', 'Geographic click analytics'),
('export_svg', 'pro', 'Export QR codes as SVG'),
('csv_export', 'pro', 'Export data as CSV'),
('qr_advanced', 'pro', 'Advanced QR code customization'),
('remove_branding', 'business', 'White-labeling and brand removal'),
('white_label', 'business', 'Complete white-label solution'),
('sso', 'enterprise', 'SAML/OAuth SSO Login')
ON CONFLICT (feature_key) DO NOTHING;