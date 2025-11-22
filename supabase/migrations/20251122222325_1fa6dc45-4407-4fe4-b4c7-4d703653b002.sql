-- Priority 1: Geo/Device Targeting Rules Engine
CREATE TABLE targeting_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE NOT NULL,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('country', 'device', 'os', 'browser', 'language')),
  condition TEXT NOT NULL CHECK (condition IN ('equals', 'in', 'not_in', 'contains')),
  value TEXT[] NOT NULL,
  redirect_url TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_targeting_rules_link ON targeting_rules(link_id, is_active, priority DESC);

ALTER TABLE targeting_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rules for their links"
  ON targeting_rules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM links 
      WHERE links.id = targeting_rules.link_id 
      AND has_workspace_access(auth.uid(), links.workspace_id)
    )
  );

CREATE POLICY "Users can manage rules for their links"
  ON targeting_rules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM links 
      WHERE links.id = targeting_rules.link_id 
      AND has_workspace_access(auth.uid(), links.workspace_id)
    )
  );

-- Track which targeting rule was matched
ALTER TABLE link_clicks ADD COLUMN targeting_rule_id UUID REFERENCES targeting_rules(id);
ALTER TABLE link_clicks ADD COLUMN targeting_rule_name TEXT;

-- Priority 2: Public API v1
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  key_name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  scopes TEXT[] DEFAULT ARRAY['links:read'],
  rate_limit INTEGER DEFAULT 600,
  rate_limit_window TEXT DEFAULT '1 minute',
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_workspace ON api_keys(workspace_id, is_active);

CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_usage_key_time ON api_usage(api_key_id, timestamp DESC);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their workspace API keys"
  ON api_keys FOR SELECT
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can manage their workspace API keys"
  ON api_keys FOR ALL
  USING (has_workspace_access(auth.uid(), workspace_id));

-- Priority 3: Partner/Affiliate System
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  workspace_id UUID REFERENCES workspaces(id),
  partner_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'terminated')),
  commission_rate DECIMAL(5,4) DEFAULT 0.10,
  payment_email TEXT,
  payment_method TEXT,
  stripe_connect_id TEXT,
  total_referrals INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  pending_payout DECIMAL(10,2) DEFAULT 0,
  lifetime_payout DECIMAL(10,2) DEFAULT 0,
  referral_url TEXT,
  application_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  last_payout_at TIMESTAMP
);

CREATE TABLE partner_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id),
  referral_code TEXT NOT NULL,
  signup_date TIMESTAMP,
  first_payment_date TIMESTAMP,
  conversion_date TIMESTAMP,
  conversion_value DECIMAL(10,2),
  commission_earned DECIMAL(10,2),
  commission_paid BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'paid', 'refunded')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partner_referrals_partner ON partner_referrals(partner_id, status);
CREATE INDEX idx_partner_referrals_referred ON partner_referrals(referred_user_id);

CREATE TABLE partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  transaction_id TEXT,
  invoice_url TEXT,
  tax_form_url TEXT,
  requested_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT,
  processed_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_partner_payouts_partner ON partner_payouts(partner_id, status);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own partner profile"
  ON partners FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own partner profile"
  ON partners FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all partners"
  ON partners FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all partners"
  ON partners FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view their own referrals"
  ON partner_referrals FOR SELECT
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

CREATE POLICY "Partners can view their own payouts"
  ON partner_payouts FOR SELECT
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

CREATE POLICY "Partners can request payouts"
  ON partner_payouts FOR INSERT
  WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all payouts"
  ON partner_payouts FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Priority 4: Advanced Security
ALTER TABLE links ADD COLUMN password_hash TEXT;
ALTER TABLE links ADD COLUMN password_hint TEXT;

CREATE TABLE fraud_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id),
  ip_address TEXT,
  user_agent TEXT,
  risk_score INTEGER DEFAULT 0,
  risk_factors JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fraud_scores_link ON fraud_scores(link_id, risk_score DESC);
CREATE INDEX idx_fraud_scores_ip ON fraud_scores(ip_address, created_at DESC);

-- Priority 5: External Integrations
CREATE TABLE webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  secret TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_webhook_subscriptions_workspace ON webhook_subscriptions(workspace_id, is_active, event_type);

CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  config JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_integrations_workspace ON integrations(workspace_id, provider, is_active);

ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their workspace webhooks"
  ON webhook_subscriptions FOR SELECT
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can manage their workspace webhooks"
  ON webhook_subscriptions FOR ALL
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can view their workspace integrations"
  ON integrations FOR SELECT
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can manage their workspace integrations"
  ON integrations FOR ALL
  USING (has_workspace_access(auth.uid(), workspace_id));