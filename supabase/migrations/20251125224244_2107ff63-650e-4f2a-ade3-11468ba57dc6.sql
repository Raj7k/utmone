-- Phase 6: Engagement Engine - Badges, Milestones, and Drip Campaigns

-- =====================================================
-- 1. WAITLIST BADGES (Badge Definitions)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.waitlist_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'bronze',
  points_required INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for waitlist_badges
ALTER TABLE public.waitlist_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON public.waitlist_badges
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage badges"
  ON public.waitlist_badges
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 2. USER BADGES (Awarded Badges)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.early_access_requests(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.waitlist_badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_awarded_at ON public.user_badges(awarded_at DESC);

-- RLS for user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges"
  ON public.user_badges
  FOR SELECT
  USING (user_id IN (SELECT id FROM public.early_access_requests WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Service role can insert badges"
  ON public.user_badges
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all badges"
  ON public.user_badges
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 3. WAITLIST MILESTONES (Activity Tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.waitlist_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.early_access_requests(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, milestone_type)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_milestones_user_id ON public.waitlist_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_milestones_type ON public.waitlist_milestones(milestone_type);

-- RLS for waitlist_milestones
ALTER TABLE public.waitlist_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own milestones"
  ON public.waitlist_milestones
  FOR SELECT
  USING (user_id IN (SELECT id FROM public.early_access_requests WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Service role can insert milestones"
  ON public.waitlist_milestones
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all milestones"
  ON public.waitlist_milestones
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 4. DRIP CAMPAIGN SCHEDULES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.drip_campaign_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL,
  trigger_value INTEGER,
  trigger_milestone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_drip_schedules_active ON public.drip_campaign_schedules(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_drip_schedules_trigger ON public.drip_campaign_schedules(trigger_type);

-- RLS for drip_campaign_schedules
ALTER TABLE public.drip_campaign_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage drip schedules"
  ON public.drip_campaign_schedules
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 5. SEED DATA - Badge Definitions
-- =====================================================
INSERT INTO public.waitlist_badges (badge_key, name, description, icon, color, tier, points_required) VALUES
('early_bird', 'early bird', 'signed up in the first 100', 'Bird', '#FFD700', 'gold', 0),
('first_referral', 'connector', 'made your first referral', 'Users', '#4A90D9', 'bronze', 0),
('five_referrals', 'networker', 'referred 5 friends', 'Network', '#C0C0C0', 'silver', 0),
('ten_referrals', 'influencer', 'referred 10+ friends', 'Crown', '#FFD700', 'gold', 0),
('profile_complete', 'detailed', 'completed full profile', 'FileCheck', '#4CAF50', 'bronze', 0),
('engaged_reader', 'engaged', 'opened 5+ emails', 'Mail', '#9C27B0', 'bronze', 0),
('super_engaged', 'super fan', 'engagement score 40+', 'Star', '#FF5722', 'silver', 40),
('early_circle', 'early circle', 'reached full early access', 'Circle', '#1A1A1A', 'gold', 0)
ON CONFLICT (badge_key) DO NOTHING;