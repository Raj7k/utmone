-- Add event_bridge feature gate
INSERT INTO feature_gates (feature_key, min_plan_tier, description)
VALUES ('event_bridge', 'business', 'Event Bridge automation - connect event platforms to CRM with enrichment')
ON CONFLICT (feature_key) DO UPDATE SET min_plan_tier = 'business', description = 'Event Bridge automation - connect event platforms to CRM with enrichment';