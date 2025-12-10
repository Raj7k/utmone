-- Add column to track if user has seen the welcome modal
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_seen_welcome_modal BOOLEAN DEFAULT false;

-- Add column to track if user has completed the onboarding tour
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_completed_tour BOOLEAN DEFAULT false;