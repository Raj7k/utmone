-- utm.one — Audit verification queries (docs/audit-2026-04-14.md)
--
-- Run each block separately in the Supabase SQL editor:
--   https://supabase.com/dashboard/project/vlnfwhpaajowjsqnkwyu/sql/new
-- Or whichever project you want to inspect.
--
-- Each query answers ONE unresolved question from the audit. Interpret the
-- output per the notes above each block — then decide whether to fix or not.
--
-- These queries are READ-ONLY. None of them modify data.

-- =====================================================================
-- FINDING #11 — Rate limiting on link-password verification
-- Question: Does verify-link-password actually have a rate-limit table or
-- function? Or is it truly unlimited?
-- =====================================================================

-- 11a. Check if there's any rate-limit table for password attempts
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (table_name ILIKE '%password_attempt%'
       OR table_name ILIKE '%rate_limit%'
       OR table_name ILIKE '%link_password%');

-- 11b. Check if any RPC function handles password rate limiting
SELECT proname, pg_get_function_arguments(oid) AS args
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND (proname ILIKE '%password%'
       OR proname ILIKE '%rate_limit%');

-- 11c. Inspect check_rate_limit function definition (if present)
SELECT prosrc
FROM pg_proc
WHERE proname = 'check_rate_limit'
  AND pronamespace = 'public'::regnamespace
LIMIT 1;

-- Interpretation: if 11a returns no password-specific table AND 11c shows
-- check_rate_limit is generic (keyed by p_endpoint), then verify-link-password
-- needs to start calling check_rate_limit with a dedicated endpoint key,
-- otherwise every password-protected link is brute-forceable.


-- =====================================================================
-- FINDING #16 — fast-redirect references columns that may not exist
-- Question: Does the live `links` table actually have cache_priority,
-- health_status, sentinel_enabled, sentinel_config columns?
-- =====================================================================

-- 16a. List all columns on the links table so you can eyeball what's present
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'links'
ORDER BY ordinal_position;

-- 16b. Explicit presence check for the columns fast-redirect reads
SELECT
  bool_or(column_name = 'cache_priority')    AS has_cache_priority,
  bool_or(column_name = 'health_status')     AS has_health_status,
  bool_or(column_name = 'sentinel_enabled')  AS has_sentinel_enabled,
  bool_or(column_name = 'sentinel_config')   AS has_sentinel_config,
  bool_or(column_name = 'campaign_id')       AS has_campaign_id
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'links';

-- Interpretation: any `false` means the corresponding feature is silently
-- a no-op on this DB. Either run the migration that adds it, or remove the
-- column from the edge function SELECT to avoid confusion.


-- =====================================================================
-- FINDING #21 — password_hash exposure via RLS
-- Question: Can an authenticated user of workspace A read password_hash
-- for links in workspace A (so offline-crackable)?
-- =====================================================================

-- 21a. See which RLS policies exist on links
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'links'
ORDER BY policyname;

-- 21b. Check if there's a column-level grant revocation for password_hash
SELECT grantee, privilege_type, is_grantable
FROM information_schema.column_privileges
WHERE table_schema = 'public'
  AND table_name = 'links'
  AND column_name = 'password'; -- note: column is 'password' in redirect code

-- 21c. Confirm whether the password column is plaintext or hashed.
-- Look at a couple of rows (masked to avoid leaking). If the column values
-- are exactly 60 chars and start with $2a$/$2b$/$2y$ it's bcrypt. If they
-- look like plain text, that's a critical secondary bug.
SELECT
  CASE
    WHEN password IS NULL THEN 'null'
    WHEN password ~ '^\$2[aby]\$[0-9]{2}\$' THEN 'bcrypt'
    WHEN password ~ '^\$argon2' THEN 'argon2'
    WHEN length(password) = 64 AND password ~ '^[0-9a-f]+$' THEN 'likely sha256'
    ELSE 'possibly plaintext — INVESTIGATE'
  END AS password_format,
  count(*) AS n
FROM public.links
WHERE password IS NOT NULL
GROUP BY 1;

-- Interpretation:
--   * If 21a shows any SELECT policy that returns entire rows without
--     a column filter, authenticated workspace members can read `password`.
--   * Most secure fix: move passwords to a separate table link_passwords
--     with RLS that only the link creator can SELECT, and have the redirect
--     function use a SECURITY DEFINER RPC to verify.
--   * 21c tells you what kind of hash you're dealing with — if plaintext,
--     rotate ALL protected links immediately and migrate to bcrypt.


-- =====================================================================
-- BONUS — quick health checks worth running
-- =====================================================================

-- Any orphaned public links pointing at a workspace that no longer exists?
SELECT l.id, l.slug, l.workspace_id
FROM public.links l
LEFT JOIN public.workspaces w ON w.id = l.workspace_id
WHERE w.id IS NULL
LIMIT 20;

-- Any links with legacy defaults (domain='keka.com' / path='go') — these
-- were created before the WelcomeModal fix and will redirect to the wrong
-- host on utm.click/utm.one.
SELECT id, slug, domain, path, destination_url, created_at
FROM public.links
WHERE domain = 'keka.com'
   OR path = 'go'
ORDER BY created_at DESC
LIMIT 50;

-- The stale "test" link the user hit earlier — confirm and optionally delete
SELECT id, slug, domain, path, destination_url, title, created_at
FROM public.links
WHERE slug = 'test' AND domain IN ('utm.click', 'utm.one');
-- If you confirm it's junk, delete it with:
--   DELETE FROM public.links WHERE id = '<id from above>';

-- Sanity-check the BEFORE-INSERT triggers on link_clicks — should be 2.
-- If there are 5+, investigate — triggers compound latency quickly.
SELECT trigger_name, action_timing, event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'link_clicks'
ORDER BY trigger_name;

-- List indexes on link_clicks — the uniqueness check query needs a specific
-- composite index. If (link_id, ip_address, user_agent, clicked_at) is NOT
-- present, clicks will be slow under load.
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'link_clicks'
ORDER BY indexname;
