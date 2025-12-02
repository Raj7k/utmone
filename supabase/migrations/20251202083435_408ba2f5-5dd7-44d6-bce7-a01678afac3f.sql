-- Add mfa_challenge column to profiles for storing WebAuthn challenges
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mfa_challenge TEXT;