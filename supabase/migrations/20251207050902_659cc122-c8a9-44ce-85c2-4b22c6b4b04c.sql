-- Insert growth plan with correct columns
INSERT INTO subscription_plans (id, max_clicks_per_month, max_custom_domains, max_links, price_monthly, retention_days, support_level)
VALUES ('growth', 100000, 3, 1000, 49, 365, 'priority')
ON CONFLICT (id) DO NOTHING;