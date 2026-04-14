-- Migration: Add missing columns to profiles that OnboardingWizard writes to
-- Code at src/pages/OnboardingWizard.tsx:220-229 writes user_type, icp_role,
-- primary_use_case, onboarding_completed — none of which exist in profiles.
-- All nullable, no defaults (non-breaking).

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_type TEXT,
  ADD COLUMN IF NOT EXISTS icp_role TEXT,
  ADD COLUMN IF NOT EXISTS primary_use_case TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN;

CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
