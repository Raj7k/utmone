-- Migration: Switch link password storage from plaintext `password` to hashed
-- `password_hash`. Audit confirmed zero rows currently have passwords set, so
-- this is a no-risk rename/migration — no data to re-hash.
--
-- The column rename keeps the existing `password` column as NULL for
-- backwards-compatibility with any stale client code, and adds `password_hash`
-- which new code should write to. After all writers are migrated, drop
-- `password` in a follow-up migration.

-- 1. Add the new hashed column
ALTER TABLE public.links
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Add a check constraint to prevent plaintext values sneaking in.
-- Accepted formats:
--   - bcrypt: starts with $2a$, $2b$, $2y$ followed by cost factor (best)
--   - argon2: starts with $argon2 (best)
--   - PBKDF2: starts with $pbkdf2$ (good)
--   - SHA-256 hex: exactly 64 lowercase hex chars (weaker but currently used
--     by LinkForm.tsx via Web Crypto SHA-256 — accepted for backwards compat
--     until we migrate writers to bcrypt in a follow-up)
-- Only enforced when the value is NOT NULL.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'links_password_hash_format_check'
      AND table_schema = 'public'
      AND table_name = 'links'
  ) THEN
    ALTER TABLE public.links
      ADD CONSTRAINT links_password_hash_format_check
      CHECK (
        password_hash IS NULL
        OR password_hash ~ '^\$2[aby]\$\d{2}\$'
        OR password_hash ~ '^\$argon2'
        OR password_hash ~ '^\$pbkdf2\$'
        OR password_hash ~ '^[0-9a-f]{64}$'
      );
  END IF;
END$$;

-- 3. Column-level privilege: revoke SELECT on both password columns for
-- authenticated/anon so RLS SELECT policies can't accidentally leak them.
-- The redirect edge function runs with service_role and can still read.
REVOKE SELECT (password) ON public.links FROM anon, authenticated;
REVOKE SELECT (password_hash) ON public.links FROM anon, authenticated;

-- 4. Seed-cleanup: remove the stale test-link we've been hitting (utm.click/test → goindigo).
-- Safe because audit-verification confirmed this specific row exists as junk test data.
-- (If you want to keep it for some reason, comment this DELETE out.)
DELETE FROM public.links
WHERE slug = 'test'
  AND domain IN ('utm.click', 'utm.one')
  AND destination_url ILIKE '%goindigo%';
