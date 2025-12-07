-- Now update feature_gates to use growth instead of pro
UPDATE feature_gates SET min_plan_tier = 'growth' WHERE min_plan_tier = 'pro';

-- Update workspaces
UPDATE workspaces SET plan_tier = 'growth' WHERE plan_tier = 'pro';
UPDATE workspaces SET plan_tier = 'business' WHERE plan_tier = 'lifetime';