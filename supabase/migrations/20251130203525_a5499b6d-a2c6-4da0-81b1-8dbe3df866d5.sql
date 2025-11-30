-- Update badge definitions with the 8 specific badges
INSERT INTO public.waitlist_badges (badge_key, name, description, tier, icon, color, points_required) VALUES
  ('connector', 'Connector', 'Referred your first friend', 'bronze', 'Users', '#CD7F32', 1),
  ('networker', 'Networker', 'Referred 5 friends', 'silver', 'Users', '#C0C0C0', 5),
  ('influencer', 'Influencer', 'Referred 10+ friends', 'gold', 'Crown', '#FFD700', 10),
  ('early_bird', 'Early Bird', 'Among the first 100 to join', 'gold', 'Bird', '#FFD700', 0),
  ('detailed', 'Detailed', 'Completed your profile', 'bronze', 'UserCheck', '#CD7F32', 0),
  ('early_circle', 'Early Circle', 'Gained early access', 'gold', 'Unlock', '#FFD700', 0),
  ('super_fan', 'Super Fan', 'Power user with 40+ actions', 'silver', 'Zap', '#C0C0C0', 40),
  ('engaged', 'Engaged', 'Logged in 5+ times', 'silver', 'Heart', '#C0C0C0', 5)
ON CONFLICT (badge_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  tier = EXCLUDED.tier,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  points_required = EXCLUDED.points_required;