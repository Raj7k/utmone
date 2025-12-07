-- Add 'starter' to plan_tier enum
ALTER TYPE plan_tier ADD VALUE IF NOT EXISTS 'starter' AFTER 'free';

-- Insert starter plan into subscription_plans
INSERT INTO subscription_plans (id, price_monthly, max_links, max_custom_domains, max_clicks_per_month, retention_days, support_level)
VALUES (
  'starter',
  29,
  500,
  1,
  25000,
  90,
  'email'
)
ON CONFLICT (id) DO NOTHING;