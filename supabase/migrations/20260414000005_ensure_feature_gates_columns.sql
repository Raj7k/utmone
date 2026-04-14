-- Migration: Ensure feature_gates table has columns needed by admin panel
-- Purpose: Code is being renamed from feature_flags to feature_gates.
-- Add any columns the admin UI references that might be missing.
-- All additions are nullable/no default to avoid breaking existing rows.

ALTER TABLE public.feature_gates
  ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN,
  ADD COLUMN IF NOT EXISTS metadata JSONB,
  ADD COLUMN IF NOT EXISTS last_modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ;
